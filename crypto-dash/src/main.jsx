import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App.jsx';
import CoinsProvider from './context/CoinsProvider.jsx';
import FavoritesProvider from './context/FavoritesProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <CoinsProvider>
          <App />
        </CoinsProvider>
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>
);
