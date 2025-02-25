import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContrarianIndicator = () => {
  const [data, setData] = useState({ bullish: {}, bearish: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await axios.get('/api/contrarian-indicator');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching contrarian indicators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
  }, []);

  if (loading) {
    return <div>Loading contrarian indicators...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Contrarian Indicators</h2>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold">Bullish Mentions</h3>
        <ul className="list-disc pl-5">
          {Object.entries(data.bullish).map(([keyword, count]) => (
            <li key={keyword} className="text-lg">
              {keyword}: {count}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-2xl font-semibold">Bearish Mentions</h3>
        <ul className="list-disc pl-5">
          {Object.entries(data.bearish).map(([keyword, count]) => (
            <li key={keyword} className="text-lg">
              {keyword}: {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContrarianIndicator;