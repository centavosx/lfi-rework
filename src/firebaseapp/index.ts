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
  writeBatch,
  Unsubscribe,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  documentId,
  DocumentChangeType,
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
  apiKey: 'AIzaSyCQGoZzlG256V4IruJAtB7TaB8hAojcNxE',
  authDomain: 'laofi-d1191.firebaseapp.com',
  projectId: 'laofi-d1191',
  storageBucket: 'laofi-d1191.appspot.com',
  messagingSenderId: '575738894689',
  appId: '1:575738894689:web:95fbc9017799730c890d20',
  databaseURL:
    'https://laofi-d1191-default-rtdb.asia-southeast1.firebasedatabase.app',
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
  public id: string = ''
  public db: string
  public querySearch: [QueryFieldFilterConstraint, QueryOrderByConstraint]
  public lastPage: QuerySnapshot<DocumentData> | undefined

  constructor(
    id: string,
    db: string,
    query: [QueryFieldFilterConstraint, QueryOrderByConstraint]
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
    const q = query(collection(db, this.db), ...this.querySearch, limit(1))

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
        ? query(collection(db, this.db), ...this.querySearch, limit(l))
        : query(
            collection(db, this.db),
            ...this.querySearch,
            startAfter(this.lastPage.docs[this.lastPage.docs.length - 1]),
            limit(l)
          )

      const snapshot = await getDocs(q)

      this.lastPage = snapshot

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

export class FirebaseRealtimeMessaging<
  T extends Record<string, any> = Record<string, any>,
  V extends Record<string, any> = Record<string, any>
> extends FirebaseBody<T, V> {
  constructor(id: string) {
    super(id, 'chat', [where('user', '==', id), orderBy('created', 'desc')])
  }

  public async readData(id: string) {
    const batch = writeBatch(db)
    const q = query(
      collection(db, this.db),
      this.querySearch[0],
      where('from', '!=', id),
      where('read', '==', false)
    )

    const snap = await getDocs(q)

    snap.forEach((v) => {
      const ref = doc(db, this.db, v.id)
      batch.update(ref, { read: true })
    })

    await batch.commit()
  }

  public async getUnreadCount(id: string) {
    const q = query(
      collection(db, this.db),
      this.querySearch[0],
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
  constructor(id: string) {
    super(id, 'notifications', [
      where('user', 'in', [id, 'all']),
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

    // if (dateInNum === 0) return 0

    const q2 = query(
      collection(db, this.db),
      this.querySearch[0],
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
