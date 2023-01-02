import { RoomEvents } from './enums.ts'
import type { Participant } from '../Participant/mod.ts'
import type { RoomEventsDataMap } from './types.ts'
import type { Tool } from '../Tool/mod.ts'
import type { Publisher, ObserverHandler } from '../Publisher/mod.ts'
import { RoomData } from './mod.ts'

export class Room<T extends Tool, P extends Participant> implements Publisher<RoomEvents, RoomEventsDataMap[RoomEvents]> {
  public readonly observers = new Map<
    RoomEvents,
    Set<ObserverHandler<RoomEvents, RoomEventsDataMap[RoomEvents]>
  >>([
    [RoomEvents.PARTICIPANT_JOIN, new Set],
    [RoomEvents.PARTICIPANT_LEAVE, new Set],
    [RoomEvents.UPDATE, new Set],
  ])

  public readonly id = crypto.randomUUID()
  public readonly participants = new Map<string, P>()
  public ownerId?: string

  constructor(public tool: T) {
    this.tool.attachRoom(this)
  }

  public on<E extends RoomEvents>(type: E, handler: ObserverHandler<RoomEvents, RoomEventsDataMap[E]>): void {
    const handlers = this.observers.get(type)
    handlers?.add(handler)
  }

  public off<E extends RoomEvents>(type: E, handler: ObserverHandler<RoomEvents, RoomEventsDataMap[E]>): void {
    const handlers = this.observers.get(type)
    handlers?.delete(handler)
  }

  public dispatch<E extends RoomEvents>(type: E, data: RoomEventsDataMap[E]): void {
    const handlers = this.observers.get(type)
    handlers?.forEach(handler => handler({ type, data }))
  }

  public getParticipant(participantId: string): P | undefined {
    const participant = this.participants.get(participantId)

    return participant
  }

  public addParticipant(participant: P): P {
    this.participants.set(participant.id, participant)

    this.dispatch(RoomEvents.PARTICIPANT_JOIN, this.toJSON())

    return participant
  }

  public removeParticipant(participant: P): P {
    this.participants.get(participant.id)

    this.dispatch(RoomEvents.PARTICIPANT_LEAVE, this.toJSON())

    return participant
  }

  public addOwner(participant: P): P {
    this.ownerId = participant.id

    return this.addParticipant(participant)
  }

  public toJSON(): RoomData {
    return {
      id: this.id,
      participants: [...this.participants.values()],
      ownerId: this.ownerId,
      tool: this.tool.toJSON(),
    }
  }

  public close(): void {
    this.observers.forEach(handlers => handlers.clear())
    this.observers.clear()
    this.participants.clear()
  }
}
