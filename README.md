# TripWeaver - Attraction Search & Detail Integration

This update adds a complete attraction search and detail page system to your TripWeaver project with a client-side database.

## Files Included

1. **attractionsData.js** - Database of attractions with 6 sample attractions
2. **AttractionSearch.jsx** - Search page with filters (replaces your old version)
3. **AttractionDetail.jsx** - Detail page with wishlist functionality (NEW)
4. **App.jsx** - Updated routing to handle attraction pages
5. **index.css** - Updated styles with attraction page CSS added
6. **main.jsx** - Entry point (no changes needed, but included for completeness)

## Installation Steps

1. **Replace these files in your `src` folder:**
   - AttractionSearch.jsx (replaces the old one)
   - App.jsx (replaces the old one)
   - index.css (replaces the old one)

2. **Add these NEW files to your `src` folder:**
   - attractionsData.js (NEW - the database)
   - AttractionDetail.jsx (NEW - detail page component)

3. **Keep your existing files:**
   - PlannerPage.jsx
   - SavedPage.jsx
   - AuthModal.jsx
   - firebase.js
   - main.jsx

## Features

### Attraction Search Page
- Search bar with live filtering
- Category filter (Museum, Landmark, Science, Theme Park, etc.)
- Price filter (Free, Paid)
- Clickable cards that navigate to detail page
- Responsive design

### Attraction Detail Page
- Full attraction information with image
- Star rating display
- Google Maps integration (opens in new tab)
- Wishlist functionality with two-step modal:
  1. Confirm save
  2. Select folder (LA or create new)
- Feature tags display
- Hours and price information
- Back to search button

### Database Structure
Each attraction includes:
- id (unique identifier)
- name
- category
- location
- coordinates (lat/lng for Google Maps)
- rating (1-5 stars)
- price (Free/Paid)
- description
- image path
- features array
- hours

## How to Add More Attractions

Edit `attractionsData.js` and add new objects to the array:

```javascript
{
  id: 'unique-attraction-id',
  name: 'Attraction Name',
  category: 'Museum', // or 'Landmark', 'Park', etc.
  location: 'City, State',
  coordinates: { lat: 34.0000, lng: -118.0000 },
  rating: 4, // 1-5
  price: 'Free', // or 'Paid'
  description: 'Brief description of the attraction.',
  image: '/img/image-name.png',
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  hours: 'Opening hours description'
}
```

## Navigation Flow

1. User clicks "Attractions" in nav → AttractionSearch page
2. User clicks an attraction card → AttractionDetail page
3. User can click "Back to Search" → Returns to AttractionSearch
4. User can click nav links → Navigate to other pages (Planner, Saved)

## Styling Notes

- All CSS matches your existing TripWeaver design
- Uses your color palette:
  - Primary: #0F6466 (teal)
  - Accent: #DBB08C (beige)
  - Background: #D2E8E3 (mint)
- Responsive breakpoints at 768px and 480px
- Smooth transitions and hover effects

## Testing Checklist

- [ ] Search bar filters attractions by name/description
- [ ] Category dropdown filters correctly
- [ ] Price dropdown filters correctly
- [ ] Clicking attraction card shows detail page
- [ ] Google Maps link opens correctly
- [ ] Wishlist button shows confirm modal
- [ ] Confirm modal shows folder selection
- [ ] Back button returns to search
- [ ] All navigation links work
- [ ] Responsive design works on mobile

## Integration with Planner Page

To enable drag-and-drop from attractions to planner (future enhancement):
1. Use the attractions data in PlannerPage's savedAttractions state
2. Import attractionsData and filter/display as needed
3. The data structure is already compatible with your planner's drag-and-drop

## Notes

- No external API calls needed - all data is client-side
- Uses localStorage for wishlist persistence (currently just alerts, can be enhanced)
- Keyboard accessible (Escape closes modals)
- Screen reader friendly with proper ARIA labels
- Google Maps links use the format specified in your proposal

## Questions?

If you need help with:
- Adding more attractions
- Connecting to Firebase for persistence
- Adding drag-and-drop to planner
- Any other features

Just ask!
