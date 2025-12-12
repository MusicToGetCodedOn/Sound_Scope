# Sound_Scope Setup Anleitung

## Voraussetzungen
- Node.js (v16 oder höher)
- npm oder yarn
- Spotify Developer Account

## Setup Schritte

### 1. Repository klonen
```bash
git clone <repository-url>
cd Sound_Scope
```

### 2. Spotify Developer App einrichten

1. Gehe zu [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Erstelle eine neue App
3. Notiere dir:
   - **Client ID**
   - **Client Secret**
4. Füge in den App Settings unter "Redirect URIs" hinzu:
   - `http://localhost:8888/callback`

### 3. Backend (.env) konfigurieren

1. Gehe in den `server` Ordner:
   ```bash
   cd server
   ```

2. Kopiere `.env.example` zu `.env`:
   ```bash
   cp .env.example .env
   ```

3. Öffne `.env` und fülle die Werte aus:
   ```env
   SPOTIFY_CLIENT_ID=deine_client_id_hier
   SPOTIFY_CLIENT_SECRET=dein_client_secret_hier
   PORT=8888
   REDIRECT_URI=http://localhost:8888/callback
   FRONTEND_URI=http://localhost:5173
   ```

4. Installiere Dependencies:
   ```bash
   npm install
   ```

### 4. Frontend (.env) konfigurieren

1. Gehe in den `client` Ordner:
   ```bash
   cd ../client
   ```

2. Kopiere `.env.example` zu `.env`:
   ```bash
   cp .env.example .env
   ```

3. Die `.env` sollte enthalten:
   ```env
   VITE_API_URL=http://localhost:8888
   ```

4. Installiere Dependencies:
   ```bash
   npm install
   ```

### 5. Anwendung starten

#### Backend starten (Terminal 1):
```bash
cd server
node server.js
```
Du solltest sehen: `Backend läuft auf http://localhost:8888`

#### Frontend starten (Terminal 2):
```bash
cd client
npm run dev
```
Du solltest sehen: Server läuft auf `http://localhost:5173`

### 6. App benutzen

1. Öffne im Browser: `http://localhost:5173`
2. Klicke auf "Mit Spotify verbinden"
3. Logge dich mit deinem Spotify Account ein
4. Nach dem Login siehst du deine aktuelle Musik und den Verlauf

## Häufige Probleme

### Problem: "500 Internal Server Error"
- **Lösung**: Stelle sicher, dass:
  - Der Server läuft (`node server.js`)
  - Die `.env` Datei korrekt ausgefüllt ist
  - Die Spotify Credentials korrekt sind

### Problem: "CORS Error"
- **Lösung**: Überprüfe, dass `FRONTEND_URI` in der Server `.env` korrekt ist (normalerweise `http://localhost:5173`)

### Problem: "Invalid Redirect URI"
- **Lösung**: 
  - Gehe zu deiner Spotify App im Developer Dashboard
  - Füge unter "Redirect URIs" hinzu: `http://localhost:8888/callback`
  - Stelle sicher, dass `REDIRECT_URI` in der `.env` exakt übereinstimmt

### Problem: Seite ist leer / zeigt nichts an
- **Lösung**:
  - Stelle sicher, dass du eingeloggt bist (auf "Mit Spotify verbinden" klicken)
  - Überprüfe die Browser Console auf Fehler (F12)
  - Stelle sicher, dass Backend und Frontend laufen

### Problem: "Token expired"
- **Lösung**: Lade die Seite neu (F5) - der Token wird automatisch erneuert

## Für Teammitglieder

Wenn du das Projekt von einem Kollegen übernimmst:

1. **Klone das Repository**
2. **Hole dir die .env Werte** von deinem Kollegen (NICHT im Git!)
3. **Erstelle beide .env Dateien**:
   - `server/.env` (mit Spotify Credentials)
   - `client/.env` (mit VITE_API_URL)
4. **Installiere Dependencies** in beiden Ordnern (`npm install`)
5. **Starte beide Server** (Backend und Frontend)

## Port-Änderungen

Falls du andere Ports verwenden möchtest:

1. Ändere im `server/.env`:
   - `PORT=8888` → dein neuer Backend-Port
   - `REDIRECT_URI=http://localhost:NEUER_PORT/callback`
   - `FRONTEND_URI=http://localhost:NEUER_FRONTEND_PORT`

2. Ändere im `client/.env`:
   - `VITE_API_URL=http://localhost:NEUER_BACKEND_PORT`

3. **WICHTIG**: Update auch die Redirect URI in deiner Spotify App!

## Technologie Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **API**: Spotify Web API
- **Auth**: OAuth 2.0

## Support

Bei Problemen überprüfe:
1. Sind beide Server gestartet?
2. Sind die .env Dateien korrekt?
3. Sind die Redirect URIs in Spotify korrekt?
4. Browser Console Fehler (F12)?
