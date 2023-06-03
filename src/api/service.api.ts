import { API } from '../utils'

export const getAllService = async (
  page?: number,
  limit?: number,
  other?: any
) => {
  const response = await API.get('/service', {
    params: {
      page,
      limit,
      ...other,
    },
  })
  return response
}
