// src/main.jsx lub src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css'; // TUTAJ IMPORTUJEMY NOWY GLOBALNY PLIK CSS 
// Importujemy AuthProvider
import { AuthProvider } from './context/AuthContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* TUTAJ MUSI BYĆ DODANY AuthProvider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);