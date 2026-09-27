import { Routes, Route } from 'react-router';
import Header from './components/Header';
import HomePage from './pages/home';
import AboutPage from './pages/about';
import NotFoundPage from './pages/not-found';
import CoinDetailsPage from './pages/coin-details';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/coin/:id' element={<CoinDetailsPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
