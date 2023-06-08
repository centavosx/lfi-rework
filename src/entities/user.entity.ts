import { Level } from 'constant'

export enum UserStatus {
  EXPELLED = 'expelled',
  ACTIVE = 'active',
  PENDING = 'pending',
  CANCELED = 'cancelled',
  VERIFIED = 'verified',
}

export enum Roles {
  ADMIN = 'admin',
  ADMIN_READ = 'admin-read',
  ADMIN_WRITE = 'admin-write',
  SUPER = 'super',
  USER = 'user',
}

export type Role = {
  id: string
  name: Roles
}

export type User = {
  id: string

  fname: string

  mname: string | null

  lname: string

  email: string

  status: UserStatus

  address?: string | null

  level?: Level | null

  program?: string | null

  idPic?: string | null

  ncae?: string | null

  certificate?: string | null

  pantawid?: string | null

  gradeSlip?: string | null

  birthCert?: string | null

  homeSketch?: string | null

  waterBill?: string | null

  electricBill?: string | null

  wifiBill?: string | null

  enrollmentBill?: string | null

  roles: Role[]

  created: Date

  modified: Date

  deleted?: Date | null
}
