import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { createTheme } from '@mui/material'
import { DataProvider } from '../contexts'
import { AdminMain, Main } from 'components/main'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const theme = createTheme()

const userLinks = ['/', '/user/', '/register/', '/login/']

export default function App({ Component, pageProps }: AppProps) {
  const { prefetch, pathname } = useRouter()

  useEffect(() => {
    userLinks.forEach(async (v) => {
      if (pathname !== v) await prefetch(v)
    })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        {(status) =>
          status?.isAdmin || status?.isSuper ? (
            <AdminMain>
              <Component {...pageProps} />
            </AdminMain>
          ) : (
            <Main>
              <Component {...pageProps} />
            </Main>
          )
        }
      </DataProvider>
    </ThemeProvider>
  )
}
