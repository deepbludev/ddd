import { IDomainEvent } from '../../../../domain'
import { MockAggregate } from '../../../../domain/__mocks__/mock.aggregate'
import { MockEventStream } from '../../../__mocks__/mock.event-stream'
import { IEventStream } from '../event-stream.interface'

describe(IEventStream, () => {
  let stream: MockEventStream
  let aggregate: MockAggregate
  let events: IDomainEvent[]
  let aggId: string
  let version: number
  let otherAggregate: MockAggregate
  let otherAggId: string
  let otherEvents: IDomainEvent[]
  let otherVersion: number

  beforeEach(() => {
    stream = new MockEventStream()
    aggregate = MockAggregate.create({ foo: 'bar', is: true }).data
    aggregate.toggle()
    aggregate.updateProps({ foo: 'baz' })

    aggId = aggregate.id.value
    events = [...aggregate.changes]
    version = aggregate.version

    otherAggregate = MockAggregate.create({ foo: 'bar', is: true }).data
    otherAggregate.toggle()
    otherAggregate.toggle()

    otherAggId = otherAggregate.id.value
    otherEvents = [...otherAggregate.changes]
    otherVersion = otherAggregate.version
  })

  it('should be defined', () => {
    expect(IEventStream).toBeDefined()
  })

  it('should have a aggregate name', () => {
    expect(stream.aggregateName).toEqual('MockAggregate')
  })

  it('should have a stream name', () => {
    expect(stream.name).toEqual('MockAggregate.eventstream')
  })

  it('should be able to append events to multiple aggregates', async () => {
    await stream.append(aggId, events, version)
    await stream.append(otherAggId, otherEvents, otherVersion)
    const fetched = await stream.get(aggId)
    const otherFetched = await stream.get(otherAggId)

    expect(fetched).toEqual(events)
    expect(otherFetched).toEqual(otherEvents)
  })
})
