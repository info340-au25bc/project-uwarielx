import { useState, useEffect } from "react";
import "./index.css";

export default function SavedPage({ setCurrentPage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [lists, setLists] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedLists");
    if (saved) {
      setLists(JSON.parse(saved));
    } else {
      // Default lists matching original saved.html
      setLists([
        {
          id: "recent",
          pill: "1 week ago",
          title: "Recently viewed",
          sub: "3 items",
          img: "/img/hollywood.png"
        },
        {
          id: "la2025",
          pill: "5 saved",
          title: "LA Weekend 2025",
          sub: "Saved from Attractions",
          img: "/img/griffith.png"
        },
        {
          id: "nyc2025",
          pill: "2 saved",
          title: "NYC 2025",
          sub: "Saved from Planner",
          img: "/img/getty.png"
        },
        {
          id: "empty",
          pill: null,
          title: "Create a list",
          sub: "Save places you love",
          img: null,
          isPlaceholder: true
        }
      ]);
    }
  }, []);

  useEffect(() => {
    // Only save non-placeholder lists
    const listsToSave = lists.filter(item => !item.isPlaceholder);
    localStorage.setItem("savedLists", JSON.stringify(listsToSave));
  }, [lists]);

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

  function handleDelete() {
    const newLists = lists.filter((item) => !selected.includes(item.id));
    setLists(newLists);
    setSelected([]);
    setIsEditing(false);
  }

  function handleNewList() {
    const name = prompt("Name your list:", "New list");
    if (!name) return;
    const newItem = {
      id: "user-" + Date.now(),
      pill: "0 saved",
      title: name,
      sub: "Empty list",
      img: null
    };
    setLists([newItem, ...lists.filter(item => !item.isPlaceholder)]);
  }

  const hasRealLists = lists.some(item => !item.isPlaceholder);

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
        <div className="topbar">
          <h2>Wishlists</h2>
          <div>
            <button onClick={handleEdit}>
              {isEditing ? "Done" : "Edit"}
            </button>
            <button className="primary" onClick={handleNewList}>
              New list
            </button>
          </div>
        </div>

        {!hasRealLists ? (
          <p className="empty">No saved lists yet.</p>
        ) : (
          <section className="grid" aria-label="Saved lists">
            {lists.map((item) => (
              <article key={item.id} className="card" data-id={item.id}>
                {item.pill && <div className="pill">{item.pill}</div>}

                {isEditing && !item.isPlaceholder && (
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </label>
                )}

                <a className="thumb" href={item.isPlaceholder ? "#" : "#"} onClick={(e) => e.preventDefault()}>
                  {item.img ? (
                    <img src={item.img} alt={item.title} />
                  ) : item.isPlaceholder ? (
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
                    </svg>
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
                      +
                    </div>
                  )}
                </a>

                <div className="meta">
                  <p className="title">{item.title}</p>
                  <p className="sub">{item.sub}</p>
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
      </main>

      <footer className="site-footer">
        <p>&copy; 2025 Ariel Xia, Cynthia Jin, Aaron Huang. All rights reserved.</p>
      </footer>
    </div>
  );
}