import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts'
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts"
import { createRoom, createRoomsContainer, setOwner } from './modules/rooms.ts'
import { createParticipant } from './modules/participant.ts'

const app = new Application()
const router = new Router()

const rooms = createRoomsContainer()

router.get('/rooms', ({ response }) => {
  response.body = rooms.toJSON()
})

router.post('/rooms/store', async ({ request, response }) => {
  const { fields } = await request.body({ type: 'form-data' }).value.read()

  const room = rooms.use(createRoom)
  const participant = room.use(createParticipant(fields.ownerName))
  room.use(setOwner(participant.toJSON().id))

  response.body = {
    participant: participant.toJSON(),
    room: room.toJSON(),
  }
})

router.get('/rooms/:id', ({ params, response }) => {
  response.body = rooms.getById(params.id)?.toJSON()
})

router.post('/rooms/:id/join', async ({ params, request, response }) => {
  const { fields } = await request.body({ type: 'form-data' }).value.read()

  const room = rooms.getById(params.id)
  const participant = room?.use(createParticipant(fields.participantName))

  response.body = {
    participant: participant?.toJSON(),
    room: room?.toJSON(),
  }
})

router.get('/rooms/:id/sse', oakCors(), (ctx) => {
  const target = ctx.sendEvents()
  const room = rooms.getById(ctx.params.id)

  room?.subscribe('participant-join', (room) => {
    target.dispatchMessage(room.toJSON())
  })

  room?.subscribe('participant-leave', (room) => {
    target.dispatchMessage(room.toJSON())
  })
})

app.use(router.routes())
await app.listen({ port: 3333 })
