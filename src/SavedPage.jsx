import { useState, useEffect } from "react";
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { deleteFolder } from './AttractionFirebaseService';
import "./index.css";

export default function SavedPage({
  setCurrentPage,
  setSelectedAttraction,
  wishlists,
  refreshWishlists,
  setSelectedFolder        // 👈 new prop
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('folders'); // 'folders' or 'attractions'
  const [currentFolder, setCurrentFolder] = useState(null);

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  function handleEdit() {
    if (isEditing) {
      setSelected([]);
    }
    setIsEditing(!isEditing);
  }

  function toggleSelect(id) {
    let copy = [...selected];
    if (copy.includes(id)) {
      copy = copy.filter((x) => x !== id);
    } else {
      copy.push(id);
    }
    setSelected(copy);
  }

  async function handleDelete() {
    if (!user) return;

    const confirmDelete = window.confirm(
      `Delete ${selected.length} folder(s)? This will remove all attractions in these folders.`
    );

    if (!confirmDelete) return;

    try {
      // Delete each selected folder from Firebase
      const deletePromises = selected.map(async (folderName) => {
        return deleteFolder(user.uid, folderName);
      });

      await Promise.all(deletePromises);

      // Refresh wishlists in parent
      refreshWishlists();
      
      setSelected([]);
      setIsEditing(false);
    } catch (error) {
      console.error('Error deleting folders:', error);
      alert('Failed to delete some folders. Please try again.');
    }
  }

  function handleNewList() {
    if (!user) {
      alert('Please sign in to create wishlists!');
      return;
    }

    alert(`To create a folder, save an attraction from the Attractions page and choose "Create new folder"!`);
    setCurrentPage('attractions');
  }

  function handleFolderClick(folder) {
    setCurrentFolder(folder);
    setViewMode('attractions');
    setIsEditing(false);
    setSelected([]);

    // 👇 let the Planner page know which folder is active
    if (setSelectedFolder) {
      setSelectedFolder(folder.name);
    }
  }

  function handleAttractionClick(attraction) {
    setSelectedAttraction(attraction);
    setCurrentPage('attraction-detail');
  }

  function handleBackToFolders() {
    setViewMode('folders');
    setCurrentFolder(null);
    setIsEditing(false);
    setSelected([]);
  }

  const hasRealLists = wishlists && wishlists.length > 0;

  return (
    <div className={isEditing ? "editing" : ""}>
      <header>
        <div className="header-content">
          <div className="header-left">
            <img src="img/webpage-brand-logo.png" alt="Tripweaver Icon" className="icon" />
            <h1>TripWeaver</h1>
          </div>
          <nav>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('planner'); }}>Planner</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); setCurrentPage('attractions'); }}>Attractions</a></li>
              <li><a aria-current="page" href="#">Saved</a></li>
            </ul>
          </nav>
          <button className="profile-button" type="button" aria-label="Profile">
            <img src="img/profile.png" alt="profile button" />
          </button>
        </div>
      </header>

      <main className="page">
        {/* Showing Folders */}
        {viewMode === 'folders' && (
          <>
            <div className="topbar">
              <h2>Wishlists</h2>
              <div>
                {user && hasRealLists && (
                  <button onClick={handleEdit}>
                    {isEditing ? "Done" : "Edit"}
                  </button>
                )}
                <button className="primary" onClick={handleNewList}>
                  New list
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ 
                  display: 'inline-block',
                  width: '50px',
                  height: '50px',
                  border: '4px solid #D2E8E3',
                  borderTop: '4px solid #0F6466',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '20px', color: '#666' }}>Loading your wishlists...</p>
              </div>
            ) : !user ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                  Sign in to save and manage your wishlists!
                </p>
                <button 
                  onClick={() => setCurrentPage('planner')}
                  style={{
                    padding: '12px 24px',
                    background: '#0F6466',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Go to Sign In
                </button>
              </div>
            ) : !hasRealLists ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                  No saved lists yet. Browse attractions and start saving!
                </p>
                <button 
                  onClick={() => setCurrentPage('attractions')}
                  style={{
                    padding: '12px 24px',
                    background: '#0F6466',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Browse Attractions
                </button>
              </div>
            ) : (
              <section className="grid" aria-label="Saved lists">
                {wishlists.map((folder, index) => (
                  <article key={index} className="card">
                    <div className="pill">{folder.count} saved</div>

                    {isEditing && (
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={selected.includes(folder.name)}
                          onChange={() => toggleSelect(folder.name)}
                        />
                      </label>
                    )}

                    <a 
                      className="thumb" 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isEditing) {
                          handleFolderClick(folder);
                        }
                      }}
                    >
                      {folder.attractions[0]?.image ? (
                        <img 
                          src={folder.attractions[0].image} 
                          alt={folder.name}
                          onError={(e) => {
                            e.target.src = '/img/hollywood.png';
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "grid",
                            placeItems: "center",
                            background: "#f3f5f4",
                            fontSize: "48px",
                            color: "#999"
                          }}
                        >
                          📍
                        </div>
                      )}
                    </a>

                    <div className="meta">
                      <p className="title">{folder.name}</p>
                      <p className="sub">Saved from Attractions</p>
                    </div>
                  </article>
                ))}
              </section>
            )}

            <div className="actionbar" role="region" aria-label="Selection actions">
              <span className="count">{selected.length} selected</span>
              <button onClick={handleDelete}>Delete</button>
              <button
                onClick={() => {
                  setSelected([]);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Showing Attractions in a Folder */}
        {viewMode === 'attractions' && currentFolder && (
          <>
            <div className="topbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  onClick={handleBackToFolders}
                  style={{
                    padding: '8px 16px',
                    background: '#0F6466',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  ← Back to Folders
                </button>
                <h2>{currentFolder.name} ({currentFolder.count} attractions)</h2>
              </div>
            </div>

            <section className="grid" aria-label="Attractions" style={{ marginTop: '20px' }}>
              {currentFolder.attractions.map((attraction, index) => (
                <article 
                  key={index} 
                  className="card"
                  onClick={() => handleAttractionClick(attraction)}
                  style={{ cursor: 'pointer' }}
                >
                  <a className="thumb" href="#" onClick={(e) => e.preventDefault()}>
                    <img 
                      src={attraction.image} 
                      alt={attraction.name}
                      onError={(e) => {
                        e.target.src = '/img/hollywood.png';
                      }}
                    />
                  </a>

                  <div className="meta">
                    <p className="title">{attraction.name}</p>
                    <p className="sub">{attraction.category} · {attraction.location}</p>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <p>&copy; 2025 Ariel Xia, Cynthia Jin, Aaron Huang. All rights reserved.</p>
      </footer>

      {/* Add spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
