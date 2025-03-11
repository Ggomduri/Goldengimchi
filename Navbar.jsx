import React, { useState, useEffect } from 'react'; // This import was missing previously.
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [user, setUser] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const { data } = await axios.get('/api/user/info');
      if (data && data.email) {
        let username = data.name || data.email.split('@')[0];
        setUser({ ...data, username });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    const interval = setInterval(fetchUserInfo, 5000);
    return () => clearInterval(interval);
  }, []);

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
        <div>
          {user ? (
            <>
              <span className="text-gray-700">Welcome, {user.username}</span>
              <a href="/logout" className="text-blue-500 hover:text-blue-700 ml-4">Logout</a>
            </>
          ) : (
            <button
              onClick={() => (window.location.href = "/oauth2/authorization/google")}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
