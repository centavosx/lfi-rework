import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { User, UserStatus } from '../entities'
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import { me } from '../api'
import { checkRoles } from 'hooks'

type DataType = {
  user: User | undefined
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
  refetch: (reload?: boolean) => Promise<unknown>
  logout: () => void
}

export const DataContext = createContext<DataType>({} as DataType)

export const DataProvider = ({
  children,
}: {
  children: (status?: ReturnType<typeof checkRoles>) => ReactNode
}) => {
  const { refresh } = useRouter()
  const token = Cookies.get('accessToken')
  const [user, setUser] = useState<User | undefined>(
    !!token ? jwt_decode(token) : undefined
  )

  const getMe = useCallback(
    async (reload?: boolean) => {
      setUser(await me())
      if (reload) refresh()
    },
    [setUser]
  )

  useEffect(() => {
    getMe()
  }, [getMe, token])

  const logout = useCallback(() => {
    Cookies.remove('refreshToken')
    Cookies.remove('accessToken')
    setUser(undefined)
    refresh()
  }, [setUser])

  const provider: DataType = {
    user,
    setUser,
    refetch: getMe,
    logout,
  }

  return (
    <DataContext.Provider value={provider}>
      {children(checkRoles(user?.roles))}
    </DataContext.Provider>
  )
}
