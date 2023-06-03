import React, { createContext, useState, useEffect, useCallback } from 'react'

import { useUser } from '../hooks'
import { useRouter } from 'next/router'
import { Loading } from 'components/loading'

export const PageContext = createContext<undefined>(undefined)

export const PageProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const { user } = useUser()
  const { pathname, replace } = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const redirect = useCallback(
    async (loc: string) => {
      setIsLoading(true)

      await replace(loc)

      setIsLoading(false)
    },
    [setIsLoading]
  )

  useEffect(() => {
    if (pathname === '/reset') {
      setIsLoading(false)
      return
    }

    if (!!user) {
      if (!user.verified) {
        redirect('/login')
        return
      }
      if (pathname === '/login') {
        redirect('/')
        return
      }
      setIsLoading(false)
      return
    }
    redirect('/login')
  }, [user, redirect, setIsLoading])

  if (isLoading) return <Loading />

  return (
    <PageContext.Provider value={undefined}>{children}</PageContext.Provider>
  )
}
