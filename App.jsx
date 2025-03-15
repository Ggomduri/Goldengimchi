import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ContrarianIndicator from './pages/ContrarianIndicator';
import Navbar from './components/Navbar';  // <-- This was explicitly missing and must be added clearly

// ScrollToTop: Ensures the page scrolls to the top when navigating
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

const Home = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchPrices = async () => {
    try {
      const { data } = await axios.get('/api/prices');
      setPrices(data);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setPrices({});
    } finally {
      setLoading(false);
    }
  };

  const checkLoginStatus = async () => {
    try {
      const { data } = await axios.get('/api/user/info');
      setIsLoggedIn(!!(data && data.email));
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const { data } = await axios.get('/api/favorite');
      const favMap = {};
      data.forEach(fav => {
        favMap[fav.coinSymbol] = true;
      });
      setFavorites(favMap);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  useEffect(() => {
    fetchPrices();
    checkLoginStatus();
    const interval = setInterval(() => {
      fetchPrices();
      checkLoginStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadFavorites();
    }
  }, [isLoggedIn]);

  const coinOrder = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'DOGEUSDT', 'XRPUSDT'];

  const handleFavoriteClick = (symbol) => {
    if (!isLoggedIn) {
      window.location.href = "/oauth2/authorization/google";
      return;
    }
    if (!favorites[symbol]) {
      axios.post('/api/favorite', { coin: symbol })
        .then(() => {
          setFavorites(prev => ({ ...prev, [symbol]: true }));
        })
        .catch(error => console.error('Error adding favorite:', error));
    } else {
      axios.delete(`/api/favorite/${symbol}`)
        .then(() => {
          setFavorites(prev => {
            const newFav = { ...prev };
            delete newFav[symbol];
            return newFav;
          });
        })
        .catch(error => console.error('Error removing favorite:', error));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-3xl font-semibold mb-4">Live Crypto Prices</h2>
      {loading ? <div>Loading...</div> : (
        <>
          <div className="flex flex-col gap-4 w-full max-w-md">
            {coinOrder.map((symbol) => {
              const rawPrice = prices[symbol];
              const displayPrice =
                rawPrice && !isNaN(Number(rawPrice))
                  ? (symbol === 'DOGEUSDT'
                      ? Number(rawPrice).toFixed(5)
                      : Number(rawPrice).toFixed(2))
                  : rawPrice;
              return (
                <div key={symbol} className="flex items-center justify-between bg-gray-100 rounded-xl p-4 shadow-md">
                  <div className="flex items-center">
                    <button onClick={() => handleFavoriteClick(symbol)} className="mr-2 focus:outline-none">
                      {favorites[symbol] ? <span style={{ color: 'gold', fontSize: '1.5rem' }}>&#9733;</span>
                      : <span style={{ color: 'grey', fontSize: '1.5rem' }}>&#9734;</span>}
                    </button>
                    <span className="font-bold">{symbol}</span>
                  </div>
                  <div className="w-32 text-right font-mono">{displayPrice} USDT</div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const WhyBitcoin = () => (
  <div className="max-w-4xl mx-auto py-16 px-4">
    <h2 className="text-3xl font-bold mb-4">Why Bitcoin</h2>
    <p>Content explaining why Bitcoin is a promising asset will be added soon.</p>
  </div>
);

const JoinGoldenKimchi = () => (
  <div className="max-w-4xl mx-auto py-16 px-4">
    <h2 className="text-3xl font-bold mb-4">Join Golden Kimchi</h2>
    <p>Information on how to join Golden Kimchi will be provided later.</p>
  </div>
);

const App = () => (
  <Router>
    <ScrollToTop />
    <Navbar /> {/* Now Navbar imported explicitly */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/why-bitcoin" element={<WhyBitcoin />} />
      <Route path="/market-indicator" element={<ContrarianIndicator />} />
      <Route path="/join-golden-kimchi" element={<JoinGoldenKimchi />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
