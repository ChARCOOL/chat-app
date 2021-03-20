import { print } from 'graphql'
import gql from 'graphql-tag'
import axios from 'axios'

type Variables = {
  email: String
  username: String
  password: String
  inviteCode: String
}

export const createUserQuery = async (variables: Variables) => {
  const { email, username, password, inviteCode } = variables

  return await axios.post(process.env.NEXT_PUBLIC_API_URI, {
    query: print(gql`
      mutation($email: String!, $username: String!, $password: String!, $inviteCode: String!) {
        createUser(
          email: $email
          username: $username
          password: $password
          inviteCode: $inviteCode
        ) {
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
      email,
      username,
      password,
      inviteCode,
    },
  })
}
