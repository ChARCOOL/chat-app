import { objectType } from '@nexus/schema'

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.string('accessToken'),
      t.nonNull.field('user', {
        type: 'User',
      })
  },
})
