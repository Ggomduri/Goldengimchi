import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

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

  // Open a pop-up window for Google login and refresh when closed.
  const handleLogin = () => {
    const loginWindow = window.open("/oauth2/authorization/google", "Login", "width=500,height=600");
    const timer = setInterval(() => {
      if (loginWindow.closed) {
        clearInterval(timer);
        window.location.reload();
      }
    }, 1000);
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Golden Kimchi</h1>
          <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
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

// Home component: Displays live prices and favorite functionality for coins
const Home = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({}); // e.g., { "BTCUSDT": true, ... }
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch prices from the back-end.
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

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const coinOrder = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'DOGEUSDT'];

  // Handle star click for favorite coin functionality.
  const handleFavoriteClick = (symbol) => {
    if (!isLoggedIn) {
      const loginWindow = window.open('http://localhost:8080/login/google', '_blank', 'width=500,height=600');
      setTimeout(() => {
        setIsLoggedIn(true);
        loginWindow.close();
        axios.post('/api/favorite', { coin: symbol })
          .then(() => {
            setFavorites(prev => ({ ...prev, [symbol]: true }));
          })
          .catch(error => console.error('Error adding favorite:', error));
      }, 5000);
    } else {
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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-3xl font-semibold mb-4">Live Crypto Prices</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4 w-full max-w-md">
          {coinOrder.map((symbol) => {
            const rawPrice = prices[symbol];
            const displayPrice =
              rawPrice && !isNaN(Number(rawPrice))
                ? symbol === 'DOGEUSDT'
                  ? Number(rawPrice).toFixed(5)
                  : Number(rawPrice).toFixed(2)
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
      )}
    </div>
  );
};

// Why Bitcoin page placeholder.
const WhyBitcoin = () => (
  <div className="max-w-4xl mx-auto py-16 px-4">
    <h2 className="text-3xl font-bold mb-4">Why Bitcoin</h2>
    <p>Content explaining why Bitcoin is a promising asset will be added soon.</p>
  </div>
);

// Join Golden Kimchi page placeholder.
const JoinGoldenKimchi = () => (
  <div className="max-w-4xl mx-auto py-16 px-4">
    <h2 className="text-3xl font-bold mb-4">Join Golden Kimchi</h2>
    <p>Information on how to join Golden Kimchi will be provided later.</p>
  </div>
);

// Fallback component for unmatched routes.
const NotFound = () => (
  <div className="max-w-4xl mx-auto py-16 px-4 text-center">
    <h2 className="text-3xl font-bold mb-4 text-red-600">404 - Page Not Found</h2>
    <Link to="/" className="text-blue-500 hover:text-blue-700">Go back to Home</Link>
  </div>
);

// Main App component: Handles routing and global components.
const App = () => (
  <Router>
    <ScrollToTop />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/why-bitcoin" element={<WhyBitcoin />} />
      <Route path="/join-golden-kimchi" element={<JoinGoldenKimchi />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;


/*
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

// ScrollToTop: Ensures the page scrolls to the top when navigating
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};
// Navbar component with login/logout logic
const Navbar = () => {
  const [user, setUser] = useState(null);

// Fetch current user info from the back-end.
  const fetchUserInfo = async () => {
    try {
      const { data } = await axios.get('/api/user/info');
      // If data is empty, no user is logged in.
      if (data && data.email) {
        // Use the "name" field if available; otherwise, use the email prefix.
        let username = data.name;
        if (!username && data.email) {
          username = data.email.split('@')[0];
        }
        setUser({ ...data, username });
      } else {
        setUser(null);
      }
    } catch (error) {
      // If the call fails (e.g. not logged in), clear user info.
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    // Poll for user info every 5 seconds in case login happens in a pop-up.
    const interval = setInterval(fetchUserInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  // Open a pop-up window for Google login.
  const handleLogin = () => {
    window.open("/oauth2/authorization/google", "Login", "width=500,height=600");
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Golden Kimchi</h1>
          <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
          <Link to="/why-bitcoin" className="text-blue-500 hover:text-blue-700">Why Bitcoin</Link>
          <Link to="/join-golden-kimchi" className="text-blue-500 hover:text-blue-700">Join Golden Kimchi</Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">Welcome, {user.username}</span>
              { */
/* Logout is handled via Spring Security's /logout endpoint *//*
}
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

// Navbar component for navigation
const Navbar = () => (
  <nav className="bg-white shadow-md py-4">
    <div className="container mx-auto flex justify-between items-center px-6">
      <h1 className="text-2xl font-bold text-gray-800">Golden Kimchi</h1>
      <div className="space-x-4">
        <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
        <Link to="/why-bitcoin" className="text-blue-500 hover:text-blue-700">Why Bitcoin</Link>
        <Link to="/join-golden-kimchi" className="text-blue-500 hover:text-blue-700">Join Golden Kimchi</Link>
      </div>
    </div>
  </nav>
);

// Home component: Displays live prices and favorite functionality for coins
const Home = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({}); // { "BTCUSDT": true, ... }
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch prices from backend
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

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  // Define coin order: BTCUSDT appears first
  const coinOrder = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'DOGEUSDT'];

  // Handle star click
  const handleFavoriteClick = (symbol) => {
    if (!isLoggedIn) {
      // For non-logged in users: open Google log-in in a new window.
      // Replace the URL below with your actual Google log-in endpoint.
      const loginWindow = window.open('http://localhost:8080/login/google', '_blank', 'width=500,height=600');
      // Simulate a login process – in practice, you’d listen for a login success event.
      setTimeout(() => {
        setIsLoggedIn(true);
        loginWindow.close();
        // After login, add the coin to favorites
        axios.post('/api/favorite', { coin: symbol })
          .then(() => {
            setFavorites(prev => ({ ...prev, [symbol]: true }));
          })
          .catch(error => console.error('Error adding favorite:', error));
      }, 5000);
    } else {
      // If logged in, toggle favorite state
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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-3xl font-semibold mb-4">Live Crypto Prices</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        // One column layout (4 rows)
        <div className="flex flex-col gap-4 w-full max-w-md">
          {coinOrder.map((symbol) => {
            const rawPrice = prices[symbol];
            const displayPrice =
              rawPrice && !isNaN(Number(rawPrice))
                ? symbol === 'DOGEUSDT'
                  ? Number(rawPrice).toFixed(5)
                  : Number(rawPrice).toFixed(2)
                : rawPrice;
            return (
              <div
                key={symbol}
                className="flex items-center justify-between bg-gray-100 rounded-xl p-4 shadow-md"
              >
                <div className="flex items-center">
                  { */
/* Star icon: grey (unfavorited) or colored (favorited) *//*
}
                  <button onClick={() => handleFavoriteClick(symbol)} className="mr-2 focus:outline-none">
                    {favorites[symbol] ? (
                      <span style={{ color: 'gold', fontSize: '1.5rem' }}>&#9733;</span>   */
/* Filled star *//*

                    ) : (
                      <span style={{ color: 'grey', fontSize: '1.5rem' }}>&#9734;</span>   */
/* Outline star *//*

                    )}
                  </button>
                  <span className="font-bold">{symbol}</span>
                </div>
                { */
/* Fixed width for price display *//*
}
                <div className="w-32 text-right font-mono">{displayPrice} USDT</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Why Bitcoin page placeholder
const WhyBitcoin = () => (
  <div className="max-w-4xl mx-auto py-16 px-4">
    <h2 className="text-3xl font-bold mb-4">Why Bitcoin</h2>
    <p>Content explaining why Bitcoin is a promising asset will be added soon.</p>
  </div>
);

// Join Golden Kimchi page placeholder
const JoinGoldenKimchi = () => (
  <div className="max-w-4xl mx-auto py-16 px-4">
    <h2 className="text-3xl font-bold mb-4">Join Golden Kimchi</h2>
    <p>Information on how to join Golden Kimchi will be provided later.</p>
  </div>
);

// Fallback component for unmatched routes
const NotFound = () => (
  <div className="max-w-4xl mx-auto py-16 px-4 text-center">
    <h2 className="text-3xl font-bold mb-4 text-red-600">404 - Page Not Found</h2>
    <Link to="/" className="text-blue-500 hover:text-blue-700">Go back to Home</Link>
  </div>
);

// Main App component: Handles routing and global components
const App = () => (
  <Router>
    <ScrollToTop />
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/why-bitcoin" element={<WhyBitcoin />} />
      <Route path="/join-golden-kimchi" element={<JoinGoldenKimchi />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
 */
