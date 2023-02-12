export type PublisherHandler<D = unknown> = (data: D) => void

export type CreatePublisherReturnType<E extends string, D = unknown> = {
  subscribe: (eventName: E, handler: PublisherHandler<D>) => void
  unsubscribe: (eventName: E, handler: PublisherHandler<D>) => void
  dispatch: (eventName: E, data: D) => void
}

export const createPublisher = <E extends string, D = unknown>(eventsToRegister: E[]): CreatePublisherReturnType<E, D> => {
  const events = new Map<E, Set<PublisherHandler<D>>>()

  const subscribe: CreatePublisherReturnType<E, D>['subscribe'] = (eventName, handler) => {
    events.get(eventName)?.add(handler)
  }

  const unsubscribe: CreatePublisherReturnType<E, D>['unsubscribe'] = (eventName, handler) => {
    events.get(eventName)?.delete(handler)
  }

  const dispatch: CreatePublisherReturnType<E, D>['dispatch'] = (eventName, data) => {
    events.get(eventName)?.forEach(handler => handler(data))
  }

  eventsToRegister.forEach(eventName => events.set(eventName, new Set))

  return { subscribe, unsubscribe, dispatch }
}
