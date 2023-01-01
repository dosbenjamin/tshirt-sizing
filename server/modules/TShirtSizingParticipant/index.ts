import { Participant } from '../Participant/index.ts'
import { Sizes } from '../TShirtSizingTool/enums.ts'

export class TShirtSizingParticipant extends Participant {
  public size = Sizes.NotDefined
}
