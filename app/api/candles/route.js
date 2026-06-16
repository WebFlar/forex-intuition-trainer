// app/api/candles/route.js
// Proxy server-side verso Polygon.io — nessun problema CORS

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const pair      = searchParams.get('pair')   || 'EURUSD'
  const timeframe = searchParams.get('tf')     || 'H1'
  const limit     = searchParams.get('limit')  || '80'

  const API_KEY = process.env.POLYGON_API_KEY
  if (!API_KEY) {
    return Response.json({ error: 'POLYGON_API_KEY non configurata' }, { status: 500 })
  }

  // Mappa timeframe → moltiplicatore + unità Polygon
  const TF_MAP = {
    'M5':  { mult: 5,  span: 'minute' },
    'M15': { mult: 15, span: 'minute' },
    'M30': { mult: 30, span: 'minute' },
    'H1':  { mult: 1,  span: 'hour'   },
    'H4':  { mult: 4,  span: 'hour'   },
    'D1':  { mult: 1,  span: 'day'    },
  }
  const tf = TF_MAP[timeframe] || TF_MAP['H1']

  // Calcola range date: da 120 giorni fa a oggi
  const now  = new Date()
  const from = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  const fmt  = d => d.toISOString().split('T')[0]

  // Polygon forex: C:EURUSD formato
  const symbol = `C:${pair}`
  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${tf.mult}/${tf.span}/${fmt(from)}/${fmt(now)}?adjusted=true&sort=asc&limit=${limit}&apiKey=${API_KEY}`

  try {
    const res  = await fetch(url)
    const data = await res.json()

    if (!data.results || data.results.length === 0) {
      return Response.json({ error: 'Nessun dato disponibile', raw: data }, { status: 404 })
    }

    // Normalizza in formato OHLC semplice
    const candles = data.results.map(r => ({
      t: r.t,
      o: r.o,
      h: r.h,
      l: r.l,
      c: r.c,
      v: r.v
    }))

    return Response.json({ candles, pair, timeframe })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
