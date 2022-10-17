import {
  IQuery,
  IQueryBus,
  QueryNotRegisteredError,
  QueryResponse,
} from '../../domain'
import { IQueryHandler } from '../../domain/query/query-handler.interface'

export class InMemoryQueryBus implements IQueryBus {
  private readonly handlers: Map<string, IQueryHandler> = new Map()

  register(handlers: IQueryHandler[]) {
    handlers.forEach(handler => {
      this.handlers.set(handler.subscription.name, handler)
    })
  }

  async get<D, E extends Error>(query: IQuery): QueryResponse<D, E> {
    const handler = this.handlers.get(query.constructor.name)
    if (!handler) throw QueryNotRegisteredError.with(query)
    return await handler.handle(query)
  }
}
