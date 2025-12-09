import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import AuthModal from './AuthModal';
import './index.css';

const PlannerPage = ({ wishlists, selectedFolder, setSelectedFolder, savedAttractions }) => {
  const navigate = useNavigate();
  // Authentication state
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [days, setDays] = useState([
    { id: 1, morning: [null], afternoon: [null], evening: [null] },
    { id: 2, morning: [null], afternoon: [null], evening: [null] },
    { id: 3, morning: [null], afternoon: [null], evening: [null] }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  // Editable trip title state
  const [tripTitle, setTripTitle] = useState('');
  const [isTitleEdited, setIsTitleEdited] = useState(false);

  // Share modal state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [peopleWithAccess, setPeopleWithAccess] = useState([
    { email: 'arielx@tripweaver.com', role: 'owner' },
    { email: 'cynthiaj@tripweaver.com', role: 'owner' },
    { email: 'bh62@tripweaver.com', role: 'editor' }
  ]);

  // Get destination name from folder
  const getDestinationFromFolder = () => {
    if (!selectedFolder) return 'Your Trip';
    
    // Extract destination from folder name (e.g., "LA" → "Los Angeles", "Paris Trip" → "Paris")
    const folderLower = selectedFolder.toLowerCase();
    if (folderLower.includes('la') || folderLower.includes('los angeles')) {
      return 'Los Angeles, CA';
    } else if (folderLower.includes('paris')) {
      return 'Paris, France';
    } else if (folderLower.includes('nyc') || folderLower.includes('new york')) {
      return 'New York, NY';
    } else if (folderLower.includes('tokyo')) {
      return 'Tokyo, Japan';
    } else if (folderLower.includes('london')) {
      return 'London, UK';
    }
    return selectedFolder;
  };

  // Note: title is intentionally left empty so users see a placeholder prompt

  // Handle drag start
  const handleDragStart = (e, attraction) => {
    setDraggedItem(attraction);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // Handle drop
  const handleDrop = (e, dayId, timeSlot, slotIndex) => {
    e.preventDefault();
    if (draggedItem) {
      setDays(prev => prev.map(day => 
        day.id === dayId 
          ? { 
              ...day, 
              [timeSlot]: day[timeSlot].map((item, idx) => 
                idx === slotIndex ? draggedItem : item
              )
            }
          : day
      ));
    }
    setDraggedItem(null);
  };

  // Remove item from schedule
  const removeFromSchedule = (dayId, timeSlot, slotIndex) => {
    setDays(prev => prev.map(day =>
      day.id === dayId
        ? { 
            ...day, 
            [timeSlot]: day[timeSlot].filter((_, idx) => idx !== slotIndex)
          }
        : day
    ));
  };

  // Add a new slot for a time period
  const addSlot = (dayId, timeSlot) => {
    setDays(prev => prev.map(day =>
      day.id === dayId
        ? { ...day, [timeSlot]: [...day[timeSlot], null] }
        : day
    ));
  };

  // Add a new day
  const addDay = () => {
    const newDayId = days.length > 0 ? Math.max(...days.map(d => d.id)) + 1 : 1;
    setDays([...days, { id: newDayId, morning: [null], afternoon: [null], evening: [null] }]);
  };

  // Remove a day
  const removeDay = (dayId) => {
    if (days.length > 1) {
      setDays(prev => prev.filter(day => day.id !== dayId));
    }
  };

  // Share modal functions
  const openShareModal = () => {
    setIsShareOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeShareModal = () => {
    setIsShareOpen(false);
    document.body.style.overflow = '';
    setInviteEmail('');
    setInviteRole('editor');
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addInvite = () => {
    const email = inviteEmail.trim();
    if (!isValidEmail(email)) return;
    
    const exists = peopleWithAccess.some(p => p.email.toLowerCase() === email.toLowerCase());
    if (exists) return;

    setPeopleWithAccess([...peopleWithAccess, { email, role: inviteRole }]);
    setInviteEmail('');
    setInviteRole('editor');
  };

  const removePerson = (emailToRemove) => {
    setPeopleWithAccess(peopleWithAccess.filter(p => p.email !== emailToRemove));
  };

  const updatePersonRole = (email, newRole) => {
    setPeopleWithAccess(peopleWithAccess.map(p => 
      p.email === email ? { ...p, role: newRole } : p
    ));
  };

  // Authentication functions
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isShareOpen) {
        closeShareModal();
      }
      if (e.key === 'Escape' && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
      if (e.key === 'Enter' && isShareOpen && document.activeElement.classList.contains('share-input')) {
        addInvite();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isShareOpen, isAuthModalOpen, inviteEmail, inviteRole]);

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
              <li><Link to="/" className="active">Planner</Link></li>
              <li><Link to="/attractions">Attractions</Link></li>
              <li><Link to="/saved">Saved</Link></li>
            </ul>
          </nav>
          {user ? (
            <div className="user-menu">
              <span className="user-name">Hello, {user.displayName || user.email}</span>
              <button className="signin-button" onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <button className="signin-button" onClick={() => setIsAuthModalOpen(true)}>Sign In</button>
          )}
        </div>
      </header>

      <div className="main-layout">
        <section className="planner-content">
          <div className="planner-header">
            <div className="planner-title-wrapper">
              <input
                aria-label="Trip title"
                className="planner-title-input"
                value={tripTitle}
                placeholder="Type your trip title"
                onChange={(e) => { setTripTitle(e.target.value); setIsTitleEdited(true); }}
              />
            </div>
            <div className="planner-buttons">
              <button className="add-day-btn" onClick={addDay}>+ Add Day</button>
              <button className="share-btn" onClick={openShareModal}>Share</button>
              <button 
                className="heart-btn"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                {isFavorited ? '♥' : '♡'}
              </button>
            </div>
          </div>

          <div className="table-container">
            <div className="scrollable-table">
              <table className="itinerary-table">
                <thead>
                  <tr>
                    <th className="time-column">Time</th>
                    {days.map((day, index) => (
                      <th key={day.id}>
                        <div className="day-header">
                          <span>Day {index + 1}</span>
                          {index > 0 && (
                            <button 
                              className="remove-day-btn" 
                              onClick={() => removeDay(day.id)}
                              title="Remove this day"
                            >
                              −
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['morning', 'afternoon', 'evening'].map(timeSlot => (
                    <tr key={timeSlot}>
                      <td className="time-label">{timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}</td>
                      {days.map(day => (
                        <td key={`${day.id}-${timeSlot}`}>
                          <div className="time-slot-container">
                            {day[timeSlot].map((attraction, slotIndex) => (
                              <div
                                key={`${day.id}-${timeSlot}-${slotIndex}`}
                                className="drop-zone"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, day.id, timeSlot, slotIndex)}
                              >
                                {attraction ? (
                                  <div className="scheduled-item">
                                    <div className="scheduled-item-content">
                                      <strong>{attraction.name}</strong>
                                      <span className="duration">{attraction.hours || 'Duration varies'}</span>
                                    </div>
                                    <button
                                      className="remove-btn"
                                      onClick={() => removeFromSchedule(day.id, timeSlot, slotIndex)}
                                      title="Remove"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ) : (
                                  <div className="empty-slot">Drop attraction here</div>
                                )}
                              </div>
                            ))}
                            <button 
                              className="add-slot-btn" 
                              onClick={() => addSlot(day.id, timeSlot)}
                              title="Add another attraction slot"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <aside className="saved-attractions">
          <h2>Saved Attractions</h2>
          
          {/* Folder Selector */}
          {user && wishlists.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="folder-select" style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#2C3532'
              }}>
                Select Folder:
              </label>
              <select 
                id="folder-select"
                value={selectedFolder || ''}
                onChange={(e) => setSelectedFolder(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '2px solid #B8D4D0',
                  background: 'white',
                  fontSize: '15px',
                  fontFamily: 'Poppins, sans-serif',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {wishlists.map((folder, index) => (
                  <option key={index} value={folder.name}>
                    {folder.name} ({folder.count} attractions)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Attractions from Selected Folder */}
          {!user ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#666', marginBottom: '15px' }}>Sign in to see your saved attractions!</p>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  padding: '10px 20px',
                  background: '#0F6466',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Sign In
              </button>
            </div>
          ) : savedAttractions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ color: '#666', marginBottom: '15px' }}>
                {wishlists.length === 0 
                  ? 'No saved attractions yet.' 
                  : `No attractions in "${selectedFolder}" folder.`}
              </p>
              <Link 
                to="/attractions"
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: '#0F6466',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textAlign: 'center',
                  textDecoration: 'none'
                }}
              >
                Browse Attractions
              </Link>
            </div>
          ) : (
            <div className="attractions-container">
              {savedAttractions.map((attraction, index) => (
                <div
                  key={`${attraction.id}-${index}`}
                  className="attraction-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, attraction)}
                >
                  <h3>{attraction.name}</h3>
                  <p className="hours">{attraction.hours}</p>
                  <p className="duration-info">Category: {attraction.category}</p>
                  <div className="drag-hint">🖐️ Drag to schedule</div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* Share Modal */}
      {isShareOpen && (
        <div 
          className="share-overlay" 
          aria-hidden="false" 
          role="dialog"
          onClick={(e) => {
            if (e.target.classList.contains('share-overlay')) {
              closeShareModal();
            }
          }}
        >
          <div className="share-panel" role="document" aria-label="Share Trip Plan">
            <div className="share-head">
              <div className="share-title">Share "Trip Plan"</div>
              <button 
                className="share-close" 
                onClick={closeShareModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="share-section">
              <div className="share-input-row">
                <input 
                  type="email" 
                  className="share-input" 
                  placeholder="Add people by email..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') addInvite();
                  }}
                />
                <select 
                  className="share-select"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button className="share-add" onClick={addInvite}>Add</button>
              </div>
            </div>

            <div className="share-section">
              <div className="share-subtitle">People with access</div>
              <ul className="share-list">
                {peopleWithAccess.map((person, idx) => (
                  <li key={idx} className="share-item">
                    <div className="share-item-left">
                      <div className="share-item-email">{person.email}</div>
                      <div className="share-item-role-small">{person.role}</div>
                    </div>
                    <div className="share-item-right">
                      {person.role === 'owner' ? (
                        <button className="share-select-disabled" disabled>
                          Editor
                        </button>
                      ) : (
                        <>
                          <select 
                            className="share-select"
                            value={person.role}
                            onChange={(e) => updatePersonRole(person.email, e.target.value)}
                          >
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <button 
                            className="share-remove"
                            onClick={() => removePerson(person.email)}
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="share-foot">
              <button className="share-done" onClick={closeShareModal}>Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => console.log('Authentication successful')}
      />

      <footer className="site-footer">
        <p>&copy; 2025 Ariel Xia, Cynthia Jin, Aaron Huang. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PlannerPage;