// src/components/WishlistPage.js
import React from 'react';
import StockChart from './StockChart'; // Import your StockChart component
const WishlistPage = ({ stocks }) => {
    return (
        <div>
            <h1>Favorites</h1>
            {stocks.length === 0 ? (
                <p>No stocks in your favorites.</p>
            ) : (
                stocks.map((stock, index) => (
                    <div key={index} className="favorite-item">
                        <h2>{stock.name}</h2>
                        <p>Model Accuracy: {stock.accuracyScore}%</p>
                        <StockChart data={stock.chartData} /> {/* Render the chart for each stock */}
                        {stock.priceSentiment && (
                            <h3 style={{ color: stock.priceSentiment.color }}>
                                {stock.priceSentiment.message}
                            </h3>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default WishlistPage;