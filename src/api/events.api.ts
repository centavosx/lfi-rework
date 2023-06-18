import { apiAuth } from '../utils'

import { EventDto } from 'constant'

export const postEvent = async (data?: EventDto) => {
  try {
    const response = await apiAuth.post('/events', data)
    return response.data
  } catch (e) {
    throw e
  }
}
export const getMonthlyEvents = async (data?: {
  startDate: Date
  endDate: Date
}) => {
  const response = await apiAuth.get('/events/all', {
    params: {
      ...data,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  })
  return response
}

export const getDailyEvents = async (data?: {
  startDate: Date
  endDate: Date
}) => {
  const response = await apiAuth.get('/events', {
    params: {
      ...data,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  })
  return response
}

export const deleteEvent = async (id: string) => {
  try {
    const response = await apiAuth.delete('/events/' + id)
    return true
  } catch (e) {
    throw e
  }
}

export const patchEvent = async (data?: EventDto & { id: string }) => {
  try {
    if (!data) return null
    const values = structuredClone<Partial<typeof data>>(data)
    const uid = data.id

    delete values.id
    const response = await apiAuth.patch('/events/' + uid, values)
    return response.data
  } catch (e) {
    throw e
  }
}
