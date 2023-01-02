import type { EventData, ObserverHandler } from './types.ts'

export interface Publisher <T extends string, D extends EventData> {
  readonly observers: Map<T, Set<ObserverHandler<T, D>>>
  on<E extends T>(type: E, handler: ObserverHandler<T, D>): void
  off<E extends T>(type: E, handler: ObserverHandler<T, D>): void
  dispatch<E extends T>(type: E, data: D): void
}
