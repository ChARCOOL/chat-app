import { PrismaClient } from '@prisma/client'
import { MicroRequest } from 'apollo-server-micro/dist/types'

import prisma from '../prisma'

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
