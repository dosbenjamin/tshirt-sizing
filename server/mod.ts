import { Application, Router } from 'https://deno.land/x/oak@v11.1.0/mod.ts'
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts"
import { Room, RoomEvents } from './modules/Room/mod.ts'
import { TShirtSizingTool } from './modules/TShirtSizingTool/index.ts'
import { TShirtSizingParticipant } from './modules/TShirtSizingParticipant/index.ts'
import { createRoomResponse } from './utils.ts'
import type { Sizes } from './modules/TShirtSizingTool/enums.ts'

const app = new Application()
const router = new Router()

const rooms = new Map<string, Room<TShirtSizingTool, TShirtSizingParticipant>>()

router.get('/rooms', ({ response }) => {
  response.body = [...rooms.values()]
})

router.post('/rooms/store', async ({ request, response }) => {
  const { fields } = await request.body({ type: 'form-data' }).value.read()

  const owner = new TShirtSizingParticipant(fields.ownerName)
  const room = new Room<TShirtSizingTool, TShirtSizingParticipant>(new TShirtSizingTool)
  room.addOwner(owner)

  rooms.set(room.id, room)

  response.body = {
    ...createRoomResponse(room),
    participant: owner
  }
})

router.get('/rooms/:id', ({ params, response }) => {
  const room = rooms.get(params.id)
  if (!room) return

  response.body = createRoomResponse(room)
})

router.post('/rooms/:id/join', async ({ params, request, response }) => {
  const { fields } = await request.body({ type: 'form-data' }).value.read()

  const participant = new TShirtSizingParticipant(fields.participantName)
  const room = rooms.get(params.id)
  if (!room) return

  room.addParticipant(participant)

  response.body = {
    ...createRoomResponse(room),
    participant
  }
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

router.post('/rooms/:id/choose', oakCors(), async ({ params, request }) => {
  const { fields } = await request.body({ type: 'form-data' }).value.read()

  const room = rooms.get(params.id)
  if (!room) return

  room.tool.saveParticipantSize(fields.participantId, fields.size as unknown as Sizes)
})

app.use(router.routes())
await app.listen({ port: 3333 })
