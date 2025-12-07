// Attractions Database
export const attractionsData = [
  {
    id: 'hollywood-walk-of-fame',
    name: 'Hollywood Walk of Fame',
    category: 'Landmark',
    location: 'Los Angeles, CA',
    coordinates: { lat: 34.1019, lng: -118.3269 },
    rating: 4,
    price: 'Free',
    description: 'The Hollywood Walk of Fame features more than 2,700 brass stars embedded along Hollywood Boulevard and Vine Street, honoring notable figures in entertainment.',
    image: '/img/hollywood.png',
    features: ['Family-friendly', 'Open 24h', 'Nearby transit'],
    hours: 'Open 24 hours'
  },
  {
    id: 'griffith-observatory',
    name: 'Griffith Observatory',
    category: 'Science',
    location: 'Los Angeles, CA',
    coordinates: { lat: 34.1184, lng: -118.3004 },
    rating: 5,
    price: 'Free',
    description: 'Public observatory & planetarium with iconic city views.',
    image: '/img/griffith.png',
    features: ['Scenic views', 'Educational', 'Parking available'],
    hours: 'Tuesday-Friday 12:00-22:00, Saturday-Sunday 10:00-22:00'
  },
  {
    id: 'getty-center',
    name: 'The Getty Center',
    category: 'Museum',
    location: 'Los Angeles, CA',
    coordinates: { lat: 34.0780, lng: -118.4741 },
    rating: 5,
    price: 'Free',
    description: 'Art museum known for its architecture, gardens, and city views.',
    image: '/img/getty.png',
    features: ['Art collection', 'Gardens', 'Restaurant'],
    hours: 'Tuesday-Friday, Sunday 10:00-17:30, Saturday 10:00-21:00'
  },
  {
    id: 'santa-monica-pier',
    name: 'Santa Monica Pier',
    category: 'Landmark',
    location: 'Santa Monica, CA',
    coordinates: { lat: 34.0094, lng: -118.4973 },
    rating: 4,
    price: 'Free',
    description: 'Historic pier with amusement park, aquarium, and restaurants.',
    image: '/img/hollywood.png', 
    features: ['Family-friendly', 'Beach access', 'Dining'],
    hours: 'Open 24 hours'
  },
  {
    id: 'universal-studios',
    name: 'Universal Studios Hollywood',
    category: 'Theme Park',
    location: 'Universal City, CA',
    coordinates: { lat: 34.1381, lng: -118.3534 },
    rating: 5,
    price: 'Paid',
    description: 'Film studio and theme park with movie-themed rides and attractions.',
    image: '/img/griffith.png', 
    features: ['Theme park', 'Studio tour', 'Dining'],
    hours: 'Daily 9:00-18:00 (varies by season)'
  },
  {
    id: 'la-county-museum',
    name: 'Los Angeles County Museum of Art',
    category: 'Museum',
    location: 'Los Angeles, CA',
    coordinates: { lat: 34.0639, lng: -118.3592 },
    rating: 4,
    price: 'Paid',
    description: 'Largest art museum in the western United States.',
    image: '/img/getty.png',
    features: ['Art collection', 'Exhibitions', 'Gift shop'],
    hours: 'Monday, Tuesday, Thursday 11:00-17:00, Friday 11:00-20:00, Saturday-Sunday 10:00-19:00'
  }
];

export default attractionsData;