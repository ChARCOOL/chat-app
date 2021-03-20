import { intArg, mutationType, nonNull, nullable, stringArg } from 'nexus'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'

import { getUserId, sendEmail } from '../../utils/server'
import { TokenI } from '../../interfaces'

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
      resolve: async (root, args, { prisma, req }) => {
        try {
          const invite = await prisma.invite.findUnique({ where: { code: args.inviteCode } })

          if (!invite) throw new Error('Invalid invite code')

          if (invite.expiresIn.valueOf() <= Date.now().valueOf()) throw new Error('Invite expired')

          if (invite.maxUses <= invite.usedBy.length) throw new Error('Invite exceeded max use')

          const user = await prisma.user.create({
            data: {
              id: await nanoid(),
              email: args.email,
              username: args.username,
              password: bcrypt.hashSync(args.password, 10),
              invitedBy: invite.createdBy,
              invitedUsers: [],
            },
          })

          await prisma.invite.update({
            where: { code: args.inviteCode },
            data: { usedBy: { set: [user.id] } },
          })

          await prisma.user.update({
            where: { id: invite.createdBy },
            data: { invitedUsers: { set: [user.id] } },
          })

          const emailToken = jwt.sign({ id: user.id }, process.env.JWT_EMAIL_SECRET, {
            expiresIn: '1h',
          })

          await sendEmail({
            to: user.email,
            subject: 'Email verification',
            text: `Hi ${user.username},

            Thanks for using our app!
            
            We need a little more information to complete your registration, including a confirmation of your email address. 
            
            Click below to confirm your email address:
            
            ${req.headers.origin}/verify-email/${emailToken}
            
            If you have problems, please paste the above URL into your web browser.`,
          })

          return user
        } catch (err) {
          return err
        }
      },
    })

    t.nonNull.field('signIn', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (root, args, { prisma }) => {
        try {
          let user = await prisma.user.findUnique({ where: { email: args.email } })

          if (!user) throw new Error('User not found')

          // if (!user.isVerified) throw new Error("User's email address is not verified")

          if (!bcrypt.compareSync(args.password, user.password))
            throw new Error("Passwords doesn't match")

          const [refreshToken, accessToken] = [
            jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '180d' }),
            jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10h' }),
          ]

          user = await prisma.user.update({
            where: { email: args.email },
            data: { refreshToken },
          })

          return { user, accessToken }
        } catch (err) {
          return err
        }
      },
    })

    t.nonNull.string('renewAccessToken', {
      args: {
        refreshToken: nonNull(stringArg()),
      },
      resolve: async (root, args, { prisma }) => {
        try {
          const user = await prisma.user.findUnique({ where: { refreshToken: args.refreshToken } })

          if (!user) throw new Error('Unauthorized')

          return jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10h' })
        } catch (err) {
          return err
        }
      },
    })

    t.nonNull.field('generateInviteCode', {
      type: 'Invite',
      args: {
        expiresIn: nullable(intArg()),
        maxUses: nullable(intArg()),
      },
      resolve: async (root, args, { prisma, req }) => {
        try {
          const [code, expiresIn, maxUses, createdBy] = [
            nanoid(8),
            new Date(Date.now() + args.expiresIn),
            args.maxUses,
            getUserId(req),
          ]

          let invite = await prisma.invite.findFirst({ where: { createdBy } })

          if (
            invite &&
            invite.maxUses > invite.usedBy.length &&
            invite.expiresIn.valueOf() > Date.now().valueOf()
          ) {
            throw new Error('Can not create new invite while there is one')
          }

          invite = await prisma.invite.create({
            data: {
              id: await nanoid(),
              code,
              expiresIn,
              maxUses,
              createdBy,
              usedBy: [],
            },
          })

          return invite
        } catch (err) {
          return err
        }
      },
    })

    t.nonNull.boolean('verifyEmail', {
      args: {
        emailToken: nonNull(stringArg()),
      },
      resolve: async (root, args, { prisma }) => {
        try {
          const { id } = jwt.verify(args.emailToken, process.env.JWT_EMAIL_SECRET) as TokenI

          const user = prisma.user.update({ where: { id }, data: { isVerified: true } })

          if (!user) throw new Error('User not found with given email address')

          return true
        } catch (err) {
          return err
        }
      },
    })
  },
})
