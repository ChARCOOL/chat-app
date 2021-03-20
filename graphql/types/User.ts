import { objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('email')
    t.nonNull.string('username')
    t.nonNull.string('password')
    t.nullable.string('refreshToken')
    t.nullable.list.id('invitedUsers')
    t.nonNull.id('invitedBy')
  },
})
