import type { Participant } from './modules/Participant/index.ts'
import type { Room } from './modules/Room/index.ts'
import type { Tool } from './modules/Tool/interfaces.ts'

export const createRoomResponse = ({ id, ownerId, participants, tool }: Room<Tool, Participant>) => {
  return {
    id,
    ownerId,
    participants: [...participants.values()],
    tool: {
      type: tool.type
    }
  }
}
