import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { createTheme } from '@mui/material'
import { DataProvider, IPAndDeviceProvider } from '../contexts'
import { AdminMain, Main } from 'components/main'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const theme = createTheme()

const userLinks = ['/', '/user/', '/register/', '/login/']
const adminLinks = [
  '/admin',
  '/admin/dashboard/',
  '/admin/admins/',
  '/admin/applicants/',
  '/admin/calendar/',
  '/admin/dashboard/',
  '/admin/scholars/',
  '/admin/audits/',
  '/admin/chats/',
]

export default function App({ Component, pageProps }: AppProps) {
  const { prefetch, pathname } = useRouter()

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      adminLinks.forEach(async (v) => {
        if (pathname !== v) await prefetch(v)
      })
      return
    }
    userLinks.forEach(async (v) => {
      if (pathname !== v) {
        let link = v
        if (link === '/login/') {
          await prefetch(link, link + '?who=Employee')
        }
        await prefetch(link, link + '?who=Scholar')
      }
    })
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
