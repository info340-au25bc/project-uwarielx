// Firebase Service for Attraction Wishlists
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  deleteDoc, 
  updateDoc,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Save an attraction to a user's wishlist folder
 * @param {string} userId - User's Firebase UID
 * @param {string} folderName - Folder name (e.g., "LA", "Paris Trip")
 * @param {object} attraction - Attraction object to save
 */
export async function saveAttractionToWishlist(userId, folderName, attraction) {
  try {
    if (!userId) {
      throw new Error('User must be logged in to save attractions');
    }

    // Create a unique ID for this saved attraction
    const savedAttractionId = `${userId}_${folderName}_${attraction.id}`;
    
    const attractionRef = doc(db, 'savedAttractions', savedAttractionId);
    
    await setDoc(attractionRef, {
      userId: userId,
      folderName: folderName,
      attractionId: attraction.id,
      attractionData: {
        name: attraction.name,
        category: attraction.category,
        location: attraction.location,
        coordinates: attraction.coordinates,
        rating: attraction.rating,
        price: attraction.price,
        description: attraction.description,
        image: attraction.image,
        features: attraction.features,
        hours: attraction.hours
      },
      savedAt: serverTimestamp(),
      lastModified: serverTimestamp()
    });

    console.log('Attraction saved successfully!');
    return { success: true, id: savedAttractionId };
  } catch (error) {
    console.error('Error saving attraction:', error);
    throw error;
  }
}

/**
 * Get all wishlists (folders) for a user
 * @param {string} userId - User's Firebase UID
 */
export async function getUserWishlists(userId) {
  try {
    if (!userId) {
      throw new Error('User ID required');
    }

    const q = query(
      collection(db, 'savedAttractions'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Group attractions by folder
    const folders = {};
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const folderName = data.folderName;
      
      if (!folders[folderName]) {
        folders[folderName] = {
          name: folderName,
          attractions: [],
          count: 0,
          lastModified: data.lastModified
        };
      }
      
      folders[folderName].attractions.push({
        id: doc.id,
        ...data.attractionData,
        savedAt: data.savedAt
      });
      
      folders[folderName].count++;
    });

    // Convert to array
    return Object.values(folders);
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    throw error;
  }
}

/**
 * Get attractions from a specific folder
 * @param {string} userId - User's Firebase UID
 * @param {string} folderName - Folder name
 */
export async function getAttractionsFromFolder(userId, folderName) {
  try {
    if (!userId) {
      throw new Error('User ID required');
    }

    const q = query(
      collection(db, 'savedAttractions'),
      where('userId', '==', userId),
      where('folderName', '==', folderName)
    );
    
    const querySnapshot = await getDocs(q);
    const attractions = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      attractions.push({
        id: doc.id,
        ...data.attractionData,
        savedAt: data.savedAt
      });
    });

    return attractions;
  } catch (error) {
    console.error('Error fetching folder attractions:', error);
    throw error;
  }
}

/**
 * Remove an attraction from wishlist
 * @param {string} savedAttractionId - Document ID in Firestore
 */
export async function removeAttractionFromWishlist(savedAttractionId) {
  try {
    await deleteDoc(doc(db, 'savedAttractions', savedAttractionId));
    console.log('Attraction removed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error removing attraction:', error);
    throw error;
  }
}

/**
 * Create a new wishlist folder
 * @param {string} userId - User's Firebase UID
 * @param {string} folderName - New folder name
 */
export async function createWishlistFolder(userId, folderName) {
  try {
    if (!userId) {
      throw new Error('User must be logged in');
    }

    // Create a placeholder document for the folder
    const folderId = `${userId}_folder_${folderName}`;
    const folderRef = doc(db, 'wishlistFolders', folderId);
    
    await setDoc(folderRef, {
      userId: userId,
      folderName: folderName,
      createdAt: serverTimestamp(),
      lastModified: serverTimestamp()
    });

    console.log('Folder created successfully!');
    return { success: true, folderName };
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

/**
 * Get all folder names for a user
 * @param {string} userId - User's Firebase UID
 */
export async function getUserFolderNames(userId) {
  try {
    if (!userId) {
      throw new Error('User ID required');
    }

    const q = query(
      collection(db, 'wishlistFolders'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const folderNames = [];
    
    querySnapshot.forEach((doc) => {
      folderNames.push(doc.data().folderName);
    });

    return folderNames;
  } catch (error) {
    console.error('Error fetching folder names:', error);
    return ['LA']; // Default folder
  }
}

/**
 * Delete an entire folder and all its attractions
 * @param {string} userId - User's Firebase UID
 * @param {string} folderName - Folder name to delete
 */
export async function deleteFolder(userId, folderName) {
  try {
    // Delete all attractions in the folder
    const q = query(
      collection(db, 'savedAttractions'),
      where('userId', '==', userId),
      where('folderName', '==', folderName)
    );
    
    const querySnapshot = await getDocs(q);
    const deletePromises = [];
    
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);

    // Delete the folder document
    const folderId = `${userId}_folder_${folderName}`;
    await deleteDoc(doc(db, 'wishlistFolders', folderId));

    console.log('Folder deleted successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
}

/**
 * Check if an attraction is already saved in any folder
 * @param {string} userId - User's Firebase UID
 * @param {string} attractionId - Attraction ID
 */
export async function isAttractionSaved(userId, attractionId) {
  try {
    if (!userId) return false;

    const q = query(
      collection(db, 'savedAttractions'),
      where('userId', '==', userId),
      where('attractionId', '==', attractionId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if attraction is saved:', error);
    return false;
  }
}

export default {
  saveAttractionToWishlist,
  getUserWishlists,
  getAttractionsFromFolder,
  removeAttractionFromWishlist,
  createWishlistFolder,
  getUserFolderNames,
  deleteFolder,
  isAttractionSaved
};