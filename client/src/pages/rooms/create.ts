import type { APIRoute } from 'astro'
import { API_URL } from 'env'
import type { Room } from 'server/Room'

export const post: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData()

  const { uuid }: Room = await (await fetch(`${API_URL}/rooms/create`, {
    body: formData,
    method: 'POST'
  })).json()

  return redirect(`/rooms/${uuid}`, 307)
}
