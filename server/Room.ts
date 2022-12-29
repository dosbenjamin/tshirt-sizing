import type { Participant } from './Participant.ts'

export enum RoomEvents {
  PARTICIPANT_JOIN = 'join',
  PARTICIPANT_LEAVE = 'leave'
}

type EventBaseData = {
  room: Room
}

type EventParticipantData = EventBaseData & {
  participant: Participant
}

type EventsData = {
  [RoomEvents.PARTICIPANT_JOIN]: EventParticipantData
  [RoomEvents.PARTICIPANT_LEAVE]: EventParticipantData
}

type ObserverEvent<D extends EventBaseData> = {
  type: RoomEvents
  data?: D
}

type ObserverHandler<D extends EventBaseData> = (event: ObserverEvent<D>) => void

export class Room {
  private observers = new Map<
    RoomEvents,
    Set<ObserverHandler<EventsData[RoomEvents]>
  >>([
    [RoomEvents.PARTICIPANT_JOIN, new Set],
    [RoomEvents.PARTICIPANT_LEAVE, new Set]
  ])

  public id = crypto.randomUUID()
  public participants: Participant[] = []

  constructor(public ownerId: string) {}

  public on<T extends RoomEvents>(type: T, handler: ObserverHandler<EventsData[T]>): void {
    const handlers = this.observers.get(type)
    handlers?.add(handler)
  }

  public off<T extends RoomEvents>(type: T, handler: ObserverHandler<EventsData[T]>): void {
    const handlers = this.observers.get(type)
    handlers?.delete(handler)
  }

  public dispatch<T extends RoomEvents>(type: T, data: EventsData[T]): void {
    const handlers = this.observers.get(type)
    handlers?.forEach(handler => handler({ type, data }))
  }

  public addParticipant(participant: Participant): Room {
    this.participants = [
      ...this.participants,
      participant
    ]

    this.dispatch(RoomEvents.PARTICIPANT_JOIN, {
      room: this,
      participant
    })

    return this
  }

  public removeParticipant(participant: Participant): Room {
    this.participants = this.participants.filter(
      ({ id }) => id === participant.id
    )

    this.dispatch(RoomEvents.PARTICIPANT_LEAVE, {
      room: this,
      participant
    })

    return this
  }

  public close(): void {
    this.observers.forEach(handlers => handlers.clear())
    this.observers.clear()
  }
}
