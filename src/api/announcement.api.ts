import { apiAuth } from '../utils'

export const getAnnouncements = async (data?: {
  page: number
  limit: number
  other: any
}) => {
  if (!data) return null

  const { page, limit, other } = data

  const response = await apiAuth.get('/announcements', {
    params: {
      page,
      limit,
      ...other,
    },
  })

  return response
}

export const postAnnouncement = async (data?: {
  title: string
  description: string
}) => {
  try {
    if (!data) return false
    const response = await apiAuth.post('/announcements', data)
    return true
  } catch (e) {
    throw e
  }
}

export const deleteAnnouncement = async (id: string) => {
  try {
    const response = await apiAuth.delete('/announcements/' + id)
    return true
  } catch (e) {
    throw e
  }
}
