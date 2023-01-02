import { RoomEvents } from '../Room/enums.ts'
import { TShirtSizingRoom } from '../Room/types.ts'
import { type Tool, ToolTypes } from '../Tool/mod.ts'
import { Sizes } from './enums.ts'
import { TShirtSizingToolBaseData } from './types.ts'

export class TShirtSizingTool implements Tool {
  public readonly type = ToolTypes.TSHIRT_SIZING
  public room?: TShirtSizingRoom

  public reveal = {
    allowed: false,
    requested: false
  }

  public attachRoom(room: TShirtSizingRoom): void {
    this.room = room

    this.room.on(RoomEvents.PARTICIPANT_JOIN, () => this.didEveryoneChooseSize())
    this.room.on(RoomEvents.PARTICIPANT_LEAVE, () => this.didEveryoneChooseSize())
  }

  public setParticipantSizeChoice(participantId: string, size: Sizes): void {
    const participant = this.room?.getParticipant(participantId)
    if (!participant) return

    participant.size = size
    this.didEveryoneChooseSize()
  }

  private didEveryoneChooseSize(): void {
    if (!this.room) return

    this.reveal.allowed = [...this.room.participants.values()].every(
      ({ size }) => size !== Sizes.NotDefined
    )

    this.room?.dispatch(RoomEvents.UPDATE, this.room.toJSON())
  }

  public showResult() {
    this.reveal.requested = true

    this.room?.dispatch(RoomEvents.UPDATE, this.room.toJSON())
  }

  private hideResult() {
    this.reveal.allowed = false
    this.reveal.requested = false

    this.room?.participants.forEach(participant => participant.size = Sizes.NotDefined)

    this.room?.dispatch(RoomEvents.UPDATE, this.room.toJSON())
  }

  public toJSON(): TShirtSizingToolBaseData {
    return {
      type: this.type,
      reveal: this.reveal
    }
  }
}
