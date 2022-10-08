import { Result } from '../../../core/result'
import { DomainEventAs } from '../../../event/domain-event'
import { Payload } from '../../../types'
import { UniqueID } from '../../../uid/unique-id.vo'
import {
  BaseAggregateRoot,
  IAggregateProps,
} from '../../base-aggregate-root.abstract'
import {
  MockAggregateCreated,
  MockPropsUpdated,
  MockAggregateToggled,
} from './events.mock.aggregate'

export type MockAggregateProps = IAggregateProps &
  Payload<typeof MockAggregateCreated>

export class MockAggregate extends BaseAggregateRoot<MockAggregateProps> {
  protected constructor(props: MockAggregateProps, id?: UniqueID) {
    super(props, id)
  }

  /**
   * Creates a new mock aggregate from initial props
   * @factory
   * @command CreateMockAggregate
   * @event MockAggregateCreated
   * @param aggregateId - the id of the aggregate
   * @param payload - the aggregate props on creation
   */

  static create(
    payload: Payload<typeof MockAggregateCreated>,
    id?: UniqueID
  ): Result<MockAggregate> {
    const aggregate = new MockAggregate(payload, id)
    aggregate.applyChange(
      MockAggregateCreated.with(payload, aggregate.id.value)
    )
    return Result.ok(aggregate)
  }

  protected _onMockAggregateCreated(
    event: DomainEventAs<typeof MockAggregateCreated>
  ): void {
    this.id = UniqueID.from(event.aggregateId).data
    this.props.foo = event.payload.foo || ''
    this.props.is = !!event.payload.is
  }

  /**
   * Updates the mock aggregate props to the given values
   * @command UpdateMockProps - update the aggregate props
   * @event MockPropsUpdated
   * @param payload - the props to update
   */

  updateProps(payload: Payload<typeof MockPropsUpdated>): void {
    this.applyChange(MockPropsUpdated.with(payload, this.id.value))
  }

  protected _onMockPropsUpdated(
    event: DomainEventAs<typeof MockPropsUpdated>
  ): void {
    this.props.foo = event.payload.foo || this.props.foo
    this.props.is = Reflect.has(event.payload, 'is')
      ? !!event.payload.is
      : this.props.is
  }

  /**
   * Toggles the mock aggregate state
   * @command ToggleMockAggregate
   * @event MockAggregateToggled
   */

  toggle(): void {
    this.applyChange(MockAggregateToggled.with({}, this.id.value))
  }

  protected _onMockAggregateToggled(): void {
    this.props.is = !this.props.is
  }

  /** getters */

  get foo(): string {
    return this.props.foo || ''
  }

  get is(): boolean {
    return !!this.props.is
  }
}
