import { Query } from './Query'
import { Mutation } from './Mutation'
import { User } from './User'
import { AuthPayload } from './AuthPayload'
import { InviteCode } from './InviteCode'

import { asNexusMethod } from 'nexus'
import { GraphQLDate } from 'graphql-iso-date'

export const GQLDate = asNexusMethod(GraphQLDate, 'date')

export const types = [Query, Mutation, GQLDate, User, AuthPayload, InviteCode]
