import React from 'react'
import Head from 'next/head'
import { withUrqlClient, NextUrqlAppContext } from 'next-urql'
import NextApp, { AppProps } from 'next/app'
import fetch from 'isomorphic-unfetch'

import '../styles/globals.css'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

App.getInitialProps = async (ctx: NextUrqlAppContext) => {
  const appProps = await NextApp.getInitialProps(ctx)
  return { ...appProps }
}

export default withUrqlClient((_ssrExchange, _ctx) => ({
  url: 'http://localhost:3000/api/graphql',
  fetch,
}))(
  // @ts-ignore
  App
)
