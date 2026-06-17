// app/api/candles/route.js
// Proxy server-side verso Yahoo Finance — gratis, no API key, illimitato

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const pair      = searchParams.get('pair')  || 'EURUSD'
  const timeframe = searchParams.get('tf')    || 'H1'

  // Yahoo Finance simbolo forex: EURUSD=X
  const symbol = `${pair}=X`

  // Mappa timeframe → interval Yahoo + range storico
  const TF_MAP = {
    'M5':  { interval: '5m',  range: '5d'  },
    'M15': { interval: '15m', range: '1mo' },
    'M30': { interval: '30m', range: '1mo' },
    'H1':  { interval: '1h',  range: '2y'  },
    'H4':  { interval: '1h',  range: '2y', aggregate: 4 },
    'D1':  { interval: '1d',  range: '5y'  },
  }
  const tf = TF_MAP[timeframe] || TF_MAP['H1']

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${tf.interval}&range=${tf.range}`

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    const data = await res.json()

    if (!data.chart || !data.chart.result || !data.chart.result[0]) {
      return Response.json({ error: 'Dati non disponibili', raw: data }, { status: 404 })
    }

    const result    = data.chart.result[0]
    const timestamps = result.timestamp || []
    const quote     = result.indicators.quote[0]

    // Costruisce array OHLC, scarta candele con valori null
    let candles = timestamps.map((t, i) => ({
      t: t * 1000,
      o: quote.open[i],
      h: quote.high[i],
      l: quote.low[i],
      c: quote.close[i],
      v: quote.volume ? quote.volume[i] : 0
    })).filter(c => c.o !== null && c.h !== null && c.l !== null && c.c !== null)

    // Se è H4, aggrega 4 candele H1 in una H4
    if (tf.aggregate === 4) {
      const aggregated = []
      for (let i = 0; i < candles.length; i += 4) {
        const chunk = candles.slice(i, i + 4)
        if (chunk.length === 0) continue
        aggregated.push({
          t: chunk[0].t,
          o: chunk[0].o,
          h: Math.max(...chunk.map(c => c.h)),
          l: Math.min(...chunk.map(c => c.l)),
          c: chunk[chunk.length - 1].c,
          v: chunk.reduce((sum, c) => sum + (c.v || 0), 0)
        })
      }
      candles = aggregated
    }

    if (candles.length === 0) {
      return Response.json({ error: 'Nessuna candela valida' }, { status: 404 })
    }

    return Response.json({ candles, pair, timeframe, source: 'yahoo' })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
