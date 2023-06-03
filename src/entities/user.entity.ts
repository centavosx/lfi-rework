import { Services } from './service.entity'

export type Availability = {
  id: string

  startDate: Date

  endDate: Date
}

export type User = {
  id: string

  name: string

  description: string

  hasAm?: boolean

  hasPm?: boolean

  email: string

  position: string

  services: Services[]

  availability: Availability[]

  created: Date

  modified: Date

  verified: boolean
}
