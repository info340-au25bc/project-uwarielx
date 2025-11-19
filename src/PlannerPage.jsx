import React, { useState, useEffect } from 'react';
import './index.css';

const PlannerPage = ({ setCurrentPage }) => {
  // Sample attractions data
  const [savedAttractions] = useState([
    {
      id: 1,
      name: 'Louvre Museum',
      hours: 'Opens Sunday, Monday, Thursday, Saturday 9:00-18:00 and Wednesday, Friday 9:00-21:00',
      duration: '3-4 hours'
    },
    {
      id: 2,
      name: 'Eiffel Tower',
      hours: 'Opens 9:30-23:00 everyday',
      duration: '2-3 hours'
    },
    {
      id: 3,
      name: 'Musée d\'Orsay',
      hours: 'Opens Sunday, Tuesday, Wednesday, Friday, Saturday 9:30-18:00 and Thursday 9:30-21:45',
      duration: '2-3 hours'
    },
    {
      id: 4,
      name: 'Arc de Triomphe',
      hours: 'Opens 10:00-23:00 daily',
      duration: '1-2 hours'
    },
    {
      id: 5,
      name: 'Notre-Dame Cathedral',
      hours: 'Currently under renovation',
      duration: '1 hour'
    }
  ]);

  const [schedule, setSchedule] = useState({
    day1: { morning: null, afternoon: null, evening: null },
    day2: { morning: null, afternoon: null, evening: null },
    day3: { morning: null, afternoon: null, evening: null }
  });

  const [draggedItem, setDraggedItem] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Share modal state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [peopleWithAccess, setPeopleWithAccess] = useState([
    { email: 'arielx@tripweaver.com', role: 'owner' },
    { email: 'cynthiaj@tripweaver.com', role: 'owner' },
    { email: 'bh62@tripweaver.com', role: 'editor' }
  ]);

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
  const handleDrop = (e, day, timeSlot) => {
    e.preventDefault();
    if (draggedItem) {
      setSchedule(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [timeSlot]: draggedItem
        }
      }));
    }
    setDraggedItem(null);
  };

  // Remove item from schedule
  const removeFromSchedule = (day, timeSlot) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeSlot]: null
      }
    }));
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

  // Handle keyboard shortcuts for share modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isShareOpen) {
        closeShareModal();
      }
      if (e.key === 'Enter' && isShareOpen && document.activeElement.classList.contains('share-input')) {
        addInvite();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isShareOpen, inviteEmail, inviteRole]);

  return (
    <div className="app-container">
      <header>
        <div className="header-content">
          <div className="header-left">
            <img src="project-draft/img/webpage-brand-logo.png" alt="Tripweaver Icon" className="icon" />
            <h1>TripWeaver</h1>
          </div>
          <nav>
            <ul>
              <li><a href="#" className="active">Planner</a></li>
              <li><a href="#">Attractions</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('saved'); }}>Saved</a></li>
            </ul>
          </nav>
          <button className="signin-button">Sign In</button>
        </div>
      </header>

      <div className="main-layout">
        <section className="planner-content">
          <div className="planner-header">
            <h2 className="planner-title">Travel to Paris, France</h2>
            <div className="planner-buttons">
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
                    <th>Day 1</th>
                    <th>Day 2</th>
                    <th>Day 3</th>
                  </tr>
                </thead>
                <tbody>
                  {['morning', 'afternoon', 'evening'].map(timeSlot => (
                    <tr key={timeSlot}>
                      <td className="time-label">{timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}</td>
                      {['day1', 'day2', 'day3'].map(day => (
                        <td
                          key={`${day}-${timeSlot}`}
                          className="drop-zone"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, day, timeSlot)}
                        >
                          {schedule[day][timeSlot] ? (
                            <div className="scheduled-item">
                              <div className="scheduled-item-content">
                                <strong>{schedule[day][timeSlot].name}</strong>
                                <span className="duration">{schedule[day][timeSlot].duration}</span>
                              </div>
                              <button
                                className="remove-btn"
                                onClick={() => removeFromSchedule(day, timeSlot)}
                                title="Remove"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="empty-slot">Drop attraction here</div>
                          )}
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
          <div className="attractions-container">
            {savedAttractions.map(attraction => (
              <div
                key={attraction.id}
                className="attraction-card"
                draggable
                onDragStart={(e) => handleDragStart(e, attraction)}
              >
                <h3>{attraction.name}</h3>
                <p className="hours">{attraction.hours}</p>
                <p className="duration-info">Duration: {attraction.duration}</p>
                <div className="drag-hint">🖐️ Drag to schedule</div>
              </div>
            ))}
          </div>
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

      <footer className="site-footer">
        <p>&copy; 2025 Ariel Xia, Cynthia Jin, Aaron Huang. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PlannerPage;