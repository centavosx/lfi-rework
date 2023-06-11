import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { createTheme } from '@mui/material'
import { DataProvider } from '../contexts'
import { AdminMain, Main } from 'components/main'
import { useRouter } from 'next/router'

const theme = createTheme()
export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()

  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        {(status) =>
          (status?.isAdmin || status?.isSuper) && pathname !== '/' ? (
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
