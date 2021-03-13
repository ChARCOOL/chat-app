import { intArg, mutationType, nonNull, nullable, stringArg } from '@nexus/schema'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { getUserId } from '../../utils'

export const Mutation = mutationType({
  definition(t) {
    t.nonNull.field('createUser', {
      type: 'User',
      args: {
        email: nonNull(stringArg()),
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
        inviteCode: nonNull(stringArg()),
      },
      resolve: async (root, args, { prisma }) => {
        return await prisma.user.create({
          data: {
            email: args.email,
            username: args.username,
            password: bcrypt.hashSync(args.password, 10),
          },
        })
      },
    })

    t.nonNull.field('signIn', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (root, args, { prisma }) => {
        let user = await prisma.user.findUnique({
          where: {
            email: args.email,
          },
        })

        if (!user) throw new Error('User not found')

        if (!bcrypt.compareSync(args.password, user.password))
          throw new Error("Passwords doesn't match")

        const [refreshToken, accessToken] = [
          jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '180d',
          }),
          jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '10h',
          }),
        ]

        user = await prisma.user.update({
          where: {
            email: args.email,
          },
          data: {
            refreshToken,
          },
        })

        return {
          accessToken,
          user,
        }
      },
    })

    t.nonNull.string('renewAccessToken', {
      args: {
        refreshToken: nonNull(stringArg()),
      },
      resolve: async (root, args, { prisma }) => {
        const user = await prisma.user.findUnique({
          where: {
            refreshToken: args.refreshToken,
          },
        })

        if (!user) throw new Error('Unauthorized')

        return jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10h' })
      },
    })

    t.field('genInviteCode', {
      type: 'InviteCode',
      args: {
        expiresIn: nullable(intArg()),
        maxUses: nullable(intArg()),
      },
      resolve: async (root, args, { prisma, req }) => {
        const [code, expiresIn, maxUses, userId] = [
          nanoid(),
          new Date(Date.now() + args.expiresIn),
          args.maxUses,
          getUserId(req),
        ]

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })

        const inviteCode = await prisma.inviteCode.create({
          data: {
            code,
            expiresIn,
            maxUses,
            userId,
          },
        })

        return {
          user,
          ...inviteCode,
        }
      },
    })
  },
})
