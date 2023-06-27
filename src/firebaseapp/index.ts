import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  Timestamp,
  limit,
  startAfter,
  getDocs,
  QuerySnapshot,
  DocumentData,
  addDoc,
  Unsubscribe,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  DocumentChangeType,
  getDoc,
  runTransaction,
} from 'firebase/firestore'
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
  UploadTask,
  TaskState,
  StorageError,
  deleteObject,
} from 'firebase/storage'

const initialized = initializeApp({
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_ID,
  appId: process.env.FB_APP_ID,
  databaseURL: process.env.FB_DATABASE_URL,
})

const storage = getStorage(initialized)
const db = getFirestore(initialized)

export class Firebase {
  private uploadTask!: UploadTask
  private id!: string
  constructor(id: string) {
    this.id = id
  }

  public uploadFile(file: File) {
    const storageRef = ref(
      storage,
      this.id + '/' + (new Date().getTime() + '-' + file.name)
    )
    this.uploadTask = uploadBytesResumable(storageRef, file)
  }

  public uploadControls() {
    return {
      pause: () => this.uploadTask?.pause(),
      stop: () => this.uploadTask?.cancel(),
      resume: () => this.uploadTask?.resume(),
    }
  }

  public listenUpload(
    cb: (progress: number, state: TaskState) => void,
    onSuccess?: (link: string | undefined) => void,
    error?: (error: StorageError) => void
  ) {
    this.uploadTask?.on(
      'state_changed',
      (snapshot) => {
        cb(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          snapshot.state
        )
      },
      (err) => error?.(err),
      () => {
        getDownloadURL(this.uploadTask.snapshot.ref).then((link) =>
          onSuccess?.(link)
        )
      }
    )
  }

  public deleteUploadedFile() {
    return new Promise<boolean>((resolve, reject) => {
      if (!this.uploadTask?.snapshot?.ref) reject('Error')
      deleteObject(this.uploadTask?.snapshot?.ref)
        .then(() => resolve(true))
        .catch(() => resolve(false))
    })
  }
}

type DateAndRef = {
  created: number
  modified?: number
  refId: string
}

abstract class FirebaseBody<
  T extends Record<string, any> = Record<string, any>,
  V extends Record<string, any> = Record<string, any>
> {
  public id?: string = ''
  public db: string
  public querySearch: [
    QueryFieldFilterConstraint | undefined,
    QueryOrderByConstraint
  ]
  public lastPage: QuerySnapshot<DocumentData> | undefined

  constructor(
    id: string,
    db: string,
    query: [QueryFieldFilterConstraint | undefined, QueryOrderByConstraint]
  ) {
    this.id = id
    this.db = db
    this.querySearch = query
  }

  public async sendData(data: T): Promise<void> {
    try {
      await addDoc(collection(db, this.db), {
        user: this.id,
        ...data,
        read: false,
        created: Timestamp.now().toMillis(),
      })
    } catch (e) {
      console.log(e)
    }
  }

  public listen(
    cb: (value: V & DateAndRef, type: DocumentChangeType) => void
  ): Unsubscribe {
    const q = query(
      collection(db, this.db),
      ...(this.querySearch.filter((v) => v !== undefined) as any),
      limit(1)
    )

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        cb({ ...(change.doc.data() as any), refId: change.doc.id }, change.type)
      })
    })
  }

  public async getData(lim: number | undefined = 20) {
    try {
      const l = lim ?? 20
      let q = !this.lastPage
        ? query(
            collection(db, this.db),
            ...(this.querySearch.filter((v) => v !== undefined) as any),
            limit(l)
          )
        : query(
            collection(db, this.db),
            ...(this.querySearch.filter((v) => v !== undefined) as any),
            startAfter(this.lastPage.docs[this.lastPage.docs.length - 1]),
            limit(l)
          )

      const snapshot = await getDocs(q)

      this.lastPage = snapshot
      console.log(q)
      const value: (V & DateAndRef)[] = []
      snapshot.forEach((v) => {
        value.push({ ...(v.data() as any), refId: v.id })
      })

      return value
    } catch (e) {
      return []
    }
  }

  abstract readData(id?: string): Promise<void>

  abstract getUnreadCount(id?: string): Promise<number>
}

export class FirebaseAdminRealtimeMessaging<
  T extends Record<string, any> = Record<string, any>,
  V extends Record<string, any> = Record<string, any>
> extends FirebaseBody<T, V> {
  constructor(id: string) {
    super(id, 'users', [undefined, orderBy('chatModified', 'desc')])
  }

  public async readData(id?: string | undefined): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        const q = query(collection(db, this.db), where('id', '==', id))

        const snap = await getDocs(q)

        snap.forEach((v) => {
          const ref = doc(db, this.db, v.id)
          transaction.update(ref, { read: true })
        })
      })
    } catch {}
  }
  public async getUnreadCount() {
    const q = query(collection(db, this.db), where('read', '==', false))
    const snap = await getDocs(q)

    return snap.size
  }
}

export class FirebaseRealtimeMessaging<
  T extends Record<string, any> = Record<string, any>,
  V extends Record<string, any> = Record<string, any>
> extends FirebaseBody<T, V> {
  private refId?: string

  constructor(id: string) {
    super(id, 'chat', [where('user', '==', id), orderBy('created', 'desc')])
  }

  public async sendData(data: T): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        const newDoc = doc(collection(db, this.db))
        transaction.set(doc(db, this.db, newDoc.id), {
          user: this.id,
          ...data,
          read: false,
          created: Timestamp.now().toMillis(),
        })

        if (!this.refId) {
          const q = query(
            collection(db, 'users'),
            where('id', '==', this.id),
            limit(1)
          )

          const searchQuery = await getDocs(q)

          if (searchQuery.empty) {
            const newUser = doc(collection(db, 'users'))
            this.refId = newUser.id
            transaction.set(doc(db, 'users', newUser.id), {
              id: this.id,
              lastMessage: data.message,
              read: this.id !== data.from,
              chatModified: Timestamp.now().toMillis(),
            })
            return
          } else {
            searchQuery.forEach((v) => {
              this.refId = v.id
            })
          }
        }

        const ref = doc(db, 'users', this.refId!)
        transaction.update(ref, {
          lastMessage: data.message,
          read: this.id !== data.from,
          chatModified: Timestamp.now().toMillis(),
        })
      })
    } catch (e) {
      console.log(e)
    }
  }

  public async readData(id: string) {
    try {
      await runTransaction(db, async (transaction) => {
        const q = query(
          collection(db, this.db),
          this.querySearch[0]!,
          where('from', '!=', id),
          where('read', '==', false)
        )

        const snap = await getDocs(q)

        snap.forEach((v) => {
          const ref = doc(db, this.db, v.id)
          transaction.update(ref, { read: true })
        })
      })
    } catch {}
  }

  public async getUnreadCount(id: string) {
    const q = query(
      collection(db, this.db),
      this.querySearch[0]!,
      where('from', '!=', id),
      where('read', '==', false)
    )
    const snap = await getDocs(q)

    return snap.size
  }
}

export class FirebaseRealtimeNotifications<
  T extends Record<string, any> = Record<string, any>,
  V extends Record<string, any> = Record<string, any>
> extends FirebaseBody<T, V> {
  constructor(id: string, isNotAll?: boolean) {
    super(id, 'notifications', [
      where('user', 'in', isNotAll ? [id] : [id, 'all']),
      orderBy('created', 'desc'),
    ])
  }

  public async readData() {
    await addDoc(collection(db, 'read'), {
      user: this.id,
      created: Timestamp.now().toMillis(),
    })
  }

  public async getUnreadCount() {
    const q = query(
      collection(db, 'read'),
      where('user', '==', this.id),
      orderBy('created', 'desc'),
      limit(1)
    )

    let dateInNum: number = 0
    const snap = await getDocs(q)

    snap.forEach((v) => {
      dateInNum = v.data().created
    })

    const q2 = query(
      collection(db, this.db),
      this.querySearch[0]!,
      where('created', '>', dateInNum)
    )

    const snap2 = await getDocs(q2)

    return snap2.size
  }
}

export class FirebaseReadListen {
  private id: string
  constructor(id: string) {
    this.id = id
  }

  public listen(cb: () => void): Unsubscribe {
    const q = query(
      collection(db, 'read'),
      where('user', '==', this.id),
      limit(1)
    )

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(() => {
        cb()
      })
    })
  }
}

export enum LogsEvents {
  signed = 'SIGNED IN',
  logout = 'LOGOUT',
  register = 'REGISTER',
  navigate = 'PAGE NAVIGATE',
  chat = 'CHAT',
}

export type LogsProp = {
  ip: string
  user: string
  browser: string
  device: string
  event: LogsEvents
  other?: string
}

export class Logs {
  private lastPage?: QuerySnapshot<DocumentData>

  public constructor(data?: LogsProp) {
    if (!data) return
    try {
      addDoc(collection(db, 'logs'), {
        ...data,
        created: Timestamp.now().toMillis(),
      })
    } catch (e) {
      console.log(e)
    }
  }

  public listen(
    cb: (value: LogsProp & { refId: string }, type: DocumentChangeType) => void
  ): Unsubscribe {
    const q = query(
      collection(db, 'logs'),
      orderBy('created', 'desc'),
      limit(1)
    )

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        cb({ ...(change.doc.data() as any), refId: change.doc.id }, change.type)
      })
    })
  }

  public async getData(lim: number | undefined = 20) {
    try {
      const l = lim ?? 20
      let q = !this.lastPage
        ? query(collection(db, 'logs'), orderBy('created', 'desc'), limit(l))
        : query(
            collection(db, 'logs'),
            orderBy('created', 'desc'),
            startAfter(this.lastPage.docs[this.lastPage.docs.length - 1]),
            limit(l)
          )

      const snapshot = await getDocs(q)

      this.lastPage = snapshot

      const value: (LogsProp & { refId: string })[] = []
      snapshot.forEach((v) => {
        value.push({ ...(v.data() as any), refId: v.id })
      })

      return value
    } catch (e) {
      return []
    }
  }
}
