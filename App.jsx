import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ContrarianIndicator from './ContrarianIndicator';

// ScrollToTop: Ensures the page scrolls to the top when navigating
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

const Navbar = () => {
  const [user, setUser] = useState(null);

  // Fetch current user info from the back-end.
  const fetchUserInfo = async () => {
    try {
      const { data } = await axios.get('/api/user/info');
      if (data && data.email) {
        let username = data.name;
        if (!username && data.email) {
          username = data.email.split('@')[0];
        }
        setUser({ ...data, username });
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    const interval = setInterval(fetchUserInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  // Redirect the entire window to the Google login page.
  const handleLogin = () => {
    window.location.href = "/oauth2/authorization/google";
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Golden Kimchi</h1>
          <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
          <Link to="/market-indicator" className="text-blue-500 hover:text-blue-700">Market Indicator</Link>
          <Link to="/why-bitcoin" className="text-blue-500 hover:text-blue-700">Why Bitcoin</Link>
          <Link to="/join-golden-kimchi" className="text-blue-500 hover:text-blue-700">Join Golden Kimchi</Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">Welcome, {user.username}</span>
              <a href="/logout" className="text-blue-500 hover:text-blue-700">Logout</a>
            </>
          ) : (
            <button onClick={handleLogin} className="bg-blue-500 text-white px-3 py-1 rounded">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const Home = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  // favorites is an object keyed by coin symbol; true means the coin is a favorite.
  const [favorites, setFavorites] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch coin prices from the backend.
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

  // Check login status using the same /api/user/info endpoint.
  const checkLoginStatus = async () => {
    try {
      const { data } = await axios.get('/api/user/info');
      setIsLoggedIn(!!(data && data.email));
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  // Load the user's saved favorites from the backend.
  const loadFavorites = async () => {
    try {
      const { data } = await axios.get('/api/favorite');
      // data is a list of FavoriteCoin objects (each with coinSymbol).
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
    // Initial fetch and login check.
    fetchPrices();
    checkLoginStatus();
    const interval = setInterval(() => {
      fetchPrices();
      checkLoginStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // When login status becomes true, load the saved favorites.
  useEffect(() => {
    if (isLoggedIn) {
      loadFavorites();
    }
  }, [isLoggedIn]);

  const coinOrder = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'DOGEUSDT'];

  // Handle the favorite button click.
  const handleFavoriteClick = (symbol) => {
    if (!isLoggedIn) {
      // If not logged in, redirect to the Google login page.
      window.location.href = "/oauth2/authorization/google";
      return;
    }
    if (!favorites[symbol]) {
      // Call the backend to add the coin to favorites.
      axios.post('/api/favorite', { coin: symbol })
        .then(() => {
          // Update the local favorites state.
          setFavorites(prev => ({ ...prev, [symbol]: true }));
        })
        .catch(error => console.error('Error adding favorite:', error));
    } else {
      // Call the backend to remove the coin from favorites.
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
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* List of all coins with favorite toggles */}
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
          {/* Favorite Coins Section – displays only those coins the user has favorited. */}
          <div className="mt-8 w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-2">Your Favorite Coins</h3>
            {Object.keys(favorites).length === 0 ? (
              <p className="text-gray-600">You have no favorite coins yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {coinOrder.filter(symbol => favorites[symbol]).map(symbol => {
                  const rawPrice = prices[symbol];
                  const displayPrice = rawPrice && !isNaN(Number(rawPrice))
                    ? (symbol === 'DOGEUSDT'
                        ? Number(rawPrice).toFixed(5)
                        : Number(rawPrice).toFixed(2))
                    : rawPrice;
                  return (
                    <div key={symbol} className="flex items-center justify-between bg-green-100 rounded-xl p-4 shadow-md">
                      <div className="flex items-center">
                        <span className="font-bold">{symbol}</span>
                      </div>
                      <div className="w-32 text-right font-mono">{displayPrice} USDT</div>
                    </div>
                  );
                })}
              </div>
            )}
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

const NotFound = () => (
  <div className="max-w-4xl mx-auto py-16 px-4 text-center">
    <h2 className="text-3xl font-bold mb-4 text-red-600">404 - Page Not Found</h2>
    <Link to="/" className="text-blue-500 hover:text-blue-700">Go back to Home</Link>
  </div>
);

const App = () => (
  <Router>
    <ScrollToTop />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/why-bitcoin" element={<WhyBitcoin />} />
      <Route path="/market-indicator" element={<ContrarianIndicator />} />
      <Route path="/join-golden-kimchi" element={<JoinGoldenKimchi />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
