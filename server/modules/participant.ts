import type { CreateRoomReturnType } from './rooms.ts'

export type InternalParticipant = {
  id: string
  name: string
}

export type Participant = InternalParticipant

export type CreateParticipantReturnType = (room: CreateRoomReturnType) => {
  toJSON: () => Participant
}

export type RemoveParticipantReturnType = (room: CreateRoomReturnType) => void

export const createParticipant = (participantName: string): CreateParticipantReturnType => {
  const participant: InternalParticipant = {
    id: crypto.randomUUID(),
    name: participantName
  }

  return (room) => {
    const toJSON = () => participant

    room.internal.participants.set(participant.id, participant)
    room.dispatch('participant-join', room)

    return { toJSON }
  }
}

type RemoveParticipant = (participantId: string) => (room: CreateRoomReturnType) => void

export const removeParticipant = (participantId: string): RemoveParticipantReturnType => {
  return (room) => {
    room.internal.participants.delete(participantId)
    room.dispatch('participant-leave', room)
  }
}
