import { API, apiAuth } from '../utils'
import { TokenDTO } from '../dto'
import Cookies from 'js-cookie'

export const registerUser = async ({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) => {
  const response = await API.post('/user/register', {
    name,
    email,
    password,
  })

  const { accessToken, refreshToken }: TokenDTO = response.data
  localStorage.setItem('accessToken', accessToken)
  Cookies.set('refreshToken', refreshToken)
}

export const me = async () => {
  try {
    const response = await apiAuth.get('/user/me/information')
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
  } catch (e) {
    throw e
  }
}
export const refreshVerifCode = async () => {
  const response = await apiAuth.get('/user/refresh-code')
  return response
}

export const resetPass = async (email: string) => {
  const response = await API.get(`/user/forgot-pass`, {
    params: {
      email,
    },
  })
  return response
}
