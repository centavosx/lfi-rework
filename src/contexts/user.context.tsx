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
import { useRouter as useNav } from 'next/router'
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

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { refresh } = useRouter()
  const { pathname } = useNav()
  const token = Cookies.get('accessToken')
  const [user, setUser] = useState<User | undefined>(
    !!token ? jwt_decode(token) : undefined
  )

  const device = useContext(IPAndDeviceContext)

  const getMe = async (reload?: boolean) => {
    setUser(await me())
    if (reload) refresh()
  }

  useEffect(() => {
    getMe()
  }, [token])

  useEffect(() => {
    if (
      user?.status === UserStatus.ACTIVE &&
      checkRoles(user.roles).isUser &&
      pathname.startsWith('/user/waiting')
    ) {
      Cookies.set('isLoggedin', 'true')
    } else if (user?.status === UserStatus.EXPELLED) {
      logout()
    }
  }, [user])

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
    Cookies.remove('refreshToken')
    Cookies.remove('accessToken')
    if (!!user) {
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
    <DataContext.Provider value={provider}>{children}</DataContext.Provider>
  )
}
