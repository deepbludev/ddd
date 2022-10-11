import { IDomainEvent } from '../../domain'
import { MockAggregate } from '../../domain/__mocks__/mock.aggregate'
import { IEventStream } from '../persistence/event-store/event-stream.interface'

export class MockEventStream extends IEventStream {
  name = MockAggregate.name
  readonly db: Map<string, { events: IDomainEvent[]; version: number }> =
    new Map()

  async append(aggId: string, events: IDomainEvent[], version: number) {
    const prev = this.db.get(aggId)?.events || []
    this.db.set(aggId, { events: prev.concat(events), version })
  }

  async get(aggId: string): Promise<IDomainEvent[]> {
    return this.db.get(aggId)?.events.filter(e => e.aggregateId === aggId) || []
  }
}
