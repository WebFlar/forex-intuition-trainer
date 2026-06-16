# Forex Intuition Trainer
### by Trading Engineering

Allena la tua intuizione sul mercato forex con grafici OHLC reali.

---

## Deploy su Vercel (5 minuti)

### 1. Crea repo GitHub
- Vai su github.com → New repository
- Nome: `forex-intuition-trainer`
- Public, senza README
- Crea il repo

### 2. Carica i file
Sul tuo computer, nella cartella del progetto:
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/forex-intuition-trainer.git
git push -u origin main
```

### 3. Deploy su Vercel
- Vai su vercel.com → Add New Project
- Importa il repo GitHub
- Framework: **Next.js** (rilevato automatico)
- Nella sezione **Environment Variables** aggiungi:
  - Key: `POLYGON_API_KEY`
  - Value: la tua API key di Polygon.io
- Clicca **Deploy**

### 4. Ottieni API Key Polygon.io (gratis)
- Vai su polygon.io/dashboard/signup
- Registrati (no carta di credito)
- Dashboard → API Keys → copia la key

---

## Sviluppo locale

```bash
npm install
cp .env.example .env.local
# Modifica .env.local con la tua API key
npm run dev
```

Apri http://localhost:3000
