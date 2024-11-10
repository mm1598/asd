// src/Watchlist.js
import React from 'react';

const Watchlist = ({ stocks }) => {
  return (
    <div>
      <h2>Watchlist</h2>
      <ul>
        {stocks.map((stock, index) => (
          <li key={index}>{stock.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;