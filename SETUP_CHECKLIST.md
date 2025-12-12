# Setup Checkliste für Teammitglieder

## ✅ Checkliste - Befolge diese Schritte in dieser Reihenfolge:

### 1. Repository Setup
- [ ] Repository geklont
- [ ] In das Projektverzeichnis gewechselt (`cd Sound_Scope`)

### 2. Backend Setup (server/)
- [ ] In den server Ordner gewechselt (`cd server`)
- [ ] `.env` Datei erstellt (von Kollegen die Werte erhalten!)
- [ ] `.env` enthält alle 5 benötigten Werte:
  - [ ] `SPOTIFY_CLIENT_ID=...`
  - [ ] `SPOTIFY_CLIENT_SECRET=...`
  - [ ] `PORT=8888`
  - [ ] `REDIRECT_URI=http://localhost:8888/callback`
  - [ ] `FRONTEND_URI=http://localhost:5173`
- [ ] `npm install` ausgeführt
- [ ] Backend startet ohne Fehler (`node server.js`)
- [ ] In Console steht: "Backend läuft auf http://localhost:8888"

### 3. Frontend Setup (client/)
- [ ] In den client Ordner gewechselt (`cd ../client`)
- [ ] `.env` Datei erstellt
- [ ] `.env` enthält: `VITE_API_URL=http://localhost:8888`
- [ ] `npm install` ausgeführt
- [ ] Frontend startet ohne Fehler (`npm run dev`)
- [ ] Browser öffnet sich auf http://localhost:5173

### 4. Spotify Developer Setup (NUR wenn ihr eigene App erstellt)
- [ ] Spotify Developer Account vorhanden
- [ ] App im Dashboard erstellt
- [ ] Redirect URI eingetragen: `http://localhost:8888/callback`
- [ ] Client ID und Secret kopiert

### 5. Testen
- [ ] Seite lädt ohne Fehler (http://localhost:5173)
- [ ] "Mit Spotify verbinden" Button ist sichtbar
- [ ] Login funktioniert (Button klicken)
- [ ] Nach Login werden Daten angezeigt
- [ ] Keine Fehler in der Browser Console (F12)

## 🚨 Häufigste Fehler

### ❌ Fehler: "Cannot GET /callback" oder "500 Error"
**Problem**: Backend läuft nicht oder falsche .env
**Lösung**: 
1. Überprüfe ob Backend läuft (`node server.js`)
2. Überprüfe `.env` Datei im server Ordner
3. Starte Backend neu

### ❌ Fehler: Seite ist komplett leer
**Problem**: Frontend kann Backend nicht erreichen
**Lösung**:
1. Überprüfe ob BEIDE Server laufen
2. Überprüfe `client/.env` → muss `VITE_API_URL=http://localhost:8888` enthalten
3. Frontend neu starten (Ctrl+C, dann `npm run dev`)

### ❌ Fehler: "Invalid redirect URI"
**Problem**: Redirect URI in Spotify App nicht eingetragen
**Lösung**: 
1. Gehe zu Spotify Developer Dashboard
2. Öffne deine App
3. Settings → Redirect URIs
4. Füge hinzu: `http://localhost:8888/callback`
5. Speichern

### ❌ Fehler: "CORS Error"
**Problem**: FRONTEND_URI in server/.env ist falsch
**Lösung**: Setze in `server/.env`: `FRONTEND_URI=http://localhost:5173`

## 📝 Wichtige Hinweise

1. **BEIDE Server müssen laufen** - Backend UND Frontend
2. **Öffne 2 Terminals** - eines für server, eines für client
3. **.env Dateien sind geheim** - NIEMALS committen!
4. **Bei Änderungen an .env** → Server neu starten
5. **Token läuft nach 1 Stunde ab** → Einfach Seite neu laden (F5)

## 🎯 Schnellstart (wenn alles konfiguriert ist)

**Terminal 1 (Backend):**
```bash
cd server
node server.js
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

**Browser:**
Öffne http://localhost:5173

## 💬 Brauchst du Hilfe?

Wenn es nicht funktioniert, schicke deinem Kollegen:
1. Screenshot vom Fehler
2. Ausgabe aus der Browser Console (F12)
3. Ausgabe aus beiden Terminals
4. Inhalt deiner .env Dateien (die Werte kannst du zensieren, aber zeige die Keys)
