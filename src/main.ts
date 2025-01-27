import { WebSocket, WebSocketServer } from 'ws'
import { parse } from 'url'
import { z } from 'zod'
import { sendError, sendJSON } from './util'
import { each, isEmpty } from 'lodash'
import { Exchange } from './type/exchange.type'
import { BinancePublisher } from './publisher/binance'
import { BybitPublisher } from './publisher/bybit'
import config from './config'
import http from 'http'
import { register, Gauge, Counter, Histogram } from 'prom-client'

new Gauge({
  name: 'number_of_clients',
  help: 'Total number of clients connected to the websocket server',
  collect() {
    this.set(wss.clients.size)
  },
})

export const counter = new Counter({
  name: 'number_of_errors',
  help: 'Total number of errors',
})

export const histogram = new Histogram({
  name: 'latency',
  help: 'Latency of the websocket server',
})

const server = http.createServer(async (req, res) => {
  if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': register.contentType })
    res.end(await register.metrics())
    return
  }

  if (req.url === '/livez' || req.url === '/readz') {
    res.writeHead(200, { 'Content-Type': 'text/json' })
    res.end(JSON.stringify({ number_of_clients: wss.clients.size }))
    return
  }

  res.writeHead(404, { 'Content-Type': 'text/json' })
  res.end(JSON.stringify({ status: 'not found' }))
})

const wss = new WebSocketServer({ server })

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

  ws.on('error', () => counter.inc())

  startSubscription(ws, data.exchange as Exchange, data.pair)
})

function startSubscription(ws: WebSocket, exchange: Exchange, pair: string) {
  const publisher = exchange === Exchange.Binance ? new BinancePublisher(pair) : new BybitPublisher(pair)

  publisher.on('message', (message) => sendJSON(ws, message))

  ws.on('close', () => publisher.close())
}

server.listen(process.env.PORT, () => {
  console.log('Both websocket and http server is running on port ' + process.env.PORT)
})
