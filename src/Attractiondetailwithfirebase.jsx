import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  saveAttractionToWishlist, 
  getUserFolderNames,
  createWishlistFolder,
  isAttractionSaved 
} from './attractionFirebaseService';
import './index.css';

export default function AttractionDetail({ setCurrentPage, attraction }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('la');
  const [newFolderName, setNewFolderName] = useState('');
  const [userFolders, setUserFolders] = useState(['LA']);
  const [user, setUser] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && attraction) {
        loadUserFolders(currentUser.uid);
        checkIfSaved(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [attraction]);

  // Load user's existing folders
  const loadUserFolders = async (userId) => {
    try {
      const folders = await getUserFolderNames(userId);
      if (folders.length > 0) {
        setUserFolders(folders);
        setSelectedFolder(folders[0].toLowerCase().replace(/\s+/g, '-'));
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  // Check if attraction is already saved
  const checkIfSaved = async (userId) => {
    if (attraction) {
      const saved = await isAttractionSaved(userId, attraction.id);
      setIsSaved(saved);
    }
  };

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
    setSuccessMessage('');
  };

  const handleWishClick = () => {
    if (!user) {
      alert('Please sign in to save attractions to your wishlist!');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    setShowFolderModal(true);
  };

  const handleFinalSave = async () => {
    if (!user || !attraction) return;

    setSaving(true);
    try {
      let folderToUse = selectedFolder;

      // If creating a new folder
      if (selectedFolder === 'new') {
        if (!newFolderName.trim()) {
          alert('Please enter a folder name');
          setSaving(false);
          return;
        }
        await createWishlistFolder(user.uid, newFolderName.trim());
        folderToUse = newFolderName.trim();
      } else {
        // Use existing folder name
        folderToUse = userFolders.find(f => 
          f.toLowerCase().replace(/\s+/g, '-') === selectedFolder
        ) || selectedFolder;
      }

      // Save attraction to wishlist
      await saveAttractionToWishlist(user.uid, folderToUse, attraction);
      
      setIsSaved(true);
      setSuccessMessage(`✓ Saved to "${folderToUse}"!`);
      
      // Close modal after short delay
      setTimeout(() => {
        closeAllModals();
      }, 1500);

    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save attraction. Please try again.');
    } finally {
      setSaving(false);
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
            <img 
              src={attraction.image} 
              alt={attraction.name}
              onError={(e) => {
                e.target.src = '/img/hollywood.png';
              }}
            />
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
              style={isSaved ? { 
                background: '#0F6466', 
                color: 'white',
                borderColor: '#0F6466'
              } : {}}
            >
              {isSaved ? '♥ Saved' : '♡ wish'}
            </button>
            {!user && (
              <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                Sign in to save to wishlist
              </p>
            )}
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
            
            {successMessage && (
              <div style={{
                padding: '12px',
                background: '#d4edda',
                color: '#155724',
                borderRadius: '8px',
                marginBottom: '15px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                {successMessage}
              </div>
            )}

            <div className="detail-modal-form">
              {/* Existing folders */}
              {userFolders.map((folder, index) => (
                <div key={index} className="detail-radio">
                  <input
                    type="radio"
                    id={`detail-folder-${index}`}
                    name="folder"
                    checked={selectedFolder === folder.toLowerCase().replace(/\s+/g, '-')}
                    onChange={() => setSelectedFolder(folder.toLowerCase().replace(/\s+/g, '-'))}
                  />
                  <label htmlFor={`detail-folder-${index}`}>{folder}</label>
                </div>
              ))}

              {/* New folder option */}
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
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  className="detail-btn-solid" 
                  type="button"
                  onClick={handleFinalSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
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