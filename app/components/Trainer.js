'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

const ACCESS_PASSWORD = 'mqlsuite2024'

function LoginScreen({ onLogin }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function tryLogin() {
    if (pwd === ACCESS_PASSWORD) {
      onLogin()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#111' }}>
      <div style={{
        background:'#1a1a1a', border:'0.5px solid #2a2a2a', borderRadius:16,
        padding:'40px 36px', width:'100%', maxWidth:380, textAlign:'center',
        animation: shake ? 'shake 0.4s ease' : 'none'
      }}>
        <style>{`
          @keyframes shake {
            0%,100%{transform:translateX(0)}
            20%{transform:translateX(-8px)}
            40%{transform:translateX(8px)}
            60%{transform:translateX(-6px)}
            80%{transform:translateX(6px)}
          }
        `}</style>

        <div style={{ fontSize:11, letterSpacing:'0.14em', color:'#555', textTransform:'uppercase', marginBottom:8 }}>
          Trading Engineering
        </div>
        <div style={{ fontSize:20, fontWeight:600, color:'#e0e0e0', marginBottom:6 }}>
          Intuition Trainer
        </div>
        <div style={{ fontSize:13, color:'#555', marginBottom:32 }}>
          Inserisci la password per accedere
        </div>

        <input
          type="password"
          placeholder="password..."
          value={pwd}
          onChange={e => { setPwd(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && tryLogin()}
          style={{
            width:'100%', padding:'12px 14px', borderRadius:8,
            border: error ? '0.5px solid #E24B4A' : '0.5px solid #2a2a2a',
            background:'#111', color:'#e0e0e0', fontSize:14,
            outline:'none', marginBottom:12, boxSizing:'border-box',
            transition:'border 0.2s'
          }}
        />

        {error && (
          <div style={{ fontSize:12, color:'#E24B4A', marginBottom:12 }}>
            Password errata — riprova
          </div>
        )}

        <button onClick={tryLogin} style={{
          width:'100%', padding:'12px', borderRadius:8,
          border:'none', background:'#1D9E75', color:'#fff',
          fontSize:14, fontWeight:500, cursor:'pointer', transition:'opacity 0.15s'
        }}
          onMouseOver={e => e.target.style.opacity=0.85}
          onMouseOut={e => e.target.style.opacity=1}
        >
          Accedi →
        </button>

        <div style={{ fontSize:11, color:'#333', marginTop:24 }}>
          MQL Suite Academy · Trading Engineering
        </div>
      </div>
    </div>
  )
}

const PAIRS = ['EURUSD','GBPUSD','USDJPY','AUDUSD','USDCAD','USDCHF','EURJPY','GBPJPY','NZDUSD','EURGBP']
const TFS   = ['M15','H1','H4','D1']

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

// ── Canvas renderer ──────────────────────────────────────────────────────
function drawChart(canvas, hist, future, revealed) {
  if (!canvas) return
  const W = canvas.width, H = canvas.height
  const ctx = canvas.getContext('2d')
  const upCol = '#1D9E75', dnCol = '#E24B4A'

  ctx.clearRect(0,0,W,H)
  ctx.fillStyle = '#1a1a1a'
  ctx.beginPath(); ctx.roundRect(0,0,W,H,6); ctx.fill()

  const PL=8, PR=58, PT=16, PB=10
  const visN = hist.length
  const futN = future.length
  const totN = visN + futN
  const allC = [...hist, ...future]
  const aH = Math.max(...allC.map(c=>c.h))
  const aL = Math.min(...allC.map(c=>c.l))
  const pr  = aH - aL || 0.001
  function py(v) { return PT + (1-(v-aL)/pr)*(H-PT-PB) }

  const cw = (W-PL-PR)/totN
  const bw = Math.max(1.5, cw*0.64)
  const fogX = PL + visN*cw

  // Griglia + labels prezzo
  for (let g=0; g<=4; g++) {
    const y = PT + g*(H-PT-PB)/4
    ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=0.5
    ctx.beginPath(); ctx.moveTo(PL,y); ctx.lineTo(W-PR+4,y); ctx.stroke()
    ctx.fillStyle='rgba(170,170,170,0.45)'; ctx.font='9px monospace'; ctx.textAlign='left'
    ctx.fillText((aH - g*pr/4).toFixed(4), W-PR+7, y+3)
  }

  // Candele storiche
  for (let i=0; i<visN; i++) {
    const c=hist[i], x=PL+(i+0.5)*cw
    const col = c.c >= c.o ? upCol : dnCol
    ctx.strokeStyle=col; ctx.lineWidth=1
    ctx.beginPath(); ctx.moveTo(x,py(c.h)); ctx.lineTo(x,py(c.l)); ctx.stroke()
    const bT=py(Math.max(c.o,c.c)), bB=py(Math.min(c.o,c.c))
    ctx.fillStyle=col; ctx.fillRect(x-bw/2, bT, bw, Math.max(1,bB-bT))
  }

  // Fog o reveal
  if (!revealed) {
    ctx.fillStyle='rgba(28,28,28,0.95)'
    ctx.beginPath(); ctx.roundRect(fogX,0,W-fogX,H,[0,6,6,0]); ctx.fill()
    ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.lineWidth=1; ctx.setLineDash([4,4])
    ctx.beginPath(); ctx.moveTo(fogX,0); ctx.lineTo(fogX,H); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle='rgba(130,130,130,0.4)'; ctx.font='bold 20px monospace'; ctx.textAlign='center'
    ctx.fillText('?', fogX+(W-PR-fogX)/2, H/2+7)
  } else {
    const dir = future.length > 0 ? (future[future.length-1].c > future[0].o ? 'up' : 'down') : 'up'
    ctx.fillStyle = dir==='up' ? 'rgba(29,158,117,0.07)' : 'rgba(226,75,74,0.07)'
    ctx.beginPath(); ctx.roundRect(fogX,0,W-fogX,H,[0,6,6,0]); ctx.fill()
    ctx.strokeStyle = dir==='up' ? upCol : dnCol
    ctx.lineWidth=1; ctx.setLineDash([4,4])
    ctx.beginPath(); ctx.moveTo(fogX,0); ctx.lineTo(fogX,H); ctx.stroke()
    ctx.setLineDash([])
    for (let i=0; i<futN; i++) {
      const c=future[i], x=PL+(visN+i+0.5)*cw
      const col = c.c >= c.o ? upCol : dnCol
      ctx.strokeStyle=col; ctx.lineWidth=1
      ctx.beginPath(); ctx.moveTo(x,py(c.h)); ctx.lineTo(x,py(c.l)); ctx.stroke()
      const bT=py(Math.max(c.o,c.c)), bB=py(Math.min(c.o,c.c))
      ctx.fillStyle=col; ctx.fillRect(x-bw/2,bT,bw,Math.max(1,bB-bT))
    }
  }
}

// ── Componente principale ────────────────────────────────────────────────
export default function Trainer() {
  const [loggedIn, setLoggedIn] = useState(false)
  const canvasRef = useRef(null)
  const [stats, setStats]       = useState({ total:0, correct:0, streak:0, maxStreak:0 })
  const [pair, setPair]         = useState('EURUSD')
  const [tf, setTf]             = useState('H1')
  const [confidence, setConf]   = useState(0)
  const [phase, setPhase]       = useState('loading') // loading | ready | answered
  const [result, setResult]     = useState(null)      // { correct, dir, move }
  const [error, setError]       = useState(null)

  const gameRef = useRef({ hist:[], future:[], direction:null, lastClose:0 })

  const loadRound = useCallback(async (newPair, newTf) => {
    setPhase('loading')
    setResult(null)
    setError(null)
    setConf(0)

    try {
      const res  = await fetch(`/api/candles?pair=${newPair}&tf=${newTf}&limit=90`)
      const data = await res.json()
      if (!data.candles) throw new Error(data.error || 'Errore API')

      const all = data.candles
      if (all.length < 30) throw new Error('Dati insufficienti')

      // Prendi finestra casuale: 55 candele visibili + 18 future
      const HIST_N = 55, FUT_N = 18
      const maxStart = all.length - HIST_N - FUT_N
      if (maxStart < 0) throw new Error('Serie troppo corta')
      const start = Math.floor(Math.random() * Math.max(1, maxStart))
      const hist   = all.slice(start, start + HIST_N)
      const future = all.slice(start + HIST_N, start + HIST_N + FUT_N)
      const direction = future[future.length-1].c > future[0].o ? 'up' : 'down'

      gameRef.current = { hist, future, direction, lastClose: hist[hist.length-1].c }
      setPhase('ready')
    } catch(e) {
      setError(e.message)
      setPhase('error')
    }
  }, [])

  // Ridisegna quando cambia fase
  useEffect(() => {
    const g = gameRef.current
    if (!g.hist.length) return
    const cvs = canvasRef.current
    if (!cvs) return
    drawChart(cvs, g.hist, g.future, phase === 'answered')
  }, [phase])

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const cvs = canvasRef.current
      if (!cvs) return
      cvs.width  = cvs.parentElement.offsetWidth
      cvs.height = 260
      const g = gameRef.current
      if (g.hist.length) drawChart(cvs, g.hist, g.future, phase === 'answered')
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [phase])

  // Prima partita
  useEffect(() => {
    const p = PAIRS[Math.floor(Math.random()*PAIRS.length)]
    const t = TFS[Math.floor(Math.random()*TFS.length)]
    setPair(p); setTf(t)
    loadRound(p, t)
  }, [])

  function guess(dir) {
    if (phase !== 'ready') return
    const g = gameRef.current
    const correct = dir === g.direction
    const movePct = ((g.future[g.future.length-1].c - g.lastClose) / g.lastClose * 100)
    if (correct) playWin(); else playLoss()
    setResult({ correct, dir: g.direction, move: movePct })
    setPhase('answered')
    setStats(s => ({
      total: s.total+1,
      correct: s.correct + (correct?1:0),
      streak: correct ? s.streak+1 : 0,
      maxStreak: correct ? Math.max(s.maxStreak, s.streak+1) : s.maxStreak
    }))
  }

  function nextRound() {
    const p = PAIRS[Math.floor(Math.random()*PAIRS.length)]
    const t = TFS[Math.floor(Math.random()*TFS.length)]
    setPair(p); setTf(t)
    loadRound(p, t)
  }

  const acc = stats.total > 0 ? Math.round(stats.correct/stats.total*100) : null
  const CONF_LABELS = ['','incerto','poco sicuro','abbastanza sicuro','sicuro','certissimo']

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />

  return (
    <div style={{ maxWidth:820, margin:'0 auto', padding:'24px 16px' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ fontSize:11, letterSpacing:'0.12em', color:'#555', textTransform:'uppercase' }}>
          <span style={{ color:'#e0e0e0', fontWeight:500 }}>Trading Engineering</span> — Intuition Trainer
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#EF9F27', fontWeight:500 }}>
          🔥 {stats.streak} streak
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:20 }}>
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

      {/* Chart card */}
      <div style={{ background:'#1a1a1a', border:'0.5px solid #2a2a2a', borderRadius:12, padding:'14px 16px', marginBottom:14 }}>
        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
          <span style={{ background:'#222', borderRadius:6, padding:'4px 10px', fontSize:13, fontWeight:500 }}>{pair}</span>
          <span style={{ background:'#222', borderRadius:6, padding:'4px 10px', fontSize:12, color:'#888' }}>{tf}</span>
          {phase==='loading' && <span style={{ fontSize:12, color:'#555', marginLeft:'auto' }}>caricamento dati reali…</span>}
          {phase==='ready'   && <span style={{ fontSize:12, color:'#555', marginLeft:'auto' }}>dove andrà il prezzo?</span>}
          {phase==='error'   && <span style={{ fontSize:12, color:'#E24B4A', marginLeft:'auto' }}>⚠ {error}</span>}
        </div>
        <div style={{ position:'relative', width:'100%' }}>
          <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:260, borderRadius:6 }} />
          {phase==='loading' && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(26,26,26,0.8)', borderRadius:6 }}>
              <div style={{ fontSize:13, color:'#555' }}>⏳ caricamento…</div>
            </div>
          )}
        </div>
      </div>

      {/* Confidence stars */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
        <span style={{ fontSize:13, color:'#888', whiteSpace:'nowrap' }}>sicurezza:</span>
        <div style={{ display:'flex', gap:4 }}>
          {[1,2,3,4,5].map(v => (
            <span key={v} onClick={()=>phase==='ready'&&setConf(v)}
              style={{ fontSize:22, cursor:'pointer', color: v<=confidence ? '#EF9F27' : '#333', lineHeight:1, userSelect:'none' }}>★</span>
          ))}
        </div>
        <span style={{ fontSize:12, color:'#555' }}>{CONF_LABELS[confidence]}</span>
      </div>

      {/* Buttons */}
      <div style={{ display:'flex', gap:10, marginBottom:14 }}>
        <button onClick={()=>guess('up')} disabled={phase!=='ready'}
          style={{ flex:1, padding:'13px', borderRadius:8, border:'0.5px solid #1D9E75', background:'transparent', cursor:phase==='ready'?'pointer':'not-allowed', fontSize:14, fontWeight:500, color:'#1D9E75', opacity:phase==='ready'?1:0.3, transition:'all .15s' }}>
          ↗ Salirà
        </button>
        <button onClick={()=>guess('down')} disabled={phase!=='ready'}
          style={{ flex:1, padding:'13px', borderRadius:8, border:'0.5px solid #E24B4A', background:'transparent', cursor:phase==='ready'?'pointer':'not-allowed', fontSize:14, fontWeight:500, color:'#E24B4A', opacity:phase==='ready'?1:0.3, transition:'all .15s' }}>
          ↘ Scenderà
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{ borderRadius:8, padding:'12px 16px', marginBottom:14, display:'flex', alignItems:'center', gap:12, fontSize:14, fontWeight:500,
          background: result.correct ? 'rgba(29,158,117,0.1)' : 'rgba(226,75,74,0.1)',
          border:     result.correct ? '0.5px solid rgba(29,158,117,0.3)' : '0.5px solid rgba(226,75,74,0.3)',
          color:      result.correct ? '#1D9E75' : '#E24B4A' }}>
          <span>{result.correct ? '✓' : '✗'}</span>
          <span>{result.correct ? 'corretto — ottima lettura!' : `sbagliato — andato ${result.dir==='up'?'su ▲':'giù ▼'}`}</span>
          <span style={{ marginLeft:'auto', fontSize:12, opacity:0.8 }}>
            {(result.move>=0?'+':'')+result.move.toFixed(3)+'%'}
          </span>
        </div>
      )}

      {/* Next */}
      {phase==='answered' && (
        <button onClick={nextRound}
          style={{ width:'100%', padding:'12px', borderRadius:8, border:'0.5px solid #2a2a2a', background:'#222', cursor:'pointer', fontSize:14, color:'#e0e0e0', transition:'all .15s' }}>
          prossima sfida →
        </button>
      )}

      {phase==='error' && (
        <button onClick={nextRound}
          style={{ width:'100%', padding:'12px', borderRadius:8, border:'0.5px solid #E24B4A', background:'transparent', cursor:'pointer', fontSize:14, color:'#E24B4A' }}>
          riprova con un altro grafico →
        </button>
      )}

    </div>
  )
}
