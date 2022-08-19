import S from 'fluent-json-schema'

export const configSchema = S.object().prop('JWT_SECRET', S.string().required())
