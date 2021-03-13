import { MicroRequest } from 'apollo-server-micro/dist/types'
import { verify } from 'jsonwebtoken'

interface Token {
  id: string
  iat: number
  exp: number
}

export const getUserId = (req: MicroRequest) => {
  const accessToken = req.headers.authorization?.split(' ')[1]

  if (!accessToken) throw new Error('Unauthorized')

  const decodedToken = verify(accessToken, process.env.JWT_ACCESS_SECRET) as Token

  return decodedToken.id
}
