import { API, apiAuth } from '../utils'
import { TokenDTO } from '../dto'
import Cookies from 'js-cookie'
import { RequiredFiles, UserInfo } from 'constant'

export const registerUser = async (data?: UserInfo & RequiredFiles) => {
  try {
    if (!data) return null
    const response = await API.post('/user/register', data)

    const { accessToken, refreshToken }: TokenDTO = response.data
    localStorage.setItem('accessToken', accessToken)
    Cookies.set('refreshToken', refreshToken)
    return response.data
  } catch (e) {
    throw e
  }
}

export const me = async () => {
  try {
    const response = await apiAuth.get('/user/me')
    return response.data
  } catch {
    return undefined
  }
}

export const reset = async (token: string, password: string) => {
  try {
    const response = await API.post(
      '/user/reset',
      { password },
      { headers: { Authorization: 'Bearer ' + token } }
    )
    return response.data
  } catch {
    return undefined
  }
}

export const loginUser = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  try {
    const response = await API.post('/user/regularLogin', { email, password })

    const { accessToken, refreshToken }: TokenDTO = response.data
    localStorage.setItem('accessToken', accessToken)
    Cookies.set('refreshToken', refreshToken)
  } catch (e) {
    throw e
  }
}

export const verifyUser = async ({ code }: { code: string }) => {
  try {
    const response = await apiAuth.post('/user/verify', { code })
    const { accessToken, refreshToken }: TokenDTO = response.data
    localStorage.setItem('accessToken', accessToken)
    Cookies.set('refreshToken', refreshToken)
    return true
  } catch (e) {
    throw e
  }
}
export const refreshVerifCode = async () => {
  try {
    const response = await apiAuth.get('/user/refresh-code')
    return true
  } catch (e) {
    throw e
  }
}

export const resetPass = async (email: string) => {
  const response = await API.get(`/user/forgot-pass`, {
    params: {
      email,
    },
  })
  return response
}
