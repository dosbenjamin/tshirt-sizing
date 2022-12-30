import { RoomEvents } from './enums.ts'
import type { Participant } from '../Participant/mod.ts'
import type { EventsData, ObserverHandler } from './types.ts'

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
      id: this.id,
      participants: this.participants,
      joiner: participant
    })

    return this
  }

  public removeParticipant(participant: Participant): Room {
    this.participants = this.participants.filter(
      ({ id }) => id === participant.id
    )

    this.dispatch(RoomEvents.PARTICIPANT_LEAVE, {
      id: this.id,
      participants: this.participants,
      leaver: participant
    })

    return this
  }

  public close(): void {
    this.observers.forEach(handlers => handlers.clear())
    this.observers.clear()
  }
}
