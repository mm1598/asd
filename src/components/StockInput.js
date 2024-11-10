import React, { useState } from 'react';

const StockInput = ({ onAddStock }) => {
    const [stockName, setStockName] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (stockName) {
            setError(null); // Reset error
            await onAddStock(stockName.toUpperCase()); // Call the function passed from App
            setStockName(''); // Clear input field
        } else {
            setError('Please enter a stock name.');
        }
    };

    return (
        <div className="stock-input">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={stockName}
                    onChange={(e) => setStockName(e.target.value)}
                    placeholder="Enter stock name"
                />
                <button type="submit">Add Stock</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default StockInput;