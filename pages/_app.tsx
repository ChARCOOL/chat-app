import React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'

import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.min.css'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <ToastContainer autoClose={2500} />
      <Component {...pageProps} />
    </>
  )
}

export default App
