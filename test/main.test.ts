import { WebSocket } from 'ws'

describe('WebSocket Server', () => {
  let ws: WebSocket
  const PORT = 3000

  beforeEach((done) => {
    ws = new WebSocket(`ws://localhost:${PORT}`)
    ws.on('open', () => done())
  })

  afterEach(() => {
    ws.close()
  })

  describe('Query Parameter Validation', () => {
    it('should accept valid exchange and pair parameters', (done) => {
      ws = new WebSocket(`ws://localhost:${PORT}?exchange=binance&pair=BTC/USDT`)

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString())
        expect(message).not.toHaveProperty('error')
        done()
      })
    })

    it('should reject invalid exchange parameter', (done) => {
      ws = new WebSocket(`ws://localhost:${PORT}?exchange=invalid&pair=BTC/USDT`)

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString())
        expect(message).toHaveProperty('error')
        expect(message.error.toString()).toContain('Invalid exchange')
        done()
      })
    })

    it('should reject invalid pair format', (done) => {
      ws = new WebSocket(`ws://localhost:${PORT}?exchange=binance&pair=BTCUSDT`)

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString())
        expect(message).toHaveProperty('error')
        expect(message.error.toString()).toContain('Invalid market pair format')
        done()
      })
    })

    it('should accept connection without query parameters', (done) => {
      ws = new WebSocket(`ws://localhost:${PORT}`)

      ws.on('open', () => {
        // If connection is successful without error, test passes
        expect(ws.readyState).toBe(WebSocket.OPEN)
        done()
      })
    })

    it('should accept bybit as valid exchange', (done) => {
      ws = new WebSocket(`ws://localhost:${PORT}?exchange=bybit&pair=ETH/USDT`)

      ws.on('message', (data) => {
        const message = JSON.parse(data.toString())
        expect(message).not.toHaveProperty('error')
        done()
      })
    })
  })
})
