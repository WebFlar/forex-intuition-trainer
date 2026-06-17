'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { PATTERNS, LEVEL_PATTERNS } from './patternGenerator'

const ACCESS_PASSWORD = 'mqlsuite2024'
const PAIRS = ['EURUSD','GBPUSD','USDJPY','AUDUSD','USDCAD','USDCHF','EURJPY','GBPJPY','EURGBP','XAUUSD']
const TFS   = ['H1','H4','D1']

// ── Audio ────────────────────────────────────────────────────────────────
let audioCtx = null
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}
function playWin() {
  try {
    const ac = getAudio(), t = ac.currentTime
    ;[523.25, 659.25, 783.99].forEach((freq, i) => {
      const o = ac.createOscillator(), g = ac.createGain()
      o.connect(g); g.connect(ac.destination); o.type = 'sine'
      o.frequency.setValueAtTime(freq, t + i*0.08)
      g.gain.setValueAtTime(0, t + i*0.08)
      g.gain.linearRampToValueAtTime(0.18, t + i*0.08 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, t + i*0.08 + 0.35)
      o.start(t + i*0.08); o.stop(t + i*0.08 + 0.4)
    })
  } catch(e) {}
}
function playLoss() {
  try {
    const ac = getAudio(), t = ac.currentTime
    ;[392.00, 311.13].forEach((freq, i) => {
      const o = ac.createOscillator(), g = ac.createGain()
      o.connect(g); g.connect(ac.destination); o.type = 'sine'
      o.frequency.setValueAtTime(freq, t + i*0.18)
      g.gain.setValueAtTime(0, t + i*0.18)
      g.gain.linearRampToValueAtTime(0.18, t + i*0.18 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, t + i*0.18 + 0.5)
      o.start(t + i*0.18); o.stop(t + i*0.18 + 0.55)
    })
  } catch(e) {}
}

// ── Login screen ─────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function tryLogin() {
    if (pwd === ACCESS_PASSWORD) onLogin()
    else { setError(true); setShake(true); setTimeout(()=>setShake(false), 500) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#111' }}>
      <div style={{
        background:'#1a1a1a', border:'0.5px solid #2a2a2a', borderRadius:16,
        padding:'40px 36px', width:'100%', maxWidth:380, textAlign:'center',
        animation: shake ? 'shake 0.4s ease' : 'none'
      }}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
        <div style={{ fontSize:11, letterSpacing:'0.14em', color:'#555', textTransform:'uppercase', marginBottom:8 }}>Trading Engineering</div>
        <div style={{ fontSize:20, fontWeight:600, color:'#e0e0e0', marginBottom:6 }}>Pattern Recognition</div>
        <div style={{ fontSize:13, color:'#555', marginBottom:32 }}>Inserisci la password per accedere</div>
        <input
          type="password" placeholder="password..." value={pwd}
          onChange={e => { setPwd(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && tryLogin()}
          style={{ width:'100%', padding:'12px 14px', borderRadius:8,
            border: error ? '0.5px solid #E24B4A' : '0.5px solid #2a2a2a',
            background:'#111', color:'#e0e0e0', fontSize:14,
            outline:'none', marginBottom:12, boxSizing:'border-box' }}
        />
        {error && <div style={{ fontSize:12, color:'#E24B4A', marginBottom:12 }}>Password errata — riprova</div>}
        <button onClick={tryLogin} style={{
          width:'100%', padding:'12px', borderRadius:8, border:'none',
          background:'#1D9E75', color:'#fff', fontSize:14, fontWeight:500, cursor:'pointer'
        }}>Accedi →</button>
        <div style={{ fontSize:11, color:'#333', marginTop:24 }}>MQL Suite Academy · Trading Engineering</div>
      </div>
    </div>
  )
}

// ── Canvas renderer ──────────────────────────────────────────────────────
function drawChart(canvas, candles, revealed, patternKey) {
  if (!canvas) return
  const W = canvas.width, H = canvas.height
  const ctx = canvas.getContext('2d')
  const upCol = '#1D9E75', dnCol = '#E24B4A'

  ctx.clearRect(0,0,W,H)
  ctx.fillStyle = '#1a1a1a'
  ctx.beginPath(); ctx.roundRect(0,0,W,H,6); ctx.fill()

  const PL=8, PR=58, PT=16, PB=10
  const allH = Math.max(...candles.map(c=>c.h))
  const allL = Math.min(...candles.map(c=>c.l))
  const pr  = allH - allL || 0.001
  function py(v) { return PT + (1-(v-allL)/pr)*(H-PT-PB) }
  function px(i) { return PL + (i+0.5) * ((W-PL-PR) / candles.length) }

  const cw = (W-PL-PR) / candles.length
  const bw = Math.max(1.5, cw*0.64)

  // griglia + labels
  for (let g=0; g<=4; g++) {
    const y = PT + g*(H-PT-PB)/4
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(PL,y); ctx.lineTo(W-PR+4,y); ctx.stroke()
    const labelVal = allH - g*pr/4
    const decimals = labelVal > 100 ? 2 : labelVal > 10 ? 3 : 5
    ctx.fillStyle = 'rgba(170,170,170,0.4)'
    ctx.font = '9px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(labelVal.toFixed(decimals), W-PR+7, y+3)
  }

  // candele
  for (let i=0; i<candles.length; i++) {
    const c = candles[i], x = px(i)
    const col = c.c >= c.o ? upCol : dnCol
    ctx.strokeStyle = col; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(x, py(c.h)); ctx.lineTo(x, py(c.l)); ctx.stroke()
    const bT = py(Math.max(c.o,c.c)), bB = py(Math.min(c.o,c.c))
    ctx.fillStyle = col; ctx.fillRect(x-bw/2, bT, bw, Math.max(1, bB-bT))
  }

  // overlay pattern (DOPO la risposta)
  if (revealed && patternKey) {
    ctx.strokeStyle = '#EF9F27'
    ctx.lineWidth = 1.5
    ctx.setLineDash([5, 3])
    ctx.globalAlpha = 0.8

    const overlay = getPatternOverlay(patternKey, candles, px, py)
    if (overlay) {
      // Disegna linee guida
      overlay.lines.forEach(line => {
        ctx.beginPath()
        ctx.moveTo(line.x1, line.y1)
        ctx.lineTo(line.x2, line.y2)
        ctx.stroke()
      })

      ctx.setLineDash([])
      ctx.globalAlpha = 1

      // Disegna etichette
      ctx.fillStyle = '#EF9F27'
      ctx.font = 'bold 10px monospace'
      ctx.textAlign = 'center'
      overlay.labels.forEach(lbl => {
        ctx.fillText(lbl.text, lbl.x, lbl.y)
      })
    }
    ctx.globalAlpha = 1
    ctx.setLineDash([])
  }
}

// Calcola gli overlay didattici per ogni pattern
function getPatternOverlay(key, candles, px, py) {
  const n = candles.length
  if (n < 10) return null

  // Trova punti chiave: massimi e minimi locali
  const highs = candles.map(c => c.h)
  const lows  = candles.map(c => c.l)

  if (key === 'head_shoulders' || key === 'inv_head_shoulders') {
    // Trova 3 picchi (o avvallamenti)
    const isInverse = key === 'inv_head_shoulders'
    const data = isInverse ? lows : highs

    // Divide in 3 regioni e trova min/max in ciascuna
    const r1End = Math.floor(n * 0.35)
    const r2End = Math.floor(n * 0.65)

    let s1Idx = isInverse ? indexOfMin(data, 0, r1End) : indexOfMax(data, 0, r1End)
    let hIdx  = isInverse ? indexOfMin(data, r1End, r2End) : indexOfMax(data, r1End, r2End)
    let s2Idx = isInverse ? indexOfMin(data, r2End, n) : indexOfMax(data, r2End, n)

    const s1Y = py(data[s1Idx]), hY = py(data[hIdx]), s2Y = py(data[s2Idx])
    const necklineY = isInverse
      ? py(Math.max(...lows.slice(s1Idx, s2Idx).filter((_, i) => true)))
      : py(Math.min(...highs.slice(s1Idx, s2Idx).filter((_, i) => true)))

    return {
      lines: [
        // Linee tra i 3 punti chiave
        { x1: px(s1Idx), y1: s1Y, x2: px(hIdx), y2: hY },
        { x1: px(hIdx),  y1: hY,  x2: px(s2Idx), y2: s2Y },
        // Neckline orizzontale
        { x1: px(0), y1: necklineY, x2: px(n-1), y2: necklineY },
      ],
      labels: [
        { text: 'S', x: px(s1Idx), y: s1Y + (isInverse ? 14 : -8) },
        { text: 'H', x: px(hIdx),  y: hY  + (isInverse ? 14 : -8) },
        { text: 'S', x: px(s2Idx), y: s2Y + (isInverse ? 14 : -8) },
      ]
    }
  }

  if (key === 'double_top' || key === 'double_bottom') {
    const isBottom = key === 'double_bottom'
    const data = isBottom ? lows : highs
    const mid = Math.floor(n / 2)
    const p1 = isBottom ? indexOfMin(data, 0, mid) : indexOfMax(data, 0, mid)
    const p2 = isBottom ? indexOfMin(data, mid, n) : indexOfMax(data, mid, n)
    const y1 = py(data[p1]), y2 = py(data[p2])
    return {
      lines: [
        { x1: px(p1), y1: y1, x2: px(p2), y2: y2 },
      ],
      labels: [
        { text: isBottom ? 'B1' : 'T1', x: px(p1), y: y1 + (isBottom ? 14 : -8) },
        { text: isBottom ? 'B2' : 'T2', x: px(p2), y: y2 + (isBottom ? 14 : -8) },
      ]
    }
  }

  if (key === 'asc_triangle' || key === 'desc_triangle') {
    const isAsc = key === 'asc_triangle'
    // Resistenza orizzontale + trendline inclinata
    const resData = isAsc ? highs : lows
    const trendData = isAsc ? lows : highs
    const flatY = py(isAsc ? Math.max(...resData) : Math.min(...resData))
    // Trendline da inizio a fine zona consolidamento
    return {
      lines: [
        { x1: px(2), y1: flatY, x2: px(n-6), y2: flatY }, // linea orizzontale
        // Trendline diagonale (approssimata)
        { x1: px(2), y1: py(trendData[2]), x2: px(n-6), y2: py(trendData[Math.floor(n*0.7)]) },
      ],
      labels: [
        { text: isAsc ? 'R' : 'S', x: px(n-6) + 14, y: flatY + 4 },
      ]
    }
  }

  if (key === 'bull_flag' || key === 'bear_flag') {
    // Pole + flag channel
    const isBull = key === 'bull_flag'
    const poleEnd = 8
    return {
      lines: [
        { x1: px(0), y1: py(isBull ? lows[0] : highs[0]),
          x2: px(poleEnd), y2: py(isBull ? highs[poleEnd] : lows[poleEnd]) },
      ],
      labels: [
        { text: 'POLE', x: px(poleEnd/2), y: 12 },
        { text: 'FLAG', x: px(poleEnd + (n-poleEnd-5)/2), y: 12 },
      ]
    }
  }

  if (key === 'trend_up' || key === 'trend_down') {
    const isUp = key === 'trend_up'
    return {
      lines: [
        { x1: px(0), y1: py(isUp ? lows[0] : highs[0]),
          x2: px(n-1), y2: py(isUp ? lows[n-1] : highs[n-1]) },
      ],
      labels: []
    }
  }

  if (key === 'range') {
    return {
      lines: [
        { x1: px(0), y1: py(Math.max(...highs)), x2: px(n-1), y2: py(Math.max(...highs)) },
        { x1: px(0), y1: py(Math.min(...lows)),  x2: px(n-1), y2: py(Math.min(...lows)) },
      ],
      labels: []
    }
  }

  return null
}

function indexOfMax(arr, start, end) {
  let max = -Infinity, idx = start
  for (let i = start; i < end; i++) if (arr[i] > max) { max = arr[i]; idx = i }
  return idx
}
function indexOfMin(arr, start, end) {
  let min = Infinity, idx = start
  for (let i = start; i < end; i++) if (arr[i] < min) { min = arr[i]; idx = i }
  return idx
}

// ── Mini icona pattern (SVG inline per le opzioni) ───────────────────────
function PatternMiniIcon({ patternKey }) {
  const paths = {
    trend_up:        'M2 22 L 38 6',
    trend_down:      'M2 6 L 38 22',
    range:           'M2 8 H 38 M 2 20 H 38',
    head_shoulders:  'M2 22 L 8 12 L 14 18 L 20 4 L 26 18 L 32 12 L 38 22',
    inv_head_shoulders: 'M2 6 L 8 16 L 14 10 L 20 24 L 26 10 L 32 16 L 38 6',
    double_top:      'M2 22 L 10 6 L 18 18 L 28 6 L 38 22',
    double_bottom:   'M2 6 L 10 22 L 18 10 L 28 22 L 38 6',
    asc_triangle:    'M2 22 L 38 22 M 2 22 L 38 6 M 2 6 L 38 6',
    desc_triangle:   'M2 6 L 38 6 M 2 6 L 38 22 M 2 22 L 38 22',
    bull_flag:       'M2 24 L 14 4 L 18 10 L 26 6 L 30 12 L 38 8',
    bear_flag:       'M2 4 L 14 24 L 18 18 L 26 22 L 30 16 L 38 20',
  }
  return (
    <svg width="40" height="28" viewBox="0 0 40 28" style={{ flexShrink: 0 }}>
      <path d={paths[patternKey] || ''} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Componente principale ────────────────────────────────────────────────
export default function PatternsTrainer() {
  const canvasRef = useRef(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [stats, setStats] = useState({ total:0, correct:0, streak:0, maxStreak:0 })
  const [level, setLevel] = useState('intermedio')
  const [phase, setPhase] = useState('ready')  // ready | answered
  const [round, setRound] = useState(null)
  const [selected, setSelected] = useState(null)

  const startRound = useCallback(() => {
    // Scegli un pattern casuale dal livello corrente
    const candidates = LEVEL_PATTERNS[level]
    const correctKey = candidates[Math.floor(Math.random() * candidates.length)]
    const correctPattern = PATTERNS[correctKey]

    // Genera candele
    const basePrice = level === 'base' ? 1.10 + Math.random() * 0.5 : 1.10 + Math.random() * 0.4
    const candles = correctPattern.gen(basePrice)

    // Costruisci 4 opzioni: la giusta + 3 distrattori dal pool generale
    const allKeys = Object.keys(PATTERNS).filter(k => k !== correctKey)
    const distractors = [...allKeys].sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [correctKey, ...distractors].sort(() => Math.random() - 0.5)

    // Random pair/tf solo per visualizzazione
    const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)]
    const tf = TFS[Math.floor(Math.random() * TFS.length)]

    setRound({ correctKey, candles, options, pair, tf })
    setPhase('ready')
    setSelected(null)
  }, [level])

  // resize handler
  useEffect(() => {
    function handleResize() {
      const cvs = canvasRef.current
      if (!cvs) return
      cvs.width = cvs.parentElement.offsetWidth
      cvs.height = 260
      if (round) drawChart(cvs, round.candles, phase === 'answered', round.correctKey)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [round, phase])

  // Quando cambia il round o la fase, ridisegna
  useEffect(() => {
    if (canvasRef.current && round) {
      drawChart(canvasRef.current, round.candles, phase === 'answered', round.correctKey)
    }
  }, [round, phase])

  // Inizia primo round al login
  useEffect(() => {
    if (loggedIn) startRound()
  }, [loggedIn, startRound])

  function answer(key) {
    if (phase !== 'ready') return
    const correct = key === round.correctKey
    setSelected(key)
    setPhase('answered')
    if (correct) playWin(); else playLoss()
    setStats(s => ({
      total: s.total + 1,
      correct: s.correct + (correct ? 1 : 0),
      streak: correct ? s.streak + 1 : 0,
      maxStreak: correct ? Math.max(s.maxStreak, s.streak + 1) : s.maxStreak
    }))
  }

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />

  const acc = stats.total > 0 ? Math.round(stats.correct/stats.total*100) : null

  return (
    <div style={{ maxWidth:820, margin:'0 auto', padding:'24px 16px' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <Link href="/" style={{ fontSize:11, letterSpacing:'0.12em', color:'#555', textTransform:'uppercase', textDecoration:'none' }}>
          ← <span style={{ color:'#e0e0e0', fontWeight:500 }}>TraderGym</span> · Pattern Recognition
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#EF9F27', fontWeight:500 }}>
          🔥 {stats.streak} streak
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:18 }}>
        {[
          { label:'risposte',   val: stats.total },
          { label:'corrette',   val: stats.correct, color:'#1D9E75' },
          { label:'accuracy',   val: acc !== null ? acc+'%' : '—', color: acc>=60?'#1D9E75':acc<45?'#E24B4A':undefined },
          { label:'streak max', val: stats.maxStreak },
        ].map(s => (
          <div key={s.label} style={{ background:'#222', borderRadius:8, padding:'10px 12px' }}>
            <div style={{ fontSize:11, color:'#555', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:20, fontWeight:500, color: s.color||'#e0e0e0' }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Difficulty selector */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, fontSize:12 }}>
        <span style={{ color:'#666' }}>livello:</span>
        <div style={{ display:'flex', gap:6 }}>
          {['base','intermedio','avanzato'].map(l => (
            <button key={l} onClick={() => { setLevel(l); }}
              style={{
                padding:'5px 12px', borderRadius:14,
                border: l === level ? '0.5px solid #EF9F27' : '0.5px solid #2a2a2a',
                background: l === level ? '#EF9F27' : 'transparent',
                color: l === level ? '#0d0d0d' : '#888',
                fontSize:11, cursor:'pointer', fontWeight: l === level ? 500 : 400,
                textTransform:'capitalize'
              }}
            >{l}</button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ background:'#1a1a1a', border:'0.5px solid #2a2a2a', borderRadius:12, padding:'14px 16px', marginBottom:14 }}>
        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
          <span style={{ background:'#222', borderRadius:6, padding:'4px 10px', fontSize:13, fontWeight:500 }}>{round?.pair || '—'}</span>
          <span style={{ background:'#222', borderRadius:6, padding:'4px 10px', fontSize:12, color:'#888' }}>{round?.tf || '—'}</span>
          <span style={{ fontSize:12, color:'#555', marginLeft:'auto' }}>che pattern vedi?</span>
        </div>
        <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:260, borderRadius:6 }} />
      </div>

      {/* Options */}
      <div style={{ fontSize:13, color:'#bbb', marginBottom:10, fontWeight:500 }}>Identifica il pattern:</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:14 }}>
        {round?.options.map(key => {
          const p = PATTERNS[key]
          let style = {
            background:'transparent', border:'0.5px solid #2a2a2a', borderRadius:8, padding:14,
            cursor: phase === 'ready' ? 'pointer' : 'default',
            display:'flex', gap:12, alignItems:'center', transition:'all 0.15s',
            color:'#888'
          }
          if (phase === 'answered') {
            if (key === round.correctKey) {
              style.borderColor = '#1D9E75'
              style.background = 'rgba(29,158,117,0.08)'
              style.color = '#1D9E75'
            } else if (key === selected) {
              style.borderColor = '#E24B4A'
              style.background = 'rgba(226,75,74,0.08)'
              style.color = '#E24B4A'
              style.opacity = 0.7
            } else {
              style.opacity = 0.4
            }
          }
          return (
            <div key={key} onClick={() => answer(key)} style={style}
              onMouseEnter={e => { if (phase === 'ready') e.currentTarget.style.background = '#1a1a1a' }}
              onMouseLeave={e => { if (phase === 'ready') e.currentTarget.style.background = 'transparent' }}
            >
              <PatternMiniIcon patternKey={key} />
              <div>
                <div style={{ fontSize:13, color: style.color === '#888' ? '#d0d0d0' : style.color }}>{p.name}</div>
                <div style={{ fontSize:10, color:'#666', marginTop:2, letterSpacing:'0.04em', textTransform:'uppercase' }}>{p.kind}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Next button */}
      {phase === 'answered' && (
        <button onClick={startRound} style={{
          width:'100%', padding:'12px', borderRadius:8,
          border:'0.5px solid #2a2a2a', background:'#222',
          cursor:'pointer', fontSize:14, color:'#e0e0e0', transition:'all 0.15s'
        }}>prossimo pattern →</button>
      )}

    </div>
  )
}
