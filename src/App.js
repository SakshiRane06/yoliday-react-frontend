// src/App.js
import React from 'react';
import Chatbot from './Chatbot';
import './App.css'; // We'll create this file for styling

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Yoliday Travel Assistant 🧳</h1>
        <p>Your personal guide to planning the perfect trip.</p>
      </header>
      <main>
        <Chatbot />
      </main>
    </div>
  );
}

export default App;