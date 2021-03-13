import { objectType } from '@nexus/schema'

export const InviteCode = objectType({
  name: 'InviteCode',
  definition(t) {
    t.nonNull.string('code')
    t.nullable.date('expiresIn')
    t.nullable.int('maxUses')
    t.nonNull.field('user', {
      type: 'User',
    })
  },
})
