import { useState, useEffect } from 'react';
import { FavoritesContext } from './favorites-context';
const STORAGE_KEY = 'crypto-dash-favorites';

const loadFavorites = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage is blocked or full; favorites still work for this session.
    }
  }, [favorites]);

  const isFavorite = (id) => favorites.includes(id);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
