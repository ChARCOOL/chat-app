import { queryType, stringArg } from '@nexus/schema'
import { getUserId } from '../../utils'

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      resolve: async (root, args, { prisma, req }) => {
        const user = await prisma.user.findUnique({
          where: {
            id: getUserId(req),
          },
        })

        if (!user) throw new Error('User not found')

        return {
          ...user,
        }
      },
    })

    t.list.field('getUser', {
      type: 'User',
      args: {
        email: stringArg(),
        username: stringArg(),
      },
      resolve: async (root, args, { prisma }) => {
        const user = await prisma.user.findMany({
          where: {
            email: {
              contains: args.email,
              mode: 'insensitive',
            },
            username: {
              contains: args.username,
              mode: 'insensitive',
            },
          },
        })

        return user
      },
    })
  },
})
