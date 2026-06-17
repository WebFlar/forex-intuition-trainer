export const metadata = {
  title: 'TraderGym — La palestra del trader',
  description: 'Allena la mente prima di rischiare il capitale. Sale di allenamento per intuito, pattern recognition e disciplina, con dati di mercato reali.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, padding: 0, background: '#0d0d0d', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
