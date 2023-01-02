import type { Participant } from '../Participant/index.ts'
import type { Tool } from '../Tool/interfaces.ts'
import type { ToolBaseData } from '../Tool/types.ts'
import type { TShirtSizingParticipant } from '../TShirtSizingParticipant/index.ts'
import type { TShirtSizingTool } from '../TShirtSizingTool/index.ts'
import type { RoomEvents } from './enums.ts'
import type { Room } from './index.ts'

export type RoomData = Pick<
  Room<
    Tool,
    Participant
  >,
  'id' | 'ownerId'
> & {
  participants: Participant[]
  tool: ToolBaseData
}

export type RoomEventsDataMap = Record<RoomEvents, RoomData>

export type TShirtSizingRoom = Room<
  TShirtSizingTool,
  TShirtSizingParticipant
>
