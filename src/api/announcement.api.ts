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
