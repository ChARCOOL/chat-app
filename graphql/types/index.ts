import { asNexusMethod } from 'nexus'
import { GraphQLDate } from 'graphql-iso-date'

import { Query } from './Query'
import { Mutation } from './Mutation'
import { User } from './User'
import { AuthPayload } from './AuthPayload'
import { Invite } from './Invite'

const GQLDate = asNexusMethod(GraphQLDate, 'date')

export const types = [Query, Mutation, GQLDate, User, AuthPayload, Invite]
