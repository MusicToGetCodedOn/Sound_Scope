import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profileroute.css';

function Profileroute(){
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Token aus localStorage holen
    const storedToken = localStorage.getItem('spotify_token');
    
    if (!storedToken) {
      setError('Bitte logge dich erst ein');
      setLoading(false);
      return;
    }

    setToken(storedToken);

    // Profil-Daten laden
    axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
    .then(response => {
      setUserData(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error("Fehler beim Laden:", error);
      setError('Fehler beim Laden der Profildaten');
      setLoading(false);
    });
  }, []);

  if (!token) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>⚠️ Nicht eingeloggt</h2>
          <p>Bitte gehe zur Startseite und logge dich mit Spotify ein.</p>
          <a href="/" className="btn-back">Zur Startseite</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <p>Lade dein Profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>❌ Fehler</h2>
          <p>{error}</p>
          <a href="/" className="btn-back">Zur Startseite</a>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    window.location.href = '/';
  };

  return (
    <div className="profile-container">
      {userData && (
        <>
          <div className="profile-card">
            <div className="profile-header">
              {userData.images && userData.images[0] && (
                <img 
                  src={userData.images[0].url} 
                  alt="Profilbild" 
                  className="profile-img"
                />
              )}
              <div className="profile-info">
                <h1>Hallo, {userData.display_name}! 👋</h1>
                <p className="profile-email">{userData.email}</p>
              </div>
            </div>
            
            <div className="stats">
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span className="stat-value">{userData.followers.total.toLocaleString()}</span>
                <span className="stat-label">Follower</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🌍</span>
                <span className="stat-value">{userData.country || 'N/A'}</span>
                <span className="stat-label">Land</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-value">{userData.product}</span>
                <span className="stat-label">Plan</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🔗</span>
                <span className="stat-value">{userData.followers.total > 0 ? 'Öffentlich' : 'Privat'}</span>
                <span className="stat-label">Sichtbarkeit</span>
              </div>
            </div>

            <div className="profile-footer">
              <button 
                onClick={handleLogout}
                className="btn-logout"
              >
                Abmelden
              </button>
              <a href="/" className="btn-home">
                Zur Startseite
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Profileroute;