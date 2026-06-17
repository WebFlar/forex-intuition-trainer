// app/api/candles/route.js
// Legge OHLC da dataset locale — zero API, zero rate limit, sempre disponibile

import dataset from '../../data/ohlc.json'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const pair      = searchParams.get('pair') || 'EURUSD'
  const timeframe = searchParams.get('tf')   || 'H1'

  const pairData = dataset[pair]
  if (!pairData) {
    return Response.json({ error: `Coppia ${pair} non disponibile` }, { status: 404 })
  }

  const candles = pairData[timeframe]
  if (!candles || candles.length === 0) {
    return Response.json({ error: `Timeframe ${timeframe} non disponibile per ${pair}` }, { status: 404 })
  }

  return Response.json({
    candles,
    pair,
    timeframe,
    source: 'local-dataset',
    total: candles.length
  })
}
