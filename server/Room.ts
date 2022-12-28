import type { Participant } from './Participant.ts'

export class Room {
  public uuid = crypto.randomUUID()
  public participants: Participant[] = []

  constructor(
    public owner: Participant
  ) {
    this.addParticipant(owner)
  }

  public addParticipant(participant: Participant) {
    this.participants = [
      ...this.participants,
      participant
    ]

    return this
  }

  public removeParticipant(participant: Participant) {
    this.participants = this.participants.filter(
      ({ uuid }) => uuid === participant.uuid
    )

    return this
  }
}
