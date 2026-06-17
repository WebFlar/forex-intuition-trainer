// Generatore di pattern sintetici di alta qualità
// Ogni pattern produce sequence di candele OHLC che formano DAVVERO il pattern

function gauss(mean, std) {
  const u = Math.random(), v = Math.random()
  return mean + std * Math.sqrt(-2*Math.log(u+1e-9)) * Math.cos(2*Math.PI*v)
}

function makeCandle(open, target, vol, wickRatio = 0.4) {
  const body = (target - open) + gauss(0, vol * 0.3)
  const close = open + body
  const wH = Math.abs(body) * wickRatio + Math.abs(gauss(0, vol * 0.25))
  const wL = Math.abs(body) * wickRatio + Math.abs(gauss(0, vol * 0.25))
  return {
    o: open,
    h: Math.max(open, close) + wH,
    l: Math.min(open, close) - wL,
    c: close
  }
}

// Costruisce sequenza di candele che segue una serie di "punti target"
function buildSequence(startPrice, segments, vol) {
  const candles = []
  let p = startPrice

  for (const seg of segments) {
    const { length, deltaPct, noise = 0.4 } = seg
    const totalDelta = startPrice * (deltaPct / 100)
    const stepDelta = totalDelta / length

    for (let i = 0; i < length; i++) {
      const target = p + stepDelta + gauss(0, vol * noise)
      const c = makeCandle(p, target, vol)
      candles.push(c)
      p = c.c
    }
  }
  return candles
}

// ─── PATTERN GENERATORS ───────────────────────────────────────────────

// Testa e Spalle (reversal ribassista)
function headAndShoulders(basePrice = 1.10) {
  const vol = basePrice * 0.0015
  // Approach -> spalla sx -> ritorno neckline -> testa più alta -> ritorno neckline -> spalla dx -> rottura neckline
  return buildSequence(basePrice, [
    { length: 5,  deltaPct: 0.4 },    // approccio rialzista
    { length: 4,  deltaPct: 0.5 },    // sale a spalla sx
    { length: 4,  deltaPct: -0.4 },   // scende a neckline
    { length: 6,  deltaPct: 1.0 },    // sale alla testa (più alta)
    { length: 5,  deltaPct: -0.9 },   // scende dalla testa
    { length: 4,  deltaPct: 0.4 },    // sale a spalla dx (simile a spalla sx)
    { length: 4,  deltaPct: -0.5 },   // scende alla neckline
    { length: 5,  deltaPct: -0.7 },   // rompe neckline (forte)
  ], vol)
}

// Testa e Spalle Inverso (reversal rialzista)
function inverseHeadAndShoulders(basePrice = 1.10) {
  const vol = basePrice * 0.0015
  return buildSequence(basePrice, [
    { length: 5,  deltaPct: -0.4 },
    { length: 4,  deltaPct: -0.5 },
    { length: 4,  deltaPct: 0.4 },
    { length: 6,  deltaPct: -1.0 },
    { length: 5,  deltaPct: 0.9 },
    { length: 4,  deltaPct: -0.4 },
    { length: 4,  deltaPct: 0.5 },
    { length: 5,  deltaPct: 0.7 },
  ], vol)
}

// Doppio Massimo (reversal ribassista)
function doubleTop(basePrice = 1.10) {
  const vol = basePrice * 0.0015
  return buildSequence(basePrice, [
    { length: 6,  deltaPct: 0.7 },    // sale al primo top
    { length: 4,  deltaPct: -0.5 },   // scende
    { length: 5,  deltaPct: 0.5 },    // risale al secondo top (stesso livello)
    { length: 4,  deltaPct: -0.3 },   // scende leggermente
    { length: 6,  deltaPct: -0.8 },   // rottura ribassista
  ], vol)
}

// Doppio Minimo (reversal rialzista)
function doubleBottom(basePrice = 1.10) {
  const vol = basePrice * 0.0015
  return buildSequence(basePrice, [
    { length: 6,  deltaPct: -0.7 },
    { length: 4,  deltaPct: 0.5 },
    { length: 5,  deltaPct: -0.5 },
    { length: 4,  deltaPct: 0.3 },
    { length: 6,  deltaPct: 0.8 },
  ], vol)
}

// Triangolo Ascendente (continuazione rialzista)
function ascendingTriangle(basePrice = 1.10) {
  const vol = basePrice * 0.0015
  return buildSequence(basePrice, [
    { length: 5,  deltaPct: 0.6 },    // touch resistenza
    { length: 4,  deltaPct: -0.4 },   // pullback (minimo crescente)
    { length: 3,  deltaPct: 0.4 },    // ritorno a resistenza
    { length: 4,  deltaPct: -0.25 },  // pullback (minimo più alto)
    { length: 3,  deltaPct: 0.25 },   // touch resistenza
    { length: 3,  deltaPct: -0.15 },  // ultimo pullback
    { length: 5,  deltaPct: 0.7 },    // breakout
  ], vol)
}

// Triangolo Discendente (continuazione ribassista)
function descendingTriangle(basePrice = 1.10) {
  const vol = basePrice * 0.0015
  return buildSequence(basePrice, [
    { length: 5,  deltaPct: -0.6 },
    { length: 4,  deltaPct: 0.4 },
    { length: 3,  deltaPct: -0.4 },
    { length: 4,  deltaPct: 0.25 },
    { length: 3,  deltaPct: -0.25 },
    { length: 3,  deltaPct: 0.15 },
    { length: 5,  deltaPct: -0.7 },
  ], vol)
}

// Bandiera Rialzista (continuazione)
function bullFlag(basePrice = 1.10) {
  const vol = basePrice * 0.0015
  return buildSequence(basePrice, [
    { length: 8,  deltaPct: 1.5, noise: 0.3 },  // impulso forte
    { length: 4,  deltaPct: -0.3 },             // pullback
    { length: 3,  deltaPct: 0.15 },             // piccoli rimbalzi
    { length: 3,  deltaPct: -0.2 },
    { length: 2,  deltaPct: 0.1 },
    { length: 6,  deltaPct: 1.0 },              // continuazione
  ], vol)
}

// Bandiera Ribassista (continuazione)
function bearFlag(basePrice = 1.10) {
  const vol = basePrice * 0.0015
  return buildSequence(basePrice, [
    { length: 8,  deltaPct: -1.5, noise: 0.3 },
    { length: 4,  deltaPct: 0.3 },
    { length: 3,  deltaPct: -0.15 },
    { length: 3,  deltaPct: 0.2 },
    { length: 2,  deltaPct: -0.1 },
    { length: 6,  deltaPct: -1.0 },
  ], vol)
}

// Trend Up semplice (Base)
function trendUp(basePrice = 1.10) {
  const vol = basePrice * 0.0014
  return buildSequence(basePrice, [
    { length: 8,  deltaPct: 0.5, noise: 0.5 },
    { length: 4,  deltaPct: -0.15 },
    { length: 8,  deltaPct: 0.6 },
    { length: 4,  deltaPct: -0.15 },
    { length: 7,  deltaPct: 0.4 },
  ], vol)
}

// Trend Down semplice (Base)
function trendDown(basePrice = 1.10) {
  const vol = basePrice * 0.0014
  return buildSequence(basePrice, [
    { length: 8,  deltaPct: -0.5, noise: 0.5 },
    { length: 4,  deltaPct: 0.15 },
    { length: 8,  deltaPct: -0.6 },
    { length: 4,  deltaPct: 0.15 },
    { length: 7,  deltaPct: -0.4 },
  ], vol)
}

// Range / Consolidamento (Base)
function range(basePrice = 1.10) {
  const vol = basePrice * 0.0014
  return buildSequence(basePrice, [
    { length: 4,  deltaPct: 0.3 },
    { length: 4,  deltaPct: -0.35 },
    { length: 4,  deltaPct: 0.25 },
    { length: 4,  deltaPct: -0.25 },
    { length: 4,  deltaPct: 0.3 },
    { length: 4,  deltaPct: -0.3 },
    { length: 7,  deltaPct: 0.05 },
  ], vol)
}

// ─── CATALOGO PATTERN ───────────────────────────────────────────────────

export const PATTERNS = {
  // BASE
  trend_up:    { name: 'Trend Up',                kind: 'continuazione', level: 'base',         gen: trendUp },
  trend_down:  { name: 'Trend Down',              kind: 'continuazione', level: 'base',         gen: trendDown },
  range:       { name: 'Range / Consolidamento',  kind: 'neutro',        level: 'base',         gen: range },

  // INTERMEDIO
  head_shoulders:     { name: 'Testa e Spalle',         kind: 'reversal ribassista', level: 'intermedio', gen: headAndShoulders },
  inv_head_shoulders: { name: 'Testa e Spalle Inverso', kind: 'reversal rialzista',  level: 'intermedio', gen: inverseHeadAndShoulders },
  double_top:         { name: 'Doppio Massimo',         kind: 'reversal ribassista', level: 'intermedio', gen: doubleTop },
  double_bottom:      { name: 'Doppio Minimo',          kind: 'reversal rialzista',  level: 'intermedio', gen: doubleBottom },

  // AVANZATO
  asc_triangle:       { name: 'Triangolo Ascendente',   kind: 'continuazione rialzista', level: 'avanzato', gen: ascendingTriangle },
  desc_triangle:      { name: 'Triangolo Discendente',  kind: 'continuazione ribassista', level: 'avanzato', gen: descendingTriangle },
  bull_flag:          { name: 'Bandiera Rialzista',     kind: 'continuazione',           level: 'avanzato', gen: bullFlag },
  bear_flag:          { name: 'Bandiera Ribassista',    kind: 'continuazione',           level: 'avanzato', gen: bearFlag },
}

export const LEVEL_PATTERNS = {
  base:       ['trend_up', 'trend_down', 'range'],
  intermedio: ['head_shoulders', 'inv_head_shoulders', 'double_top', 'double_bottom'],
  avanzato:   ['asc_triangle', 'desc_triangle', 'bull_flag', 'bear_flag'],
}
