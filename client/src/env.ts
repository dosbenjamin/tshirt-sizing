import * as env from 'env-var'

export const API_URL = env.get('API_URL').asUrlString()
