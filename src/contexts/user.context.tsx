import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react'
import { User, UserStatus } from '../entities'
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import { me } from '../api'
import { checkRoles } from 'hooks'
import { IPAndDeviceContext } from './ip-and-device.context'
import { Logs, LogsEvents } from 'firebaseapp'

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
  const device = useContext(IPAndDeviceContext)

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
    if (!!device.ip) {
      new Logs({
        user: !!user ? user.id : 'anonymous',
        ip: device.ip,
        event: LogsEvents.logout,
        browser: device?.browser?.name + ' v' + device?.browser?.version,
        device: device?.os?.name + ' v' + device?.os?.version,
      })
    }
    if (!!user) {
      Cookies.remove('refreshToken')
      Cookies.remove('accessToken')
      setUser(undefined)
      refresh()
    }
  }, [setUser, user, device])

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
