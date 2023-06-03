import React, { createContext, useCallback, useState, useEffect } from 'react'
import { User } from '../entities'
import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'
import { me } from '../api'

type DataType = {
  user: User | undefined
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>
  refetch: () => Promise<unknown>
  logout: () => void
}

export const DataContext = createContext<DataType>({} as DataType)

export const DataProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

  const [user, setUser] = useState<User | undefined>(
    !!token ? jwt_decode(token) : undefined
  )

  const getMe = useCallback(async () => {
    setUser(await me())
  }, [setUser])

  useEffect(() => {
    getMe()
  }, [getMe, token])

  const logout = useCallback(() => {
    Cookies.remove('refreshToken')
    localStorage.clear()
    setUser(undefined)
  }, [setUser])

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
