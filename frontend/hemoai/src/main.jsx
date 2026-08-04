// src/main.jsx
// This is the entry point of the whole React app - the very first
// JavaScript file that runs in the browser.
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Find the <div id="root"> in index.html and mount our React app inside it.
// BrowserRouter enables page navigation (like /login, /app/dashboard) without
// full page reloads. React.StrictMode just helps catch bugs during development.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)