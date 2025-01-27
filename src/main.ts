import { WebSocket, WebSocketServer } from 'ws'
import { parse } from 'url'
import { z } from 'zod'
import { sendError, sendJSON } from './util'
import { each, isEmpty } from 'lodash'
import { Exchange } from './type/exchange.type'
import { BinancePublisher } from './publisher/binance'
import { BybitPublisher } from './publisher/bybit'
import rawConfig from '../config.json'
import { Config } from './type/config.type'

const config = rawConfig as Config

const wss = new WebSocketServer({ port: 3000 })

wss.on('connection', (ws, req) => {
  const { query } = parse(req.url!, true)

  if (isEmpty(query)) {
    each(config.exchanges, (pairs, exchange) => {
      each(pairs, (pair) => {
        startSubscription(ws, exchange as Exchange, pair)
      })
    })

    return
  }

  const querySchema = z.object({
    exchange: z
      .string()
      .transform((value) => value.toLowerCase())
      .refine((value) => ['binance', 'bybit'].includes(value), {
        message: 'Invalid exchange, only supports binance and bybit',
      }),
    pair: z.string().regex(/^[A-z]+\/[A-z]+$/, {
      message: 'Invalid market pair format, eg: BTC/USDT',
    }),
  })

  const { data, error } = querySchema.safeParse(query)

  if (error) {
    sendError(ws, error)
    return ws.close()
  }

  startSubscription(ws, data.exchange as Exchange, data.pair)
})

function startSubscription(ws: WebSocket, exchange: Exchange, pair: string) {
  const publisher = exchange === Exchange.Binance ? new BinancePublisher(pair) : new BybitPublisher(pair)

  publisher.on('message', (message) => sendJSON(ws, message))

  ws.on('close', () => publisher.close())
}

console.log('Websocket server is running on port 3000')
