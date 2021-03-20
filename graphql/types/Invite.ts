import { objectType } from 'nexus'

export const Invite = objectType({
  name: 'Invite',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('code')
    t.nullable.date('expiresIn')
    t.nullable.int('maxUses')
    t.nullable.list.id('usedBy')
    t.nonNull.id('createdBy')
  },
})
