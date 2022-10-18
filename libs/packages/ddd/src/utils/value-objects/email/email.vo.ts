import { Result } from '../../../domain'
import { textUtils } from '../../text.utils'
import { customString } from '../custom-string/custom-string.decorator'
import { CustomString } from '../custom-string/custom-string.vo'
import { InvalidEmailError } from './invalid-email.error'

@customString({
  validator: (email: string) => textUtils.isValidEmail(email),
  message: (email: string) => email,
})
export class Email extends CustomString {
  static readonly WHITELIST: string[] = []
  static readonly BLACKLIST: string[] = []

  /**
   * Creates a new email with the given value, validator and error message
   * @factory
   */
  static override create<E extends Email>(
    value: string
  ): Result<E, InvalidEmailError> {
    const result = super.create(value)
    return result.isOk
      ? (result as Result<E, InvalidEmailError>)
      : Result.fail(InvalidEmailError.with(value))
  }

  get domain(): string {
    return this.value.split('@')[1]
  }

  get username(): string {
    return this.value.split('@')[0]
  }

  get tld(): string {
    return this.domain.split('.').reverse()[0]
  }
}
