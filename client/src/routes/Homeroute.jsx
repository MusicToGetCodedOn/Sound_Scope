import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Homeroute.css';
import { useOutletContext } from 'react-router-dom'; // Schreibfehler korrigiert

function Homeroute() {
  // 1. Wir holen den Token direkt aus dem Context von App.js
  const { token } = useOutletContext();

  const [currentTrack, setCurrentTrack] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Sobald der Token da ist (oder sich ändert), laden wir die Daten
  useEffect(() => {
    if (token) {
      loadMusic();
    }
  }, [token]);

  const loadMusic = async () => {
    setLoading(true);
    setError(null);
    try {
      // A. Currently Playing
      const currentResponse = await axios.get('http://localhost:8888/api/now-playing', {
        headers: { Authorization: `Bearer ${token}` } // Token mit Bearer Prefix
      });
      
      // Das Backend gibt 204 oder leeres Objekt zurück, wenn nichts läuft
      if (currentResponse.data && currentResponse.data.item) {
        setCurrentTrack(currentResponse.data.item);
      } else {
        setCurrentTrack(null);
      }

      // B. History
      const recentResponse = await axios.get('http://localhost:8888/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (recentResponse.data && recentResponse.data.items) {
        setRecentTracks(recentResponse.data.items);
      }

    } catch (err) {
      console.error('Fehler beim Laden der Musik:', err);
      setError('Konnte Daten nicht vom Backend laden.');
    } finally {
      setLoading(false);
    }
  };
  // 1. Wenn KEIN Token da ist -> Zeige Login Screen
  if (!token) {
    return (
      <div className="home-container">
        <div className="home-hero">
          <h1 className="home-title"> SoundScope Music Tracker</h1>
          <p className="home-subtitle">Deine Spotify-Musik-Statistiken auf einen Blick</p>
        </div>
        
        <div className="home-content">
          <div className="login-card">
            <h2>Willkommen!</h2>
            <p className="login-text">
              Verbinde dich mit Spotify, um deine Musik-Statistiken zu sehen und zu analysieren.
            </p>
            
            <div className="login-features">
              <div className="feature">
                <span className="feature-icon"></span>
                <span>Was du gerade hörst</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⏮</span>
                <span>Zuletzt gehörte Tracks</span>
              </div>
            </div>
            
            {/* Link zum Backend Login */}
            <a href="http://127.0.0.1:8888/login" className="btn-spotify">
              Mit Spotify verbinden
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. Wenn Token da ist -> Zeige Dashboard
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">SoundScope Dashboard</h1>
        <p className="home-subtitle">Willkommen zurück!</p>
      </div>

      <div className="home-content">
        {loading && !currentTrack && !recentTracks.length && (
          <div className="loading-message">Lade Musikdaten...</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {/* --- NOW PLAYING --- */}
        <div className="now-playing-section">
          <h2>Currently Playing</h2>
          {currentTrack ? (
            <div className="now-playing-card">
              {currentTrack.album?.images?.[0] && (
                <img
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.name}
                  className="now-playing-cover"
                />
              )}
              <div className="now-playing-info">
                <h3 className="track-name">{currentTrack.name}</h3>
                <p className="track-artist">
                  {currentTrack.artists.map(a => a.name).join(', ')}
                </p>
                <p className="track-album">{currentTrack.album.name}</p>
              </div>
            </div>
          ) : (
            <div className="no-track-message">
              <p>Momentan läuft keine Musik auf Spotify.</p>
            </div>
          )}
        </div>

        {/* --- RECENTLY PLAYED --- */}
        {recentTracks.length > 0 && (
          <div className="recent-tracks-section">
            <h2>Recently Played</h2>
            <div className="recent-tracks-grid">
              {recentTracks.map((item, index) => (
                <div key={index} className="recent-track-card">
                  {item.track.album?.images?.[0] && (
                    <img
                      src={item.track.album.images[0].url}
                      alt={item.track.name}
                      className="recent-track-cover"
                    />
                  )}
                  <div className="recent-track-info">
                    <h4>{item.track.name}</h4>
                    <p className="recent-track-artist">
                      {item.track.artists.map(a => a.name).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="home-actions">
            <button onClick={loadMusic} className="btn-refresh">
              Aktualisieren
            </button>
        </div>
      </div>
    </div>
  );
}

export default Homeroute;