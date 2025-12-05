import React, { useState } from 'react';
import PlannerPage from './PlannerPage';
import SavedPage from './SavedPage';
import AttractionSearch from './AttractionSearch';
import AttractionDetail from './AttractionDetail';
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('planner');
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  
  return (
    <>
      {currentPage === 'planner' && (
        <PlannerPage setCurrentPage={setCurrentPage} />
      )}
      
      {currentPage === 'saved' && (
        <SavedPage setCurrentPage={setCurrentPage} />
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
        />
      )}
    </>
  );
}

export default App;