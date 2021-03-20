import { objectType } from 'nexus'

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.string('accessToken')
    t.nonNull.field('user', {
      type: 'User',
    })
  },
})
