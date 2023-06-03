import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { createTheme } from '@mui/material'
import { DataProvider, PageProvider } from '../contexts'

const theme = createTheme()
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </ThemeProvider>
  )
}
