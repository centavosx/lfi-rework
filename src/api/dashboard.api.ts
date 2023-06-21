import { UserStatus } from 'entities'
import { apiAuth } from '../utils'

export const getDashboard = async ({
  status,
  isCollege,
}: {
  status: UserStatus
  isCollege?: string
}) => {
  try {
    const response = await apiAuth.get('/dashboard', {
      params: {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        status,
        isCollege,
      },
    })
    return response
  } catch (e) {
    throw e
  }
}
