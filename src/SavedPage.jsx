import { useState, useEffect } from "react";
import "./index.css";

export default function SavedPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [lists, setLists] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedLists");
    if (saved) {
      setLists(JSON.parse(saved));
    } else {
      setLists([
        {
          id: "recent",
          pill: "1 week ago",
          title: "Recently viewed",
          sub: "3 items",
          img: "img/hollywood.png"
        },
        {
          id: "la2025",
          pill: "5 saved",
          title: "LA Weekend 2025",
          sub: "Saved from Attractions",
          img: "img/griffith.png"
        },
        {
          id: "nyc2025",
          pill: "2 saved",
          title: "NYC 2025",
          sub: "Saved from Planner",
          img: "img/getty.png"
        }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedLists", JSON.stringify(lists));
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
    setLists([newItem, ...lists]);
  }

  return (
    <div className={isEditing ? "editing" : ""}>
      <header role="banner">
        <img
          className="icon"
          src="img/webpage-brand-logo.png"
          alt="TripWeaver logo"
        />
        <h1>TripWeaver</h1>
        <nav aria-label="Primary">
          <ul>
            <li>
              <a href="#">Planner</a>
            </li>
            <li>
              <a href="#">Attractions</a>
            </li>
            <li>
              <a aria-current="page" href="#">
                Saved
              </a>
            </li>
          </ul>
        </nav>
        <button className="profile-button">
          <img src="img/profile.png" alt="profile" />
        </button>
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

        <section className="grid">
          {lists.length === 0 && (
            <p className="empty">No saved lists yet.</p>
          )}

          {lists.map((item) => (
            <article key={item.id} className="card">
              {item.pill && <div className="pill">{item.pill}</div>}

              {isEditing && (
                <label className="check">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                </label>
              )}

              <a className="thumb" href="#">
                {item.img ? (
                  <img src={item.img} alt={item.title} />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      background: "#f7f7f7",
                      fontSize: "32px"
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

        {isEditing && (
          <div className="actionbar">
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
        )}
      </main>

      <footer className="site-footer">
        <p>© 2025 Ariel Xia, Cynthia Jin, Aaron Huang. All rights reserved.</p>
      </footer>
    </div>
  );
}
