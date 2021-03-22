import React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'

import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.min.css'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#720058',
    },
    secondary: {
      main: '#000000',
    },
  },
})

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <ToastContainer autoClose={2500} />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default App
