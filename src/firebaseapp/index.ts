import { FirebaseApp, initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  setDoc,
  arrayUnion,
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
} from 'firebase/firestore'
import {
  FirebaseStorage,
  getStorage,
  uploadBytesResumable,
  ref,
  StorageReference,
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
  read?: boolean
  refId: string
  user: string
}

export class FirebaseRealtimeMessaging<
  T extends Record<string, any> = Record<string, any>
> {
  private id: string = ''
  private db: string = ''
  private lastPage: QuerySnapshot<DocumentData> | undefined
  constructor(id: string, db: 'chat' | 'notif') {
    this.id = id
    this.db = db
  }

  public async sendData(data: T) {
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

  public listen<V extends Record<string, any> = Record<string, any>>(
    cb: (value: (V & DateAndRef)[]) => void,
    cbModified?: (value: (V & DateAndRef)[]) => void,
    cbDeleted?: (value: (V & DateAndRef)[]) => void
  ) {
    const q = query(
      collection(db, this.db),
      where('user', '==', this.id),
      orderBy('created', 'desc')
    )

    return onSnapshot(q, (snapshot) => {
      const added: (V & DateAndRef)[] = []
      const deleted: (V & DateAndRef)[] = []
      const modified: (V & DateAndRef)[] = []
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          added.push({ ...(change.doc.data() as any), refId: change.doc.id })
        }
        if (change.type === 'removed') {
          deleted.push({ ...(change.doc.data() as any), refId: change.doc.id })
        }

        if (change.type === 'modified') {
          modified.push({ ...(change.doc.data() as any), refId: change.doc.id })
        }
      })
      let timeout = 100
      cb(added)
      if (!!cbModified) {
        setTimeout(() => cbModified(modified), timeout)
        timeout += 100
      }
      if (!!cbDeleted) {
        setTimeout(() => cbDeleted(deleted), timeout)
      }
    })
  }

  public async getData<V extends Record<string, any> = Record<string, any>>(
    lim: number | undefined = 20
  ) {
    try {
      const l = lim ?? 20
      let q = !this.lastPage
        ? query(
            collection(db, this.db),
            where('user', '==', this.id),
            orderBy('created', 'desc'),
            limit(l)
          )
        : query(
            collection(db, this.db),
            where('user', '==', this.id),
            orderBy('created', 'desc'),
            startAfter(this.lastPage.docs[this.lastPage.docs.length - 1]),
            limit(l)
          )

      const snapshot = await getDocs(q)
      const value: (V & DateAndRef)[] = []
      snapshot.forEach((v) => {
        value.push({ ...(v.data() as any), refId: v.id })
      })

      return value
    } catch (e) {
      return []
    }
  }

  public async readData() {
    const batch = writeBatch(db)
    const q = query(
      collection(db, this.db),
      where('user', '==', this.id),
      where('from', '!=', this.id),
      where('read', '==', false)
    )

    const snap = await getDocs(q)

    snap.forEach((v) => {
      const ref = doc(db, this.db, v.id)
      batch.update(ref, { read: true })
    })

    await batch.commit()
  }

  public async getUnreadCount() {
    const q = query(
      collection(db, this.db),
      where('user', '==', this.id),
      where('from', '!=', this.id),
      where('read', '==', false)
    )
    const snap = await getDocs(q)

    return snap.size
  }
}
