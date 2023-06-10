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
