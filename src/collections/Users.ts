import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: { tokenExpiration: 30 * 24 * 60 * 1000 },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
