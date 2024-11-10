import React, { useState } from 'react';
import '../stockinput.css'; // Make sure this path is correct and matches your project structure

const StockInput = ({ onAddStock }) => {
  const [stockName, setStockName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (stockName) {
      setError(null); // Reset error
      await onAddStock(stockName.toUpperCase(), false); // Call the function to show the graph without adding to wishlist
      setStockName(''); // Clear input field
    } else {
      setError('Please enter a stock name.');
    }
  };

  const handleAddToWishlist = async () => {
    if (stockName) {
      await onAddStock(stockName.toUpperCase(), true); // Call the function to add to wishlist
      setStockName(''); // Clear input field
    } else {
      setError('Please enter a stock name.');
    }
  };

  return (
    <div className="stock-input">
      <form onSubmit={handleSubmit} className="form__group field">
        <div className="form__container">
          <input
            type="text"
            autoComplete="off"
            name="text"
            className="input" // Updated class name for the input style
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            placeholder="Enter stock name" // Updated placeholder
            required
          />
          <button type="button" className="button" onClick={handleAddToWishlist}>
            <span>Favorites</span> {/* Span inside the button for the animation */}
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default StockInput;
