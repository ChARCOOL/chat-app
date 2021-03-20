import { queryType, stringArg } from 'nexus'

import { getUserId } from '../../utils/server'

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      resolve: async (root, args, { prisma, req }) => {
        try {
          const user = await prisma.user.findUnique({ where: { id: getUserId(req) } })

          return user
        } catch (err) {
          return err
        }
      },
    })

    t.list.field('getUser', {
      type: 'User',
      args: {
        username: stringArg(),
        email: stringArg(),
      },
      resolve: async (root, args, { prisma }) => {
        try {
          let user = await prisma.user.findMany()

          if (args.username || args.email) {
            user = await prisma.user.findMany({
              where: {
                OR: [
                  { username: { equals: args.username, mode: 'insensitive' } },
                  { email: { equals: args.email, mode: 'insensitive' } },
                ],
              },
            })
          }

          return user
        } catch (err) {
          return err
        }
      },
    })
  },
})
