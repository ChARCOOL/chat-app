import { print } from 'graphql'
import gql from 'graphql-tag'
import axios from 'axios'

type Variables = {
  email: string
  password: string
}

export const loginQuery = async (variables: Variables) => {
  const { email = '', password = '' } = variables

  return await axios.post(process.env.NEXT_PUBLIC_API_URI, {
    query: print(gql`
      mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          accessToken
          user {
            id
            email
            username
            password
            refreshToken
          }
        }
      }
    `),
    variables: {
      email,
      password,
    },
  })
}
