import { from } from 'env-var'

const env = from(import.meta.env)

export const API_URL = env.get('API_URL').required().asUrlString()
