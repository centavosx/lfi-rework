import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { createTheme } from '@mui/material'
import { DataProvider, IPAndDeviceProvider } from '../contexts'
import { AdminMain, Main } from 'components/main'
import { Router, useRouter } from 'next/router'
import { useEffect } from 'react'
import NProgress from 'nprogress'

const theme = createTheme()
NProgress.configure({ showSpinner: false })

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()

  useEffect(() => {
    Router.events.on('routeChangeStart', (url) => {
      NProgress.start()
    })

    Router.events.on('routeChangeComplete', (url) => {
      NProgress.done(false)
    })
  }, [Router])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => NProgress.start())
      return () => {
        window.removeEventListener('beforeunload', () => NProgress.done(false))
      }
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <IPAndDeviceProvider>
        <DataProvider>
          {pathname.startsWith('/admin') ? (
            <AdminMain>
              <Component {...pageProps} />
            </AdminMain>
          ) : (
            <Main>
              <Component {...pageProps} />
            </Main>
          )}
        </DataProvider>
      </IPAndDeviceProvider>
    </ThemeProvider>
  )
}
