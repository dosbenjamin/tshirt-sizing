import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts'
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts"
import { Room, RoomEvents } from './modules/Room/mod.ts'
import { Participant } from './modules/Participant/mod.ts'

const app = new Application()
const router = new Router()

const rooms = new Map<string, Room>()

router.get('/rooms', ({ response }) => {
  response.body = [...rooms.values()]
})

router.post('/rooms/store', async ({ request, response }) => {
  const { fields } = await request.body({ type: 'form-data' }).value.read()

  const owner = new Participant(fields.ownerName)
  const room = new Room(owner.id).addParticipant(owner)
  rooms.set(room.id, room)

  response.body = room
})

router.post('/rooms/:id/join', async ({ params, request, response }) => {
  const { fields } = await request.body({ type: 'form-data' }).value.read()

  const participant = new Participant(fields.participantName)
  const room = rooms.get(params.id)

  room?.addParticipant(participant)

  response.body = room
})

router.get('/rooms/:id/sse', oakCors(), (ctx) => {
  const target = ctx.sendEvents()

  const room = rooms.get(ctx.params.id)

  room?.on(RoomEvents.PARTICIPANT_JOIN, (data) => {
    target.dispatchMessage(data)
  })

  room?.on(RoomEvents.PARTICIPANT_LEAVE, (data) => {
    target.dispatchMessage(data)
  })
})

app.use(router.routes())
await app.listen({ port: 3333 })
