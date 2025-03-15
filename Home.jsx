import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';

const Home = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch latest prices from backend.
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

  // Check if user is logged in.
  const checkLoginStatus = async () => {
    try {
      const { data } = await axios.get('/api/user/info');
      setIsLoggedIn(!!(data && data.email));
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  // Load user's favorite coins from backend.
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

  const coinOrder = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'DOGEUSDT','XRPUSDT'];

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

  const coinOrder = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'DOGEUSDT','XRPUSDT'];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex flex-col items-center justify-center py-16">
        <h2 className="text-3xl font-semibold mb-4">Live Crypto Prices</h2>
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
              <div key={symbol} className="flex items-center justify-between bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-center">
                  <button onClick={() => handleFavoriteClick(symbol)} className="mr-2 focus:outline-none">
                    {favorites[symbol] ? (
                      <span style={{ color: 'gold', fontSize: '1.5rem' }}>&#9733;</span>
                    ) : (
                      <span style={{ color: 'grey', fontSize: '1.5rem' }}>&#9734;</span>
                    )}
                  </button>
                  <span className="font-bold">{symbol}</span>
                </div>
                <div className="w-32 text-right font-mono">{displayPrice} USDT</div>
              </div>
            );
          })}
        </div>

        {/* User's Favorite Coins Section */}
        <div className="mt-8 w-full max-w-md">
          <h3 className="text-2xl font-semibold mb-4">Your Favorite Coins</h3>
          {Object.keys(favorites).length === 0 ? (
            <p className="text-gray-600">You have no favorite coins yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {coinOrder.filter(symbol => favorites[symbol]).map(symbol => {
                const rawPrice = prices[symbol];
                const displayPrice =
                  rawPrice && !isNaN(Number(rawPrice))
                    ? (symbol === 'DOGEUSDT'
                        ? Number(rawPrice).toFixed(5)
                        : Number(rawPrice).toFixed(2))
                    : rawPrice;

                return (
                  <div key={symbol} className="flex items-center justify-between bg-green-100 rounded-xl p-4 shadow-md">
                    <span className="font-bold">{symbol}</span>
                    <div className="font-mono">{displayPrice} USDT</div>
                  </div>
                );
              })}
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
