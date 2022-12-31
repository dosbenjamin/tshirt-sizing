import { RoomEvents } from './enums.ts'
import type { Participant } from '../Participant/mod.ts'
import type { EventsData, ObserverHandler } from './types.ts'
import type { Tool } from '../Tool/mod.ts'

export class Room<T extends Tool, P extends Participant> {
  private readonly observers = new Map<
    RoomEvents,
    Set<ObserverHandler<EventsData[RoomEvents]>
  >>([
    [RoomEvents.PARTICIPANT_JOIN, new Set],
    [RoomEvents.PARTICIPANT_LEAVE, new Set]
  ])

  public readonly id = crypto.randomUUID()
  public readonly participants = new Map<string, P>()
  public ownerId?: string

  constructor(public tool: T) {
    this.tool.attachRoom(this)
  }

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

  public getParticipant(participantId: string): P | undefined {
    const participant = this.participants.get(participantId)

    return participant
  }

  public addParticipant(participant: P): P {
    this.participants.set(participant.id, participant)

    this.dispatch(RoomEvents.PARTICIPANT_JOIN, {
      id: this.id,
      participants: [...this.participants.values()]
    })

    return participant
  }

  public removeParticipant(participant: P): P {
    this.participants.get(participant.id)

    this.dispatch(RoomEvents.PARTICIPANT_LEAVE, {
      id: this.id,
      participants: [...this.participants.values()],
    })

    return participant
  }

  public addOwner(participant: P): P {
    this.ownerId = participant.id

    return this.addParticipant(participant)
  }

  public close(): void {
    this.observers.forEach(handlers => handlers.clear())
    this.observers.clear()
    this.participants.clear()
  }
}
