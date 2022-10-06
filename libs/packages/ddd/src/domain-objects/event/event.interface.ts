/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMessage } from './message.interface'

export interface IEvent extends IMessage {
  name: string
  aggregateName: string
  aggregateId: string
  timestamp: number // in milliseconds
}
