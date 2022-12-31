import type { Participant } from '../Participant/index.ts'
import type { Room } from '../Room/index.ts'
import type { ToolTypes } from './enums.ts'

export interface Tool {
  room?: Room<Tool, Participant>
  readonly type: ToolTypes
  attachRoom(room: Room<Tool, Participant>): void
}
