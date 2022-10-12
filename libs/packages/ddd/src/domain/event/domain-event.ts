import { IMessage, IPayload } from '../types'
import { IUniqueID } from '../uid/unique-id.vo'
import { DomainEventID } from './domain-event-id.vo'
import { IDomainEvent } from './domain-event.interface'

export abstract class DomainEvent<P extends IPayload = IPayload>
  extends IMessage<P>
  implements IDomainEvent<P>
{
  static aggregate = 'Aggregate'

  constructor(
    public override readonly payload: P,
    public readonly aggregateId: string,
    public readonly id: string = DomainEventID.create().value,
    public readonly timestamp: number = Date.now()
  ) {
    super(payload)
  }

  /**
   * Creates a new DomainEvent from payload and aggregateId
   * @factory
   */
  static with<P extends IPayload = IPayload>(
    payload: P,
    id: IUniqueID
  ): DomainEvent<P> {
    return Reflect.construct(this, [payload, id.value])
  }

  /**
   * Creates a new DomainEvent from a serialized event
   * @factory
   * @param serialized - the serialized event usually coming from a message queue or persistance layer
   */
  static from<P extends IPayload>(serialized: IDomainEvent<P>): DomainEvent<P> {
    const deserialized = Reflect.construct(this, [
      serialized.payload,
      serialized.aggregateId,
    ])
    Reflect.set(deserialized, 'timestamp', serialized.timestamp)
    Reflect.set(deserialized, 'id', serialized.id)
    return deserialized
  }

  /**
   * Serializes the event to a plain object.
   * Useful for persistance or sending over the wire.
   * @returns serialized version of the event.
   */
  serialize(): IDomainEvent<P> {
    return {
      id: this.id,
      name: this.name,
      timestamp: this.timestamp,
      aggregateId: this.aggregateId,
      aggregateName: this.aggregateName,
      payload: this.payload,
    }
  }

  get aggregateName(): string {
    let name = Reflect.get(this.constructor, 'aggregate')
    if (!name?.length) name = 'Aggregate'
    if (name === 'Aggregate')
      console.error(
        `[WARNING] DomainEvent "${this.name}" does not have an aggregate name. ` +
          'Using default name "Aggregate". ' +
          'Please set an aggregate name by using the @domainEvent decorator ' +
          'or by setting the static string property "aggregate" on the class.'
      )
    return name
  }

  get name(): string {
    return this.constructor.name
  }
}
