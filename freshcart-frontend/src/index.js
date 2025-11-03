import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <-- ADD THIS LINE
import App from './App'; // Import your main App component

// 1. Find the "root" div from your index.html
const rootElement = document.getElementById('root');

// 2. Create a React root to render into that element
const root = ReactDOM.createRoot(rootElement);

// 3. Tell React to render your <App /> component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);