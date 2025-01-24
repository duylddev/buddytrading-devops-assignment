import { WebSocket } from 'ws'

export function sendError(ws: WebSocket, message: unknown) {
  ws.send(JSON.stringify({ error: message }))
  ws.close()
}

export function sendJSON(ws: WebSocket, data: any) {
  ws.send(JSON.stringify(data))
}

export function toBinancePair(pair: string) {
  const [base, quote] = pair.split('/')
  return `${base}${quote}`.toLocaleLowerCase()
}

export function toBybitPair(pair: string) {
  const [base, quote] = pair.split('/')
  return `${base}${quote}`.toUpperCase()
}
