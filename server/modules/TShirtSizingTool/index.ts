import type { Room } from '../Room/index.ts'
import { type Tool, ToolTypes } from '../Tool/mod.ts'
import type { TShirtSizingParticipant } from '../TShirtSizingParticipant/index.ts'
import { Sizes } from './enums.ts'

export class TShirtSizingTool implements Tool {
  public readonly type = ToolTypes.TSHIRT_SIZING
  public room?: Room<TShirtSizingTool, TShirtSizingParticipant>

  public attachRoom(room: Room<TShirtSizingTool, TShirtSizingParticipant>): void {
    this.room = room
  }

  public saveParticipantChoice(participantId: string, choice: Sizes): void {
    const participant = this.room?.getParticipant(participantId)
    if (!participant) return

    participant.choice = choice

    this.didEveryoneChoose()
  }

  private didEveryoneChoose(): boolean {
    if (!this.room) return false

    return [...this.room.participants.values()].every(
      ({ choice }) => choice !== Sizes.NotDefined
    )
  }
}
