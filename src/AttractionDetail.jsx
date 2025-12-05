import React, { useState, useEffect } from 'react';
import './index.css';

export default function AttractionDetail({ setCurrentPage, attraction }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('la');
  const [newFolderName, setNewFolderName] = useState('');

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeAllModals = () => {
    setShowConfirmModal(false);
    setShowFolderModal(false);
  };

  const handleWishClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    setShowFolderModal(true);
  };

  const handleFinalSave = () => {
    // Here you would actually save to localStorage or state
    console.log('Saving to folder:', selectedFolder === 'new' ? newFolderName : selectedFolder);
    closeAllModals();
    // Optional: show a success message
    alert('Added to wishlist!');
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getGoogleMapsUrl = () => {
    const { lat, lng } = attraction.coordinates;
    const name = encodeURIComponent(attraction.name);
    return `https://www.google.com/maps/search/?api=1&query=${name}%20${lat},${lng}`;
  };

  if (!attraction) {
    return (
      <div className="app-container">
        <header>
          <div className="header-content">
            <div className="header-left">
              <img src="/img/webpage-brand-logo.png" alt="Tripweaver Icon" className="icon" />
              <h1>TripWeaver</h1>
            </div>
            <nav>
              <ul>
                <li><a href="#" onClick={e => { e.preventDefault(); setCurrentPage('planner'); }}>Planner</a></li>
                <li><a aria-current="page" href="#" onClick={e => { e.preventDefault(); setCurrentPage('attractions'); }}>Attractions</a></li>
                <li><a href="#" onClick={e => { e.preventDefault(); setCurrentPage('saved'); }}>Saved</a></li>
              </ul>
            </nav>
            <button className="profile-button" type="button" aria-label="Profile">
              <img src="img/profile.png" alt="profile button" />
            </button>
          </div>
        </header>
        <main className="wrap-narrow">
          <p style={{ textAlign: 'center', padding: '40px' }}>
            No attraction selected. <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('attractions'); }}>Browse attractions</a>
          </p>
        </main>
        <footer className="site-footer">
          <p>&copy; 2025 Ariel Xia, Cynthia Jin, Aaron Huang. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <div className="header-content">
          <div className="header-left">
            <img src="/img/webpage-brand-logo.png" alt="Tripweaver Icon" className="icon" />
            <h1>TripWeaver</h1>
          </div>
          <nav>
            <ul>
              <li><a href="#" onClick={e => { e.preventDefault(); setCurrentPage('planner'); }}>Planner</a></li>
              <li><a aria-current="page" href="#" onClick={e => { e.preventDefault(); setCurrentPage('attractions'); }}>Attractions</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); setCurrentPage('saved'); }}>Saved</a></li>
            </ul>
          </nav>
          <button className="profile-button" type="button" aria-label="Profile">
            <img src="img/profile.png" alt="profile button" />
          </button>
        </div>
      </header>

      <main className="wrap-narrow">
        <section className="detail">
          <h1 className="detail-title">{attraction.name}</h1>
          <p className="detail-sub">
            {attraction.category} · {attraction.location} · {renderStars(attraction.rating)}
          </p>

          {/* Photo */}
          <figure className="detail-photo">
            <img src={attraction.image} alt={attraction.name} />
          </figure>

          {/* Description */}
          <div className="detail-body">
            <p className="detail-desc">{attraction.description}</p>
            <p className="detail-links">
              <a 
                target="_blank" 
                rel="noopener noreferrer"
                href={getGoogleMapsUrl()}
              >
                Open in Google Maps
              </a>
            </p>
            <button 
              className="detail-chip-heart" 
              type="button" 
              aria-haspopup="dialog"
              onClick={handleWishClick}
            >
              ♡ wish
            </button>
          </div>

          {/* Features */}
          <ul className="detail-features">
            {attraction.features.map((feature, index) => (
              <li key={index} className="detail-feature">{feature}</li>
            ))}
          </ul>

          {/* Hours */}
          <div className="detail-body">
            <p><strong>Hours:</strong> {attraction.hours}</p>
            <p><strong>Price:</strong> {attraction.price}</p>
          </div>

          {/* Back button */}
          <button 
            onClick={() => setCurrentPage('attractions')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#0F6466',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ← Back to Search
          </button>
        </section>
      </main>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div 
          className="detail-overlay" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="confirm-title"
          onClick={(e) => {
            if (e.target.classList.contains('detail-overlay')) {
              closeAllModals();
            }
          }}
        >
          <div className="detail-modal">
            <h2 id="detail-confirm-title">Save to wishlist?</h2>
            <div className="detail-modal-actions">
              <button 
                className="detail-btn-outline" 
                type="button"
                onClick={closeAllModals}
              >
                Cancel
              </button>
              <button 
                className="detail-btn-solid" 
                type="button"
                onClick={handleConfirmSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folder Selection Modal */}
      {showFolderModal && (
        <div 
          className="detail-overlay" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="wl-title"
          onClick={(e) => {
            if (e.target.classList.contains('detail-overlay')) {
              closeAllModals();
            }
          }}
        >
          <div className="detail-modal">
            <h2 id="detail-wl-title">Save to wishlist</h2>
            <div className="detail-modal-form">
              <div className="detail-radio">
                <input
                  type="radio"
                  id="detail-folder-la"
                  name="folder"
                  checked={selectedFolder === 'la'}
                  onChange={() => setSelectedFolder('la')}
                />
                <label htmlFor="detail-folder-la">LA</label>
              </div>

              <div className="detail-radio">
                <input
                  type="radio"
                  id="detail-folder-new"
                  name="folder"
                  checked={selectedFolder === 'new'}
                  onChange={() => setSelectedFolder('new')}
                />
                <label htmlFor="detail-folder-new">New folder</label>
              </div>

              {selectedFolder === 'new' && (
                <input 
                  className="detail-input" 
                  type="text" 
                  placeholder="Type a folder name…"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              )}

              <div className="detail-modal-actions">
                <button 
                  className="detail-btn-outline" 
                  type="button"
                  onClick={closeAllModals}
                >
                  Cancel
                </button>
                <button 
                  className="detail-btn-solid" 
                  type="button"
                  onClick={handleFinalSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <p>&copy; 2025 Ariel Xia, Cynthia Jin, Aaron Huang. All rights reserved.</p>
      </footer>
    </div>
  );
}