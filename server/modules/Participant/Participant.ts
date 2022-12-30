export class Participant {
  public id = crypto.randomUUID()

  constructor(
    public name: string
  ) {}
}
