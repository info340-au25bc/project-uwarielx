import React, { useState } from 'react';
import PlannerPage from './PlannerPage';
import SavedPage from './SavedPage';
import AttractionPage from './AttractionSearch';
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('planner'); 
  return (
    currentPage === 'planner' ? <PlannerPage setCurrentPage={setCurrentPage} /> :
    currentPage === 'saved'   ? <SavedPage setCurrentPage={setCurrentPage} /> :
                                <AttractionPage setCurrentPage={setCurrentPage} />
  )
  }

export default App;