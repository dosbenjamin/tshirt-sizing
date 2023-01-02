import type { Participant } from '../Participant/index.ts'
import type { Room } from '../Room/mod.ts'
import type { ToolTypes } from './enums.ts'
import type { ToolBaseData } from './types.ts'

export interface Tool {
  room?: Room<Tool, Participant>
  readonly type: ToolTypes
  attachRoom(room: Room<Tool, Participant>): void
  toJSON(): ToolBaseData
}
