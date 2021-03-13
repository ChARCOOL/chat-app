import gql from 'graphql-tag'

export const UserQuery = gql`
  query($email: String, $username: String) {
    getUser(email: $email, username: $username) {
      id
      email
      username
    }
  }
`
