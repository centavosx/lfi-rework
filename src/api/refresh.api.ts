import { apiRefreshAuth } from '../utils'
import { TokenDTO } from '../dto'
import Cookies from 'js-cookie'

export const refreshToken = async (): Promise<TokenDTO> => {
  const response = await apiRefreshAuth.get('/refresh')

  const { accessToken, refreshToken }: TokenDTO = response.data

  localStorage.setItem('accessToken', accessToken)
  Cookies.set('refreshToken', refreshToken)

  return { accessToken, refreshToken }
}
