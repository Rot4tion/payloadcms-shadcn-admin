// @ts-nocheck payloadcms original type safe issue will fix later
import type { ClientUser } from 'payload'

export const isClientUserObject = (user): user is ClientUser => {
  return user && typeof user === 'object'
}
