import React, { useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa'; // Import the FaMoon and FaSun icons from react-icons/fa
import TimeConverter from './components/TimeConverter';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css'

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        <div className="title-container" style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ display: 'inline-flex', marginTop: '10px', marginLeft: '25px' }}>Time Converter</h1>
          <button
            style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              margin: '0',
            }}
            className={`btn ${darkMode ? 'btn-light-mode' : 'btn-dark-mode'}`}
            onClick={toggleDarkMode}
          > {darkMode ? <FaSun /> : <FaMoon />} {/* Render sun icon for light mode and moon icon for dark mode */}
          </button>
        </div>
      <div className="container">
        <DndProvider backend={HTML5Backend}>
        <TimeConverter />
        </DndProvider>
      </div>
    </div>
  );
};

export default App;
