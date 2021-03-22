import { print } from 'graphql'
import gql from 'graphql-tag'
import axios from 'axios'

export const resendVerificationQuery = async (email: string) => {
  return await axios.post(process.env.NEXT_PUBLIC_API_URI, {
    query: print(gql`
      mutation($email: String!) {
        resendVerification(email: $email)
      }
    `),
    variables: {
      email,
    },
  })
}
