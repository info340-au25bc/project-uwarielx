import React, { useState } from 'react';
import attractionsData from './attractionsData';
import './index.css';

export default function AttractionSearch({ setCurrentPage, setSelectedAttraction }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [priceFilter, setPriceFilter] = useState('Any price');

  // Filter attractions based on search and filters
  const filteredAttractions = attractionsData.filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attraction.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All categories' || 
                           attraction.category === categoryFilter;
    
    const matchesPrice = priceFilter === 'Any price' || 
                        attraction.price === priceFilter;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleAttractionClick = (attraction) => {
    setSelectedAttraction(attraction);
    setCurrentPage('attraction-detail');
  };

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
          <button className="profile-button" type="button" aria-label="Profile">
            <img src="img/profile.png" alt="profile button" />
          </button>
        </div>
      </header>

      <main className="wrap-narrow">
        {/* Filters */}
        <section className="search-filters" aria-label="Search and filters">
          <form className="search-row" onSubmit={(e) => e.preventDefault()}>
            <input 
              className="search-input" 
              type="search" 
              placeholder="Search attractions…" 
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="search-select" 
              aria-label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All categories</option>
              <option>Museum</option>
              <option>Landmark</option>
              <option>Park</option>
              <option>Science</option>
              <option>Theme Park</option>
            </select>
            <select 
              className="search-select" 
              aria-label="Price"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option>Any price</option>
              <option>Free</option>
              <option>Paid</option>
            </select>
          </form>
        </section>

        {/* Results list */}
        <section className="search-cards" aria-label="Results">
          {filteredAttractions.map(attraction => (
            <a 
              key={attraction.id}
              className="search-card" 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleAttractionClick(attraction);
              }}
            >
              <div className="search-thumb">
                <img src={attraction.image} alt={attraction.name} />
              </div>
              <div className="search-meta">
                <h2 className="search-title">{attraction.name}</h2>
                <p className="search-sub">{attraction.category} · {attraction.location}</p>
                <p className="search-desc">{attraction.description}</p>
              </div>
            </a>
          ))}
          
          {filteredAttractions.length === 0 && (
            <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No attractions found matching your criteria.
            </p>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>&copy; 2025 Ariel Xia, Cynthia Jin, Aaron Huang. All rights reserved.</p>
      </footer>
    </div>
  );
}

