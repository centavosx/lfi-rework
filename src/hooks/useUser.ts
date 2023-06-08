import { UserStatus } from 'entities'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { DataContext } from '../contexts'

export const useUser = () => {
  const { user, logout, refetch } = useContext(DataContext)

  return { user, logout, refetch }
}

export const useUserNotVerifiedGuard = () => {
  const { user } = useContext(DataContext)
  const { replace } = useRouter()

  if (user?.status === UserStatus.ACTIVE) replace('/user')

  return user?.status === UserStatus.PENDING
}

export const useUserActiveGuard = () => {
  const { user } = useContext(DataContext)
  const { replace } = useRouter()

  if (user?.status === UserStatus.ACTIVE) replace('/user')
}
