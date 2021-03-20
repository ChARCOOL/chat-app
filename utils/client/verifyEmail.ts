import { print } from 'graphql'
import gql from 'graphql-tag'
import axios from 'axios'

export const verifyEmailQuery = async (emailToken: string) => {
  return await axios.post(process.env.NEXT_PUBLIC_API_URI, {
    query: print(gql`
      mutation($emailToken: String!) {
        verifyEmail(emailToken: $emailToken)
      }
    `),
    variables: {
      emailToken,
    },
  })
}
