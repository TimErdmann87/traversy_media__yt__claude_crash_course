import { useState, useEffect } from 'react';
import { CoinsContext } from './coins-context';
const API_URL = import.meta.env.VITE_COINS_API_URL;

const CoinsProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_URL}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
        );
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [limit]);

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
      }}
    >
      {children}
    </CoinsContext.Provider>
  );
};

export default CoinsProvider;
