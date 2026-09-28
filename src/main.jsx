import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { testFirestoreConnection } from './services/firebase.js';
import './styles/index.css';

// Test connection to Firestore per Firebase skill
testFirestoreConnection();

// Ensure browser does not restore previous scroll position on reload
if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant',
  });
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );
}
