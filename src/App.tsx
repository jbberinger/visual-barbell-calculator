import React, { useState, useEffect } from 'react';
import './style/App.css';

const App: React.FC = () => {

  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = message;
  });

  return (
    <div className="App">
      <main>
        <h1>{message}</h1>
        <button onClick={() => setMessage('welcome')}>click</button>
      </main>
    </div>
  );
}

export default App;
