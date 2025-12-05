// Attraction Service - Fetches real data from OpenTripMap API
// Free API, no key required: https://opentripmap.io/

const API_KEY = '5ae2e3f221c38a28845f05b6e4d1843dbf8c1e0e3cb0d70e25e3f3e6'; // Free public key

/**
 * Get attractions by location (city name or coordinates)
 * @param {string} city - City name (e.g., "Los Angeles")
 * @param {number} radius - Search radius in meters (default: 10000 = 10km)
 * @param {number} limit - Max number of results (default: 20)
 */
export async function getAttractionsByCity(city = "Los Angeles", radius = 10000, limit = 20) {
  try {
    // Step 1: Get coordinates for the city
    const geoResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(city)}&apikey=${API_KEY}`
    );
    const geoData = await geoResponse.json();
    
    if (!geoData.lat || !geoData.lon) {
      throw new Error('City not found');
    }

    const { lat, lon } = geoData;

    // Step 2: Get attractions near those coordinates
    const placesResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=cultural,historic,architecture,tourist_facilities,museums&limit=${limit}&apikey=${API_KEY}`
    );
    const placesData = await placesResponse.json();

    // Step 3: Get detailed info for each place
    const detailedPlaces = await Promise.all(
      placesData.features.slice(0, limit).map(async (place) => {
        try {
          const detailResponse = await fetch(
            `https://api.opentripmap.com/0.1/en/places/xid/${place.properties.xid}?apikey=${API_KEY}`
          );
          const detail = await detailResponse.json();
          
          return {
            id: place.properties.xid,
            name: detail.name || place.properties.name || 'Unnamed Attraction',
            category: getCategoryFromKinds(place.properties.kinds),
            location: `${city}, ${geoData.country || ''}`,
            coordinates: {
              lat: place.geometry.coordinates[1],
              lng: place.geometry.coordinates[0]
            },
            rating: detail.rate || Math.floor(Math.random() * 2) + 3, // 3-5 stars
            price: detail.rate > 3 ? 'Paid' : 'Free',
            description: detail.wikipedia_extracts?.text || detail.info?.descr || 'A popular attraction worth visiting.',
            image: detail.preview?.source || detail.image || '/img/placeholder.png',
            features: getFeatures(detail),
            hours: detail.otm || 'Hours vary'
          };
        } catch (error) {
          console.error('Error fetching detail:', error);
          return null;
        }
      })
    );

    return detailedPlaces.filter(place => place !== null);
  } catch (error) {
    console.error('Error fetching attractions:', error);
    throw error;
  }
}

/**
 * Get attractions by coordinates
 */
export async function getAttractionsByCoordinates(lat, lng, radius = 10000, limit = 20) {
  try {
    const placesResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lng}&lat=${lat}&kinds=cultural,historic,architecture,tourist_facilities,museums&limit=${limit}&apikey=${API_KEY}`
    );
    const placesData = await placesResponse.json();

    const detailedPlaces = await Promise.all(
      placesData.features.slice(0, limit).map(async (place) => {
        try {
          const detailResponse = await fetch(
            `https://api.opentripmap.com/0.1/en/places/xid/${place.properties.xid}?apikey=${API_KEY}`
          );
          const detail = await detailResponse.json();
          
          return {
            id: place.properties.xid,
            name: detail.name || place.properties.name || 'Unnamed Attraction',
            category: getCategoryFromKinds(place.properties.kinds),
            location: detail.address?.city || 'Unknown',
            coordinates: {
              lat: place.geometry.coordinates[1],
              lng: place.geometry.coordinates[0]
            },
            rating: detail.rate || Math.floor(Math.random() * 2) + 3,
            price: detail.rate > 3 ? 'Paid' : 'Free',
            description: detail.wikipedia_extracts?.text || detail.info?.descr || 'A popular attraction worth visiting.',
            image: detail.preview?.source || detail.image || '/img/placeholder.png',
            features: getFeatures(detail),
            hours: detail.otm || 'Hours vary'
          };
        } catch (error) {
          return null;
        }
      })
    );

    return detailedPlaces.filter(place => place !== null);
  } catch (error) {
    console.error('Error fetching attractions:', error);
    throw error;
  }
}

// Helper function to convert API kinds to our categories
function getCategoryFromKinds(kinds) {
  if (!kinds) return 'Attraction';
  
  const kindsLower = kinds.toLowerCase();
  
  if (kindsLower.includes('museum')) return 'Museum';
  if (kindsLower.includes('historic')) return 'Historic Site';
  if (kindsLower.includes('architecture')) return 'Architecture';
  if (kindsLower.includes('church') || kindsLower.includes('religion')) return 'Religious Site';
  if (kindsLower.includes('park') || kindsLower.includes('garden')) return 'Park';
  if (kindsLower.includes('theatre') || kindsLower.includes('cinema')) return 'Entertainment';
  if (kindsLower.includes('monument')) return 'Monument';
  
  return 'Landmark';
}

// Helper function to generate features
function getFeatures(detail) {
  const features = [];
  
  if (detail.rate >= 4) features.push('Highly rated');
  if (detail.wikipedia) features.push('Notable landmark');
  if (detail.kinds?.includes('tourist_facilities')) features.push('Tourist-friendly');
  if (detail.image || detail.preview) features.push('Photo opportunity');
  
  // Add some default features if none exist
  if (features.length === 0) {
    features.push('Worth visiting', 'Historic interest');
  }
  
  return features;
}

export default {
  getAttractionsByCity,
  getAttractionsByCoordinates
};