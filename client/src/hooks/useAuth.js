import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useAuth() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  useEffect(() => {
    // 1. Initialer Login: Code aus URL lesen oder Tokens aus LocalStorage laden
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const urlAccessToken = urlParams.get('access_token');
    const urlRefreshToken = urlParams.get('refresh_token');
    const urlExpiresIn = urlParams.get('expires_in');

    if (urlAccessToken && urlRefreshToken && urlExpiresIn) {
      // Fall A: Komme frisch vom Login (Daten in URL)
      setAccessToken(urlAccessToken);
      setRefreshToken(urlRefreshToken);
      setExpiresIn(parseInt(urlExpiresIn));

      // URL säubern
      window.history.pushState({}, null, '/');
    } 
  }, []);

  // 2. Automatischer Refresh Timer
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    // Wir wollen refreshen, kurz bevor der Token abläuft (z.B. 1 Minute vorher)
    // Spotify Tokens halten 3600s.
    const interval = setInterval(() => {
      console.log("Token wird erneuert...");
      
      axios.get(`${import.meta.env.VITE_API_URL}/refresh_token?refresh_token=${refreshToken}`)
        .then(res => {
          // Dein Backend sendet das neue Access Token zurück
          setAccessToken(res.data.access_token);
          // Falls Spotify auch die Expiration neu setzt (meistens wieder 3600)
          if(res.data.expires_in) setExpiresIn(res.data.expires_in);
        })
        .catch(err => {
          console.error("Refresh fehlgeschlagen", err);
          // Optional: User ausloggen bei Fehler
          // window.location = '/'; 
        });

    }, (expiresIn - 60) * 1000); // Trigger 60 Sekunden vor Ablauf

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}