import type { Participant } from './participant.ts'
import { createPublisher, type CreatePublisherReturnType } from './publisher.ts'

export type InternalRoom = {
  id: string
  ownerId: string | null
  participants: Map<string, Participant>
}

export type Room = {
  id: string
  ownerId: string | null
  participants: Participant[]
}

export type RoomEvents = 'participant-join' | 'participant-leave' | 'room-update'

export type CreateRoomReturnType = {
  internal: InternalRoom
  use: <T extends (room: CreateRoomReturnType) => ReturnType<T>>(fn: T) => ReturnType<T>
  toJSON: () => Room
  subscribe: CreatePublisherReturnType<RoomEvents, CreateRoomReturnType>['subscribe']
  unsubscribe: CreatePublisherReturnType<RoomEvents, CreateRoomReturnType>['unsubscribe']
  dispatch: CreatePublisherReturnType<RoomEvents, CreateRoomReturnType>['dispatch']
}

export type CreateRoomsContainerReturnType = {
  internal: Map<string, CreateRoomReturnType>
  use: <T extends (rooms: Map<string, CreateRoomReturnType>) => ReturnType<T>>(fn: T) => ReturnType<T>
  getById: (roomId: string) => CreateRoomReturnType | undefined
  toJSON: () => Room[]
}

export const createRoom = (rooms: Map<string, CreateRoomReturnType>): CreateRoomReturnType => {
  const internal: InternalRoom = {
    id: crypto.randomUUID(),
    ownerId: null,
    participants: new Map<string, Participant>(),
  }

  const publisher = createPublisher<RoomEvents, CreateRoomReturnType>([
    'participant-join',
    'participant-leave',
    'room-update'
  ])

  const use: CreateRoomReturnType['use'] = (fn) => fn({ ...publisher, internal, use, toJSON, })
  const toJSON: CreateRoomReturnType['toJSON'] = () => ({
    id: internal.id,
    ownerId: internal.ownerId,
    participants: [...internal.participants.values()]
  })

  rooms.set(internal.id, { ...publisher, internal, use, toJSON, })
  return { ...publisher, internal, use, toJSON, }
}

export const setOwner = (ownerId: string) => {
  return (room: CreateRoomReturnType) => {
    room.internal.ownerId = ownerId
  }
}

export const createRoomsContainer = (): CreateRoomsContainerReturnType => {
  const internal = new Map<string, CreateRoomReturnType>()

  const use: CreateRoomsContainerReturnType['use'] = (fn) => fn(internal)
  const getById: CreateRoomsContainerReturnType['getById'] = (roomId) => internal.get(roomId)
  const toJSON: CreateRoomsContainerReturnType['toJSON'] = () => Array.from(internal.values(), room => room.toJSON())

  return { internal, use, getById, toJSON }
}
