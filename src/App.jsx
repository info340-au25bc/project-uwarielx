import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserWishlists } from './AttractionFirebaseService';
import PlannerPage from './PlannerPage';
import SavedPage from './SavedPage';
import AttractionSearch from './AttractionSearch';
import AttractionDetail from './AttractionDetail';
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('planner');
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [user, setUser] = useState(null);
  
  // Shared state for wishlists across all pages
  const [wishlists, setWishlists] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadWishlists(currentUser.uid);
      } else {
        setWishlists([]);
        setSelectedFolder(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Reload wishlists when needed (after save/delete)
  useEffect(() => {
    if (needsRefresh && user) {
      loadWishlists(user.uid);
      setNeedsRefresh(false);
    }
  }, [needsRefresh, user]);

  // Load user's wishlists from Firebase
  const loadWishlists = async (userId) => {
    try {
      const lists = await getUserWishlists(userId);
      setWishlists(lists);
      
      // Set default folder if none selected
      if (!selectedFolder && lists.length > 0) {
        setSelectedFolder(lists[0].name);
      }
    } catch (error) {
      console.error('Error loading wishlists:', error);
      setWishlists([]);
    }
  };

  // Refresh wishlists (called after saving/deleting)
  const refreshWishlists = () => {
    setNeedsRefresh(true);
  };

  // Handle folder selection (for planner)
  const handleFolderSelect = (folderName) => {
    setSelectedFolder(folderName);
  };

  // Get attractions from selected folder
  const getSelectedFolderAttractions = () => {
    if (!selectedFolder) return [];
    const folder = wishlists.find(w => w.name === selectedFolder);
    return folder ? folder.attractions : [];
  };

  return (
    <>
      {currentPage === 'planner' && (
        <PlannerPage 
          setCurrentPage={setCurrentPage}
          wishlists={wishlists}
          selectedFolder={selectedFolder}
          setSelectedFolder={handleFolderSelect}
          savedAttractions={getSelectedFolderAttractions()}
        />
      )}
      
      {currentPage === 'saved' && (
        <SavedPage 
          setCurrentPage={setCurrentPage}
          setSelectedAttraction={setSelectedAttraction}
          wishlists={wishlists}
          refreshWishlists={refreshWishlists}
          setSelectedFolder={handleFolderSelect}  
        />
      )}
      
      {currentPage === 'attractions' && (
        <AttractionSearch 
          setCurrentPage={setCurrentPage}
          setSelectedAttraction={setSelectedAttraction}
        />
      )}
      
      {currentPage === 'attraction-detail' && (
        <AttractionDetail 
          setCurrentPage={setCurrentPage}
          attraction={selectedAttraction}
          refreshWishlists={refreshWishlists}     
        />
      )}
    </>
  );
}

export default App;
