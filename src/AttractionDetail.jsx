import React, { useState, useEffect } from 'react';
import './index.css';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  saveAttractionToWishlist,
  createWishlistFolder,
  getUserFolderNames
} from './AttractionFirebaseService';

export default function AttractionDetail({ setCurrentPage, attraction, refreshWishlists }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('new');
  const [newFolderName, setNewFolderName] = useState('');
  const [user, setUser] = useState(null);
  const [folderNames, setFolderNames] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load current user + their folder names
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const names = await getUserFolderNames(currentUser.uid);
          if (names && names.length > 0) {
            setFolderNames(names);
            setSelectedFolder(names[0]);
          } else {
            setFolderNames([]);
            setSelectedFolder('new');
          }
        } catch (error) {
          console.error('Error loading folder names:', error);
          setFolderNames([]);
        }
      } else {
        setFolderNames([]);
        setSelectedFolder('new');
      }
    });

    return () => unsubscribe();
  }, []);

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
    if (!user) {
      alert('Please sign in on the Planner page before saving attractions.');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    setShowFolderModal(true);
  };

  const handleFinalSave = async () => {
    if (!user) {
      alert('Please sign in before saving attractions.');
      return;
    }

    let folderName = selectedFolder;

    if (folderName === 'new') {
      folderName = newFolderName.trim();
    }

    if (!folderName) {
      alert('Please choose a folder or type a folder name.');
      return;
    }

    try {
      setIsSaving(true);

      // Create folder document if it does not exist yet
      if (!folderNames.includes(folderName)) {
        await createWishlistFolder(user.uid, folderName);
      }

      // Save this attraction into that folder
      await saveAttractionToWishlist(user.uid, folderName, attraction);

      // Let App reload wishlists → Saved page + Planner update
      if (typeof refreshWishlists === 'function') {
        refreshWishlists();
      }

      closeAllModals();
      setNewFolderName('');
      alert('Added to wishlist!');
    } catch (error) {
      console.error('Error saving attraction:', error);
      alert('Sorry, something went wrong while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
              {/* Existing folders */}
              {folderNames.map((name) => (
                <div className="detail-radio" key={name}>
                  <input
                    type="radio"
                    id={`detail-folder-${name}`}
                    name="folder"
                    checked={selectedFolder === name}
                    onChange={() => setSelectedFolder(name)}
                  />
                  <label htmlFor={`detail-folder-${name}`}>{name}</label>
                </div>
              ))}

              {/* New folder */}
              <div className="detail-radio">
                <input
                  type="radio"
                  id="detail-folder-new"
                  name="folder"
                  checked={selectedFolder === 'new'}
                  onChange={() => setSelectedFolder('new')}
                />
                <label htmlFor="detail-folder-new">Create new folder</label>
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
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving…' : 'Save'}
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
