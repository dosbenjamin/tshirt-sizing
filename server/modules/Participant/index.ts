export class Participant {
  public readonly id = crypto.randomUUID()

  constructor(
    public name: string
  ) {}
}
