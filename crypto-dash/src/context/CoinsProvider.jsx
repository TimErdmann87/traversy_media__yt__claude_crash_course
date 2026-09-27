import { useState, useEffect, useRef } from 'react';
import { CoinsContext } from './coins-context';
import { useFavorites } from './favorites-context';
const API_URL = import.meta.env.VITE_COINS_API_URL;

const CoinsProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // The fetch reads favorites through a ref so that un-starring a coin in
  // favorites mode hides it on the client instead of triggering a refetch.
  const { favorites } = useFavorites();
  const favoritesRef = useRef(favorites);
  useEffect(() => {
    favoritesRef.current = favorites;
  }, [favorites]);

  useEffect(() => {
    let ignore = false;

    const fetchCoins = async () => {
      const ids = favoritesRef.current;

      if (showFavoritesOnly && ids.length === 0) {
        setCoins([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const query = showFavoritesOnly
          ? `&ids=${ids.join(',')}&order=market_cap_desc&per_page=${ids.length}&page=1&sparkline=false`
          : `&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
        const res = await fetch(`${API_URL}${query}`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        if (!ignore) setCoins(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchCoins();

    return () => {
      ignore = true;
    };
  }, [limit, showFavoritesOnly]);

  return (
    <CoinsContext.Provider
      value={{
        coins,
        loading,
        error,
        limit,
        setLimit,
        filter,
        setFilter,
        sortBy,
        setSortBy,
        showFavoritesOnly,
        setShowFavoritesOnly,
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
};

export default CoinsProvider;
