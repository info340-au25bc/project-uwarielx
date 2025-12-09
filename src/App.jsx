import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserWishlists } from './AttractionFirebaseService';

import PlannerPage from './PlannerPage';
import SavedPage from './SavedPage';
import AttractionSearch from './AttractionSearch';
import AttractionDetail from './AttractionDetail';
import './index.css';

function NotFound() {
  return (
    <div style={{textAlign: 'center', padding: '80px'}}>
      <h2>404 - Page Not Found</h2>
      <p>The page you requested does not exist.</p>
      <a href="/">Go to Planner</a>
    </div>
  );
}


const App = () => {
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [user, setUser] = useState(null);
  const [wishlists, setWishlists] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

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

  useEffect(() => {
    if (needsRefresh && user) {
      loadWishlists(user.uid);
      setNeedsRefresh(false);
    }
  }, [needsRefresh, user]);

  const loadWishlists = async (userId) => {
    try {
      const lists = await getUserWishlists(userId);
      setWishlists(lists);
      if (!selectedFolder && lists.length > 0) {
        setSelectedFolder(lists[0].name);
      }
    } catch (error) {
      console.error('Error loading wishlists:', error);
      setWishlists([]);
    }
  };

  const refreshWishlists = () => {
    setNeedsRefresh(true);
  };

  const handleFolderSelect = (folderName) => {
    setSelectedFolder(folderName);
  };

  const getSelectedFolderAttractions = () => {
    if (!selectedFolder) return [];
    const folder = wishlists.find(w => w.name === selectedFolder);
    return folder ? folder.attractions : [];
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/"
          element={
            <PlannerPage
              wishlists={wishlists}
              selectedFolder={selectedFolder}
              setSelectedFolder={handleFolderSelect}
              savedAttractions={getSelectedFolderAttractions()}
            />
          }
        />
        <Route 
          path="/saved"
          element={
            <SavedPage
              setSelectedAttraction={setSelectedAttraction}
              wishlists={wishlists}
              refreshWishlists={refreshWishlists}
              setSelectedFolder={handleFolderSelect}
            />
          }
        />
        <Route 
          path="/attractions"
          element={
            <AttractionSearch
              setSelectedAttraction={setSelectedAttraction}
            />
          }
        />
        <Route 
          path="/attraction/:id"
          element={
            <AttractionDetail
              attraction={selectedAttraction}
              refreshWishlists={refreshWishlists}
            />
          }
        />
        <Route 
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Router>
  );
};

export default App;
