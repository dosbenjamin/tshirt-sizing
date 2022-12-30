import type { APIRoute } from 'astro'
import { API_URL } from 'env'
import type { Room } from 'server/Room'

export const post: APIRoute = async ({ params, request, redirect }) => {
  const formData = await request.formData()

  const { id }: Room = await (await fetch(`${API_URL}rooms/${params.id}/join`, {
    body: formData,
    method: 'POST'
  })).json()

  return redirect(`/rooms/${id}`)
}
