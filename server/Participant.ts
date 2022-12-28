export class Participant {
  public uuid = crypto.randomUUID()

  constructor(
    public name: string
  ) {}
}
