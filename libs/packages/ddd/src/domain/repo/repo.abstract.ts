import { IAggregateRoot } from '../aggregate-root/aggregate-root.abstract'
import { IEventBus } from '../event/eventbus.interface'
import { IEntityRepo } from './entity-repo.abstract'

/**
 * Base abstract class for aggregate repositories.
 * It can be either extended or implemented as an interface.
 * It should be used to persist aggregate roots, using entity repositories to persist entities, if needed.
 * @abstract
 */
export abstract class IRepo<A extends IAggregateRoot> extends IEntityRepo<A> {
  constructor(private readonly eventbus: IEventBus) {
    super()
  }

  override async save(aggregate: A): Promise<void> {
    await super.save(aggregate)
    await this.eventbus.publish(aggregate.commit())
  }
}
