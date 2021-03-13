import { objectType } from '@nexus/schema'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('email')
    t.nonNull.string('username')
    t.nonNull.string('password')
    t.nullable.string('refreshToken')
  },
})
