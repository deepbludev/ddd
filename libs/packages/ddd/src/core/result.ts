import v from '../utils/validator'
import { Serializable } from './types'

export interface IResultObject<V, E> {
  value: V
  error: E
  isFail: boolean
  isOk: boolean
}

export interface IResult<V, E>
  extends IResultObject<V, E>,
    Serializable<IResultObject<V, E>> {}

/**
 * @class Result
 * @classdesc Result is a monad that represents a value or an error.
 * It is used to return a value or an error from a function.
 * Particularily useful for functions that can fail.
 * Also useful for functions that can return a value or throw an error.
 * In DDD, it is used to return a value or an error from domain services,
 * commands / queries / usecases, or aggregate / entity / value object creation.
 * @see https://en.wikipedia.org/wiki/Monad_(functional_programming)
 */
export class Result<V = void, E extends Error = Error>
  implements IResult<V, E>
{
  protected constructor(
    public readonly isSuccess: boolean,
    private readonly _payload: V | null,
    private readonly _error: E | null
  ) {}

  public static ok<V, E extends Error = Error>(value?: V): Result<V, E> {
    return new Result(true, value, null) as unknown as Result<V, E>
  }

  public static fail<V, E extends Error = Error>(
    errorOrMessage?: E | string
  ): Result<V, E> {
    const error: E =
      v.string(errorOrMessage) || errorOrMessage === undefined
        ? (new Error(errorOrMessage as string) as E)
        : errorOrMessage
    return new Result(false, null, error) as unknown as Result<V, E>
  }

  public static combine<V, E extends Error = Error>(
    results: Result<V, E>[]
  ): Result<void, E> {
    for (const r of results) if (r.isFailure) return Result.fail(r.error)
    return Result.ok()
  }

  serialize(): IResultObject<V, E> {
    return {
      value: this.value,
      error: this.error,
      isFail: this.isFail,
      isOk: this.isOk,
    }
  }

  get isFailure() {
    return !this.isSuccess
  }

  get isFail() {
    return this.isFailure
  }

  get isOk() {
    return this.isSuccess
  }

  get value() {
    return this._payload as V
  }

  get error() {
    return this._error as E
  }
}
