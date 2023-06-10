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
