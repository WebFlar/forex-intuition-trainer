import Link from 'next/link'

export default function Landing() {
  const accent = '#EF9F27'
  const bg = '#0d0d0d'
  const bgDark = '#0a0a0a'
  const text = '#d8d8d8'
  const border = '#1a1a1a'

  return (
    <div style={{ background: bg, color: text, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 40px', borderBottom:`0.5px solid ${border}`, maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:7, background:accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6v12M3 9v6M18 6v12M21 9v6M6 12h12"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:500, color:'#f0f0f0' }}>TraderGym</div>
            <div style={{ fontSize:9, color:'#666', letterSpacing:'0.18em', textTransform:'uppercase', marginTop:1 }}>by Trading Engineering</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:24, fontSize:13, color:'#888' }}>
          <a href="#sale" style={{ color:'#888', textDecoration:'none' }}>Le Sale</a>
          <a href="#metodo" style={{ color:'#888', textDecoration:'none' }}>Come Funziona</a>
          <a href="#community" style={{ color:'#888', textDecoration:'none' }}>Community</a>
        </div>
        <Link href="/trainer" style={{ background:accent, color:'#0d0d0d', padding:'8px 16px', borderRadius:6, fontSize:12, fontWeight:500, textDecoration:'none' }}>
          Accedi →
        </Link>
      </nav>

      {/* HERO */}
      <section style={{ padding:'80px 40px 64px', textAlign:'center', borderBottom:`0.5px solid ${border}`, maxWidth:1200, margin:'0 auto' }}>
        <div style={{ fontSize:11, letterSpacing:'0.22em', color:accent, textTransform:'uppercase', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
          <span style={{ width:24, height:1, background:accent, opacity:0.6 }}></span>
          La palestra del trader
          <span style={{ width:24, height:1, background:accent, opacity:0.6 }}></span>
        </div>
        <h1 style={{ fontSize:'clamp(32px, 5vw, 48px)', fontWeight:500, color:'#f5f5f5', lineHeight:1.1, maxWidth:680, margin:'0 auto 20px' }}>
          Allena la mente prima<br/>di rischiare il <span style={{ color:accent }}>capitale</span>.
        </h1>
        <p style={{ fontSize:16, color:'#888', maxWidth:520, margin:'0 auto 36px', lineHeight:1.55 }}>
          Sale di allenamento per sviluppare intuito, riconoscimento pattern, gestione del rischio e disciplina. Tutto con dati di mercato reali.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/trainer" style={{ background:accent, color:'#0d0d0d', padding:'13px 28px', borderRadius:7, fontSize:14, fontWeight:500, textDecoration:'none' }}>
            Inizia gratis →
          </Link>
          <a href="#sale" style={{ background:'transparent', color:'#d0d0d0', padding:'13px 28px', borderRadius:7, fontSize:14, border:'0.5px solid #2a2a2a', textDecoration:'none' }}>
            Esplora le sale
          </a>
        </div>
      </section>

      {/* STATS */}
      <section style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', padding:'28px 40px', borderBottom:`0.5px solid ${border}`, gap:12, maxWidth:1200, margin:'0 auto' }}>
        {[
          { n:'6+', l:'Sale di allenamento' },
          { n:'2.8k', l:'Trader attivi' },
          { n:'450k', l:'Sessioni completate' },
          { n:'13y', l:'Esperienza fondatore' },
        ].map((s,i)=>(
          <div key={i} style={{ textAlign:'center' }}>
            <div style={{ fontSize:24, fontWeight:500, color:accent, fontFamily:'monospace' }}>{s.n}</div>
            <div style={{ fontSize:10, color:'#666', letterSpacing:'0.14em', textTransform:'uppercase', marginTop:4 }}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* ROOMS */}
      <section id="sale" style={{ padding:'64px 40px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ fontSize:10, letterSpacing:'0.22em', color:accent, textTransform:'uppercase', marginBottom:10 }}>Le Sale</div>
        <h2 style={{ fontSize:26, fontWeight:500, color:'#f0f0f0', marginBottom:10 }}>Scegli dove allenarti oggi</h2>
        <p style={{ fontSize:14, color:'#777', marginBottom:36, maxWidth:520 }}>
          Ogni sala è progettata per costruire una skill specifica. Inizia da quella che ti serve di più.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:14 }}>

          <Link href="/trainer" style={{ textDecoration:'none', color:'inherit' }}>
            <div style={{ background:'#141414', border:`0.5px solid ${accent}`, borderRadius:10, padding:22, position:'relative', height:'100%' }}>
              <div style={{ position:'absolute', top:-9, left:16, background:accent, color:'#0d0d0d', fontSize:9, fontWeight:600, padding:'3px 8px', borderRadius:4, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                Disponibile
              </div>
              <RoomIcon emoji="🎯" />
              <div style={{ fontSize:15, fontWeight:500, color:'#e8e8e8', marginBottom:6 }}>Intuition Trainer</div>
              <p style={{ fontSize:12, color:'#777', lineHeight:1.5, marginBottom:14 }}>
                Leggi il grafico e prevedi la direzione futura. Allena l'occhio del trader su candele reali.
              </p>
              <div style={{ display:'flex', gap:10, fontSize:10, color:'#555', letterSpacing:'0.06em', textTransform:'uppercase' }}>
                5 min · 6 coppie · Tutti i livelli
              </div>
            </div>
          </Link>

          <Link href="/patterns" style={{ textDecoration:'none', color:'inherit' }}>
            <div style={{ background:'#141414', border:`0.5px solid ${accent}`, borderRadius:10, padding:22, position:'relative', height:'100%' }}>
              <div style={{ position:'absolute', top:-9, left:16, background:accent, color:'#0d0d0d', fontSize:9, fontWeight:600, padding:'3px 8px', borderRadius:4, letterSpacing:'0.1em', textTransform:'uppercase' }}>
                Disponibile
              </div>
              <RoomIcon emoji="📊" />
              <div style={{ fontSize:15, fontWeight:500, color:'#e8e8e8', marginBottom:6 }}>Pattern Recognition</div>
              <p style={{ fontSize:12, color:'#777', lineHeight:1.5, marginBottom:14 }}>
                Identifica testa-spalle, doppi massimi, triangoli e bandiere. Multiple choice con feedback istantaneo.
              </p>
              <div style={{ display:'flex', gap:10, fontSize:10, color:'#555', letterSpacing:'0.06em', textTransform:'uppercase' }}>
                7 min · 11 pattern · 3 livelli
              </div>
            </div>
          </Link>
          <RoomCard emoji="🛡️" title="Risk Manager" desc="Simulatore di money management. Allena la disciplina sul size delle posizioni." meta="In arrivo" />
          <RoomCard emoji="📏" title="S/R Drill" desc="Clicca i livelli chiave su grafici puri. Misura la precisione contro i supporti reali." meta="In arrivo" />
          <RoomCard emoji="⚡" title="Reaction Speed" desc="Quanto sei veloce a reagire al breakout? Misura i tempi di esecuzione in millisecondi." meta="In arrivo" />
          <RoomCard emoji="🧠" title="Multi-Timeframe" desc="D1, H4, H1 della stessa coppia. Leggi la confluenza e decidi long, short o stand-by." meta="In arrivo" />

        </div>
      </section>

      {/* METODO */}
      <section id="metodo" style={{ background:bgDark, padding:'64px 40px', borderTop:`0.5px solid ${border}`, borderBottom:`0.5px solid ${border}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ fontSize:10, letterSpacing:'0.22em', color:accent, textTransform:'uppercase', marginBottom:10 }}>Il metodo</div>
          <h2 style={{ fontSize:26, fontWeight:500, color:'#f0f0f0', marginBottom:36 }}>Costruisci la skill, poi il PnL</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:28 }}>
            {[
              { n:'01', t:'Sessioni brevi e ripetute', d:'5–10 minuti al giorno. Il cervello impara col ritmo, non con le maratone.' },
              { n:'02', t:'Dati reali di mercato', d:'Candele OHLC vere su 6 coppie majors. Niente simulazioni patinate, solo mercato.' },
              { n:'03', t:'Statistiche personali', d:'Vedi dove sei forte e dove perdi. Migliora dove conta davvero per te.' },
            ].map((f,i)=>(
              <div key={i}>
                <div style={{ fontSize:11, fontWeight:500, color:accent, letterSpacing:'0.18em' }}>{f.n}</div>
                <div style={{ fontSize:15, fontWeight:500, color:'#e8e8e8', margin:'8px 0 6px' }}>{f.t}</div>
                <p style={{ fontSize:13, color:'#777', lineHeight:1.55 }}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section id="community" style={{ padding:'64px 40px', textAlign:'center', borderBottom:`0.5px solid ${border}`, maxWidth:1200, margin:'0 auto' }}>
        <p style={{ fontSize:19, color:'#d0d0d0', fontStyle:'italic', maxWidth:560, margin:'0 auto 20px', lineHeight:1.5 }}>
          "Ho capito quante volte il mio bias mi tradiva solo dopo 200 ripetizioni in palestra. Adesso entro a mercato con tutta un'altra consapevolezza."
        </p>
        <div style={{ fontSize:13, color:'#666' }}>
          <span style={{ color:accent, fontWeight:500 }}>M. R.</span> · Funded trader, The Trading Pit
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 40px', textAlign:'center', background:bgDark }}>
        <h2 style={{ fontSize:28, fontWeight:500, color:'#f0f0f0', marginBottom:10 }}>Pronto a entrare in palestra?</h2>
        <p style={{ fontSize:14, color:'#777', marginBottom:28 }}>Accesso gratuito alla community MQL Suite Academy</p>
        <Link href="/trainer" style={{ background:accent, color:'#0d0d0d', padding:'13px 32px', borderRadius:7, fontSize:14, fontWeight:500, textDecoration:'none' }}>
          Inizia ora →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'24px 40px', display:'flex', justifyContent:'space-between', fontSize:11, color:'#555', borderTop:`0.5px solid ${border}`, maxWidth:1200, margin:'0 auto', flexWrap:'wrap', gap:12 }}>
        <div>© 2026 Trading Engineering · TraderGym</div>
        <div style={{ display:'flex', gap:18 }}>
          <span>Privacy</span><span>Termini</span><span>Contatti</span>
        </div>
      </footer>

    </div>
  )
}

function RoomIcon({ emoji }) {
  return (
    <div style={{ width:36, height:36, borderRadius:8, background:'#1d1d1d', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, fontSize:18 }}>
      {emoji}
    </div>
  )
}

function RoomCard({ emoji, title, desc, meta }) {
  return (
    <div style={{ background:'#141414', border:'0.5px solid #1f1f1f', borderRadius:10, padding:22, opacity:0.55, height:'100%' }}>
      <RoomIcon emoji={emoji} />
      <div style={{ fontSize:15, fontWeight:500, color:'#e8e8e8', marginBottom:6 }}>{title}</div>
      <p style={{ fontSize:12, color:'#777', lineHeight:1.5, marginBottom:14 }}>{desc}</p>
      <div style={{ fontSize:10, color:'#444', letterSpacing:'0.06em', textTransform:'uppercase' }}>🔒 {meta}</div>
    </div>
  )
}
