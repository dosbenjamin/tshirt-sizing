import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts'
import { Participant } from './Participant.ts'
import { Room } from './Room.ts'

const app = new Application()
const router = new Router()
const rooms = new Map<string, Room>()

router.post('/rooms/create', async ({ request, response }) => {
  const { fields } = await request.body({ type: 'form-data' }).value.read()

  const owner = new Participant(fields.owner)
  const room = new Room(owner)

  rooms.set(room.uuid, room)

  response.body = room
})

router.get('/rooms', ({ response }) => {
  response.body = Object.fromEntries(rooms)
})

app.use(router.routes())
await app.listen({ port: 3000 })
