import { PrismaClient } from '@prisma/client'
import { MicroRequest } from 'apollo-server-micro/dist/types'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  req: MicroRequest
}

export function createContext(req: Context) {
  return {
    ...req,
    prisma,
  }
}
