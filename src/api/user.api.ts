import { API, apiAuth } from '../utils'
import { TokenDTO } from '../dto'
import Cookies from 'js-cookie'
import { RequiredFiles, UserInfo, RegisterDto } from 'constant'
import { Roles, UserStatus } from 'entities'

export const registerUser = async (data?: UserInfo & RequiredFiles) => {
  try {
    if (!data) return null
    const response = await API.post('/user/register', data)

    const { accessToken, refreshToken }: TokenDTO = response.data
    Cookies.set('accessToken', accessToken)
    Cookies.set('refreshToken', refreshToken)
    return response.data
  } catch (e) {
    throw e
  }
}

export const updateMe = async (
  data?: Partial<UserInfo & RequiredFiles & { old: string; password: string }>
) => {
  try {
    if (!data) return null
    const response = await apiAuth.patch('/user/me', data)

    return response.data
  } catch (e) {
    throw e
  }
}

export const updateUser = async (
  data?: Partial<
    UserInfo &
      RequiredFiles & {
        status?: UserStatus
        scholarStatus?: 'started' | 'rejected' | 'ended'
        isShsGraduate?: boolean
        isCollegeGraduate?: boolean
      }
  > & {
    id: string
  }
) => {
  try {
    if (!data) return null
    const values = structuredClone<Partial<typeof data>>(data)
    const uid = data.id

    delete values.id

    const response = await apiAuth.patch('/user/' + uid, values)

    return response.data
  } catch (e) {
    throw e
  }
}

export const createUser = async (data?: RegisterDto) => {
  try {
    const response = await apiAuth.post('/user', data)
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

export const getUserInfo = async (id?: string) => {
  try {
    const response = await apiAuth.get('/user/' + id)
    return response
  } catch (e) {
    throw e
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

export const loginUser = async (
  data:
    | {
        email: string
        password: string
        isUser: boolean
      }
    | undefined
) => {
  try {
    if (!data) return false
    const response = await API.post(
      `/user/${data.isUser ? 'regularLogin' : 'login'}`,
      {
        email: data?.email,
        password: data?.password,
      }
    )
    const { accessToken, refreshToken }: TokenDTO = response.data
    Cookies.set('accessToken', accessToken)
    Cookies.set('refreshToken', refreshToken)
    return true
  } catch (e) {
    throw e
  }
}

export const verifyUser = async (data?: { code: string }) => {
  try {
    if (!data) return false
    const response = await apiAuth.post('/user/verify', { code: data.code })
    const { accessToken, refreshToken }: TokenDTO = response.data
    Cookies.set('accessToken', accessToken)
    Cookies.set('refreshToken', refreshToken)
    return true
  } catch (e) {
    throw e
  }
}
export const refreshVerifCode = async () => {
  try {
    await apiAuth.get('/user/refresh-code')
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

export type GetAllUserType = {
  search?: string
  role?: Roles[]
  status?: UserStatus[]
  sort?: 'ASC' | 'DESC'
  id?: string
}

export const getAllUser = async (data?: {
  page: number
  limit: number
  other: GetAllUserType
}) => {
  if (!data) return null

  const { page, limit, other } = data

  const response = await apiAuth.get('/user', {
    params: {
      page,
      limit,
      ...other,
    },
  })
  return response
}

export const deleteRole = async (data: { ids: string[] }, role: Roles[]) => {
  const response = await apiAuth.patch(`/user/role/delete`, data, {
    params: {
      role,
    },
  })
  return response
}

export const updateRole = async (data?: { id: string; role: Roles[] }) => {
  try {
    if (!data) return false
    const response = await apiAuth.patch('/user/role', data)
    return true
  } catch (e) {
    throw e
  }
}

export const renewalScholar = async (data?: {
  id: string
  lastGwa: number
  level: string
  education: string
  program: string
  gradeSlip: string
  enrollmentBill?: string
}) => {
  try {
    if (!data) throw new Error()

    const id = data.id
    const response = await apiAuth.post('/user/renewal/' + id, {
      ...data,
      id: undefined,
    })
    return response.data
  } catch (e) {
    throw e
  }
}

export const submitBill = async (data?: {
  id: string

  enrollmentBill: string
}) => {
  try {
    if (!data) throw new Error()

    const id = data.id
    const response = await apiAuth.post('/user/enrollmentBill/' + id, {
      ...data,
      id: undefined,
    })
    return response.data
  } catch (e) {
    throw e
  }
}
