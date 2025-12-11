require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
const mongoose = require('mongoose');
const PlayHistory = require('./models/PlayHistory');

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FRONTEND_URI = process.env.FRONTEND_URI;

// --- 1. LOGIN ROUTE (Aktualisiert mit mehr Rechten/Scopes) ---
app.get('/login', (req, res) => {
    // Hier fügen wir die nötigen Rechte hinzu:
    // 'user-read-currently-playing': Um zu sehen, was gerade läuft
    // 'user-read-recently-played': Um den Verlauf zu sehen
    // 'user-top-read': (Optional) Um deine Top Songs zu sehen
    const scope = 'user-read-private user-read-email user-read-currently-playing user-read-recently-played user-top-read';

    const authQueryParameters = querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
    });
    res.redirect(`https://accounts.spotify.com/authorize?${authQueryParameters}`);
});

// --- 2. CALLBACK ROUTE (Token Tausch) ---
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;

    if (!code) {
        return res.redirect(`${FRONTEND_URI}/?error=missing_code`);
    }
    try {
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            }
        });
        // Wir leiten zurück ans Frontend und geben die Tokens mit
        res.redirect(`${FRONTEND_URI}/?${querystring.stringify(tokenResponse.data)}`);
    } catch (error) {
        console.error('Fehler beim Token-Tausch:', error.response ? error.response.data : error.message);
        res.send('Fehler beim Login. Bitte Konsole prüfen.');
    }
});

// --- 3. REFRESH TOKEN ROUTE (Neu & Wichtig!) ---
// Access Tokens halten nur 1 Stunde. Diese Route gibt dir ein neues,
// ohne dass sich der User neu einloggen muss.
app.get('/refresh_token', async (req, res) => {
    const { refresh_token } = req.query;

    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: querystring.stringify({
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            }
        });

        res.send(response.data);
    } catch (error) {
        res.status(400).send(error.response ? error.response.data : 'Error refreshing token');
    }
});


// --- 4. API PROXY ROUTEN (Neu!) ---
// Diese Routen kannst du vom Frontend aufrufen. 
// Das Frontend muss das Access Token im Header mitschicken.

// A. Currently Playing
app.get('/api/now-playing', async (req, res) => {
    // Token aus dem Header holen (Authorization: Bearer xyz...)
    const accessToken = req.headers.authorization; 

    try {
        const response = await axios.get('https://community.spotify.com/t5/Spotify-for-Developers/INVALID-CLIENT-Insecure-redirect-URI-using-custom-URI/td-p/6919036', {
            headers: { Authorization: accessToken }
        });
        
        // Wenn nichts läuft, sendet Spotify 204 (No Content)
        if (response.status === 204 || response.status > 400) {
            return res.status(200).json({ is_playing: false });
        }
        
        res.json(response.data);
    } catch (error) {
        console.error('Fehler bei Now Playing:', error.message);
        res.status(500).json({ error: 'Konnte Daten nicht laden' });
    }
});

// B. Streaming History (Recently Played)
app.get('/api/history', async (req, res) => {
    const accessToken = req.headers.authorization;

    try {
        // limit=10 holt nur die letzten 10 Songs
        const response = await axios.get('https://community.spotify.com/t5/Spotify-for-Developers/INVALID-CLIENT-Invalid-redirect-URI/td-p/5228936', {
            headers: { Authorization: accessToken }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Fehler bei History:', error.message);
        res.status(500).json({ error: 'Konnte History nicht laden' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend läuft auf http://localhost:${PORT}`);
});