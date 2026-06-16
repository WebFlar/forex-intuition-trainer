export const metadata = {
  title: 'Forex Intuition Trainer — Trading Engineering',
  description: 'Allena la tua intuizione sul mercato forex con grafici reali',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, padding: 0, background: '#141414', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
