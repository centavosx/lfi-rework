import { useContext } from 'react'
import { DataContext } from '../contexts'

export const useUser = () => {
  const { user, logout, refetch } = useContext(DataContext)

  return { user, logout, refetch }
}
