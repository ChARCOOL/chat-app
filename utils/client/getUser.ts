import { print } from 'graphql'
import gql from 'graphql-tag'
import axios from 'axios'

type Variables = {
  username?: string
  email?: string
}

export const getUserQuery = async (variables: Variables) => {
  const { username = '', email = '' } = variables

  return await axios.post(process.env.NEXT_PUBLIC_API_URI, {
    query: print(gql`
      query($username: String, $email: String) {
        getUser(username: $username, email: $email) {
          id
          email
          username
          password
          refreshToken
          invitedUsers
          invitedBy
        }
      }
    `),
    variables: {
      username,
      email,
    },
  })
}
