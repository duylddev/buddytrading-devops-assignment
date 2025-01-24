import { Publisher } from './publisher'
import { BybitTicker, Exchange } from '../../type/exchange.type'
import { toBybitPair } from '../util'

export class BybitPublisher extends Publisher {
  protected readonly exchange = Exchange.Bybit

  protected getWebSocketUrl(): string {
    return `wss://stream.bybit.com/v5/public/spot`
  }

  protected onMessage(event: BybitTicker): void {
    if (event.topic === `tickers.${toBybitPair(this.pair)}`) {
      this.log(event.data.lastPrice)
    }
  }

  protected onOpen(): void {
    this.ws?.send(
      JSON.stringify({
        op: 'subscribe',
        args: [`tickers.${toBybitPair(this.pair)}`],
      })
    )
  }
}
