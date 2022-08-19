export const configSchema = {
  type: 'object',
  properties: {
    JWT_SECRET: { type: 'string' },
  },
  required: ['JWT_SECRET'],
} as const
