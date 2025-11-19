import React, { useState } from 'react';
import PlannerPage from './PlannerPage';
import SavedPage from './SavedPage';
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('planner'); // 'planner' or 'saved'

  return (
    <div>
      {currentPage === 'planner' ? (
        <PlannerPage setCurrentPage={setCurrentPage} />
      ) : (
        <SavedPage setCurrentPage={setCurrentPage} />
      )}
    </div>
  );
};

export default App;