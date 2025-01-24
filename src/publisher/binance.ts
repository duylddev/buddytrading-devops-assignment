import { Publisher } from './publisher'
import { BinanceTicker, Exchange } from '../../type/exchange.type'
import { toBinancePair } from '../util'

export class BinancePublisher extends Publisher {
  protected readonly exchange = Exchange.Binance

  protected getWebSocketUrl(): string {
    return `wss://stream.binance.com:9443/ws/${toBinancePair(this.pair)}@miniTicker`
  }

  protected onMessage(data: BinanceTicker): void {
    this.log(data.c)
  }

  protected onOpen(): void {
    this.ws?.on('ping', (event) => this.ws?.pong(event))
  }
}
