import EventEmitter from 'events'
import WebSocket from 'ws'
import { BinanceTicker, BybitTicker, Exchange } from '../../type/exchange.type'

export abstract class Publisher extends EventEmitter {
  protected ws: WebSocket | null = null
  protected readonly pair: string
  protected readonly exchange: Exchange | null = null

  constructor(pair: string) {
    super()
    this.pair = pair
    this.connect()
  }

  protected abstract getWebSocketUrl(): string
  protected abstract onMessage(data: BinanceTicker | BybitTicker): void
  protected abstract onOpen(): void

  protected connect() {
    this.ws = new WebSocket(this.getWebSocketUrl())

    this.ws.on('message', (event) => {
      const data = JSON.parse(event.toString())
      this.emit('message', data)
      this.onMessage(data)
    })

    this.ws.on('error', (err) => {
      console.log(`[${new Date().toISOString()}] Error in ${this.exchange}, Market Pair: ${this.pair}: ${err.message}`)
      this.connect()
    })

    this.ws.on('open', () => this.onOpen())
  }

  protected log(price: string) {
    console.log(`[${new Date().toISOString()}] Exchange: ${this.exchange}, Market Pair: ${this.pair}, Price: ${price}`)
  }

  public close() {
    this.ws?.removeAllListeners()
    this.ws?.close()
    this.ws = null
  }
}
