import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Homeroute.css';

function Homeroute(){
  const [token, setToken] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Token aus localStorage holen
    const storedToken = localStorage.getItem('spotify_token');
    if (storedToken) {
      setToken(storedToken);
      loadMusic(storedToken);
    }

    // Token aus URL holen (nach Login redirect)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const accessToken = urlParams.get('access_token');

    if (accessToken) {
      // Token speichern
      localStorage.setItem('spotify_token', accessToken);
      setToken(accessToken);
      loadMusic(accessToken);
      // Entfernt das Token aus der Browser-URL Leiste (sieht sauberer aus)
      window.history.pushState({}, null, '/');
    }
  }, []);

  const loadMusic = async (spotifyToken) => {
    setLoading(true);
    setError(null);
    try {
      // Aktuell spielender Track
      const currentResponse = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          headers: { Authorization: `Bearer ${spotifyToken}` }
        }
      );

      if (currentResponse.data && currentResponse.data.item) {
        setCurrentTrack(currentResponse.data.item);
      }

      // Letzte Tracks
      const recentResponse = await axios.get(
        'https://api.spotify.com/v1/me/player/recently-played?limit=6',
        {
          headers: { Authorization: `Bearer ${spotifyToken}` }
        }
      );

      if (recentResponse.data && recentResponse.data.items) {
        setRecentTracks(recentResponse.data.items);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Musik:', err);
      setError('Fehler beim Laden der Musikdaten');
    } finally {
      setLoading(false);
    }
  };

  const refreshMusic = () => {
    const storedToken = localStorage.getItem('spotify_token');
    if (storedToken) {
      loadMusic(storedToken);
    }
  };

  if (token) {
    return (
      <div className="home-container">
        <div className="home-hero">
          <h1 className="home-title">SoundScope</h1>
          <p className="home-subtitle">Currently Playing</p>
        </div>

        <div className="home-content">
          {loading && !currentTrack && !recentTracks.length && (
            <div className="loading-message">Lade Musikdaten...</div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}

          {/* AKTUELL SPIELENDER TRACK */}
          {currentTrack && (
            <div className="now-playing-section">
              <h2>Currently Playing</h2>
              <div className="now-playing-card">
                {currentTrack.album && currentTrack.album.images && currentTrack.album.images[0] && (
                  <img
                    src={currentTrack.album.images[0].url}
                    alt={currentTrack.name}
                    className="now-playing-cover"
                  />
                )}
                <div className="now-playing-info">
                  <h3 className="track-name">{currentTrack.name}</h3>
                  <p className="track-artist">
                    {currentTrack.artists.map(artist => artist.name).join(', ')}
                  </p>
                  {currentTrack.album && (
                    <p className="track-album">{currentTrack.album.name}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {!currentTrack && !loading && (
            <div className="no-track-message">
              <p>Nothing is playing right now</p>
            </div>
          )}

          {/* LETZTE TRACKS */}
          {recentTracks.length > 0 && (
            <div className="recent-tracks-section">
              <h2> Recently Played</h2>
              <div className="recent-tracks-grid">
                {recentTracks.map((item, index) => (
                  <div key={index} className="recent-track-card">
                    {item.track && item.track.album && item.track.album.images && item.track.album.images[0] && (
                      <img
                        src={item.track.album.images[0].url}
                        alt={item.track.name}
                        className="recent-track-cover"
                      />
                    )}
                    <div className="recent-track-info">
                      <h4>{item.track.name}</h4>
                      <p className="recent-track-artist">
                        {item.track.artists.map(artist => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="home-actions">
            <button onClick={refreshMusic} className="btn-refresh">
            Refresh
            </button>
            <a href="/profile" className="btn-spotify">
              Zum Profil
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">🎵 SoundScope Music Tracker</h1>
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
              <span className="feature-icon">📊</span>
              <span>Was du gerade hörst</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⏮️</span>
              <span>Zuletzt gehörte Tracks</span>
            </div>
            <div className="feature">
              <span className="feature-icon">👤</span>
              <span>Dein Profil</span>
            </div>
          </div>
          
          <a href="http://127.0.0.1:8888/login" className="btn-spotify">
            Mit Spotify verbinden
          </a>
        </div>
      </div>
    </div>
  );
}

export default Homeroute;