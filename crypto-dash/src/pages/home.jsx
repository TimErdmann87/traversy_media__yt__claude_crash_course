import CoinCard from '../components/CoinCard';
import LimitSelector from '../components/LimitSelector';
import FilterInput from '../components/FilterInput';
import SortSelector from '../components/SortSelector';
import Spinner from '../components/Spinner';
import FavoritesToggle from '../components/FavoritesToggle';
import { useCoins } from '../context/coins-context';
import { useFavorites } from '../context/favorites-context';

const HomePage = () => {
  const {
    coins,
    filter,
    setFilter,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    showFavoritesOnly,
    setShowFavoritesOnly,
    loading,
    error,
  } = useCoins();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const filteredCoins = coins
    .filter((coin) => !showFavoritesOnly || isFavorite(coin.id))
    .filter((coin) => {
      return (
        coin.name.toLowerCase().includes(filter.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(filter.toLowerCase())
      );
    })
    .slice()
    .sort((a, b) => {
      switch (sortBy) {
        case 'market_cap_desc':
          return b.market_cap - a.market_cap;
        case 'market_cap_asc':
          return a.market_cap - b.market_cap;
        case 'price_desc':
          return b.current_price - a.current_price;
        case 'price_asc':
          return a.current_price - b.current_price;
        case 'change_desc':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'change_asc':
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
      }
    });

  return (
    <div>
      <h1>🚀 Crypto Dash</h1>
      {loading && <Spinner color='white' />}
      {error && <div className='error'>{error}</div>}

      <div className='top-controls'>
        <FilterInput filter={filter} onFilterChange={setFilter} />
        <FavoritesToggle
          checked={showFavoritesOnly}
          count={favorites.length}
          onChange={setShowFavoritesOnly}
        />
        <LimitSelector
          limit={limit}
          onLimitChange={setLimit}
          disabled={showFavoritesOnly}
        />
        <SortSelector sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {!loading && !error && (
        <main className='grid'>
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                isFavorite={isFavorite(coin.id)}
                onToggleFavorite={() => toggleFavorite(coin.id)}
              />
            ))
          ) : showFavoritesOnly && favorites.length === 0 ? (
            <p>No favorites yet. Click ☆ on a coin to add it.</p>
          ) : (
            <p>No matching coins</p>
          )}
        </main>
      )}
    </div>
  );
};

export default HomePage;
