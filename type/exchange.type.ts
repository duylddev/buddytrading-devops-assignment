export enum Exchange {
  Binance = 'binance',
  Bybit = 'bybit',
}

export type BinanceTicker = {
  e: string // Event type
  E: number // Event time
  s: string // Symbol
  c: string // Close price
  o: string // Open price
  h: string // High price
  l: string // Low price
  v: string // Total traded base asset volume
  q: string // Total traded quote asset volume
}

export type BybitTicker = {
  topic: string // e.g., "tickers.BTCUSDT"
  ts: number // Timestamp
  type: string // e.g., "snapshot"
  cs: number // Cumulative snapshot
  data: {
    symbol: string // e.g., "BTCUSDT"
    lastPrice: string // Last traded price
    highPrice24h: string // Highest price in the last 24 hours
    lowPrice24h: string // Lowest price in the last 24 hours
    prevPrice24h: string // Previous price in the last 24 hours
    volume24h: string // Total traded volume in the last 24 hours
    turnover24h: string // Total turnover in the last 24 hours
    price24hPcnt: string // Price change percentage in the last 24 hours
    usdIndexPrice: string // USD index price
  }
}
