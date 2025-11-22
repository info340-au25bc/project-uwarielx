import React from 'react';

export default function AttractionPage({ setCurrentPage }) {
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
              <li><a aria-current="page" href="#">Attractions</a></li>
              <li><a href="#" onClick={e => { e.preventDefault(); setCurrentPage('saved'); }}>Saved</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="page" style={{height: 'calc(100vh - 160px)'}}>
        <iframe
          title="Attractions"
          src="/attraction-search.html"
          style={{ width: '100%', height: '100%', border: '0' }}
        />
      </main>

      <footer className="site-footer">
        <p>&copy; 2025 Ariel Xia, Cynthia Jin, Aaron Huang. All rights reserved.</p>
      </footer>
    </div>
  );
}


