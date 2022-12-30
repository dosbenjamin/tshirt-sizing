import type { Participant } from '../Participant/mod.ts'
import { RoomEvents } from './enums.ts'

export type EventBaseData = {
  id: string
  participants: Participant[]
}

export type EventParticipantJoinData = EventBaseData & {
  joiner?: Participant
}

export type EventParticipantLeaveData = EventBaseData & {
  leaver?: Participant
}

export type EventsData = {
  [RoomEvents.PARTICIPANT_JOIN]: EventParticipantJoinData
  [RoomEvents.PARTICIPANT_LEAVE]: EventParticipantLeaveData
}

export type ObserverEvent<D extends EventBaseData> = {
  type: RoomEvents
  data?: D
}

export type ObserverHandler<D extends EventBaseData> = (event: ObserverEvent<D>) => void
