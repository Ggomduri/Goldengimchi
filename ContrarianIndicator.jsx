import React from 'react';
import GoogleTrendsEmbed from '../components/GoogleTrendsEmbed';

const ContrarianIndicator = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-4 text-center">Market Indicator</h2>
      <GoogleTrendsEmbed />
    </div>
  );
};

export default ContrarianIndicator;
