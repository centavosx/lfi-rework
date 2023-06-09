import { Role, Roles, User, UserStatus } from 'entities'

import { useRouter } from 'next/router'
import { useContext, useEffect, useRef, useState } from 'react'
import { DataContext } from '../contexts'

export const useUser = () => {
  const { user, logout, refetch } = useContext(DataContext)

  return { user: user, logout, refetch }
}

export const checkRoles = (roles?: Role[]) => {
  let isAdmin = false
  let isUser = false
  let isSuper = false
  let isAdminRead = false
  let isAdminWrite = false

  if (!!roles)
    roles.forEach((v) => {
      switch (v.name) {
        case Roles.USER:
          isUser = true
          break
        case Roles.ADMIN:
          isAdmin = true
          break
        case Roles.ADMIN_READ:
          isAdminRead = true
          break
        case Roles.ADMIN_WRITE:
          isAdminWrite = true
          break
        case Roles.SUPER:
          isSuper = true
          break
      }
    })

  return {
    isAdmin,
    isUser,
    isSuper,
    isAdminRead,
    isAdminWrite,
  }
}

const PAGES_WITH_NO_GUARD = ['/', '/login', '/register']

export const useUserGuard = () => {
  const { user } = useContext(DataContext)
  const { replace, pathname } = useRouter()
  const { isUser, isAdmin } = checkRoles(user?.roles)
  const [isLoading, setIsLoading] = useState(
    PAGES_WITH_NO_GUARD.includes(pathname) || !!user
  )
  const [isReplacing, setIsReplacing] = useState(false)

  const checkPath = async () => {
    if (pathname !== '/user' && user?.status === UserStatus.ACTIVE && isUser) {
      setIsReplacing(true)
      await replace('/user')
      return
    }

    if (
      pathname !== '/user/waiting' &&
      user?.status === UserStatus.VERIFIED &&
      isUser
    ) {
      setIsReplacing(true)
      await replace('/user/waiting')
      return
    }

    const adminArray = pathname?.split('/') ?? []

    if (
      (pathname === '/admin' || adminArray[1] !== 'admin') &&
      user?.status === UserStatus.ACTIVE &&
      isAdmin
    ) {
      setIsReplacing(true)
      await replace('/admin/dashboard')
      return
    }

    if (!user && !PAGES_WITH_NO_GUARD.includes(pathname)) {
      setIsReplacing(true)
      await replace('/')
    }
    return
  }

  useEffect(() => {
    setIsLoading(true)
    checkPath().finally(() => setIsLoading(false))
  }, [user])

  return {
    isLoading,
    isReplacing: isReplacing,
    isUser,
    isAdmin,
  }
}
