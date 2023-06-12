import axios from 'axios'
import { refreshToken } from '../api'
import { compareDesc } from 'date-fns'
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'

export const API = axios.create({
  baseURL: process.env.API,
})

export const apiRefreshAuth = axios.create({
  baseURL: process.env.API,
})

export const apiAuth = axios.create({
  baseURL: process.env.API,
})

export const validateToken = (token?: string) => {
  if (token && token.length > 0) {
    const { exp: jwtExpiryInSecs } = (jwt_decode(token) as any) || ({} as any)
    const tokenOptions = !jwtExpiryInSecs
      ? {}
      : { expires: new Date(jwtExpiryInSecs * 1000) }
    return tokenOptions?.expires
      ? compareDesc(new Date(), tokenOptions?.expires) === 1
      : false
  }
  return false
}

const runOnlyWhen = () => {
  const isTokenValid = validateToken(Cookies.get('accessToken') ?? '')
  return isTokenValid
}

apiRefreshAuth.interceptors.request.use(
  async (config) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${Cookies.get('refreshToken')}`,
    } as any
    return config
  },
  (error) => Promise.reject(error)
)

apiAuth.interceptors.request.use(
  async (config) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${Cookies.get('accessToken')}`,
    } as any
    return config
  },
  (error) => Promise.reject(error),
  { runWhen: runOnlyWhen }
)

apiAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const hasErrored = error.response && error.response.status === 403

    if (hasErrored && originalRequest && !originalRequest._markForRetry) {
      originalRequest._markForRetry = true
      // Before retrying the request, repair the Authorization with fresh tokens from API
      try {
        const { accessToken } = await refreshToken()
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
        return apiAuth(originalRequest)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    // clear out all tokens if we get unauthorized error and force user to login
    if (error?.response?.status === 401) {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
    }

    return Promise.reject(error)
  },

  { runWhen: runOnlyWhen }
)
