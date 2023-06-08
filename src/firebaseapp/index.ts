import { FirebaseApp, initializeApp } from 'firebase/app'
import { Database, getDatabase } from 'firebase/database'
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
const databaseApp = getDatabase(initialized)
const storage = getStorage(initialized)

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
    console.log('HAY')
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
