import { Exchange } from './exchange.type'

export type Config = {
  exchanges: {
    [key in Exchange]: string[]
  }
}
