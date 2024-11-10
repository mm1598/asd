// src/components/WishlistPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import StockChart from './StockChart'; // Import your StockChart component

const WishlistPage = ({ stocks }) => {
    return (
        <div className="wishlist-page" style={{ overflowY: 'scroll', height: '100vh' }}>
            <h1>Your Wishlist</h1>
            <Link to="/">Back to Home</Link>
            <div className="wishlist-items">
                {stocks.map((stock, index) => (
                    <div key={index} className="wishlist-item">
                        <h2>{stock.name}</h2>
                        <StockChart data={stock.chartData} /> {/* Assuming each stock has chartData */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;