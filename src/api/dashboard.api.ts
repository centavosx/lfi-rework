import { UserStatus } from 'entities'
import { apiAuth } from '../utils'

export const getDashboard = async (status: UserStatus) => {
  try {
    const response = await apiAuth.get('/dashboard', {
      params: {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        status,
      },
    })
    return response
  } catch (e) {
    throw e
  }
}
