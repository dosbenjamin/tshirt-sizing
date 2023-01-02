export type EventData = Record<string, unknown>

export type ObserverEvent<E extends string, D extends EventData> = {
  type: E
  data: D
}

export type ObserverHandler<E extends string, D extends EventData> = (event: ObserverEvent<E, D>) => void
