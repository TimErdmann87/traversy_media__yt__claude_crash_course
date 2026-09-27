import { createContext, useContext } from 'react';

export const CoinsContext = createContext(null);

export const useCoins = () => {
  const context = useContext(CoinsContext);
  if (!context) {
    throw new Error('useCoins must be used within a CoinsProvider');
  }
  return context;
};
