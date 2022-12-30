import type { APIRoute } from 'astro'

export const get: APIRoute = async ({ redirect }) => redirect('/rooms/create')
