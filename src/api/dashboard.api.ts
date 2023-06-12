import { apiAuth } from '../utils'

export const getDashboard = async () => {
  try {
    const response = await apiAuth.get('/dashboard', {
      params: {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    })
    return response
  } catch (e) {
    throw e
  }
}
