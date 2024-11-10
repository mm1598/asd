import React, { useState } from 'react';
import '../stockinput.css'; // Make sure this path is correct and matches your project structure

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
      <form onSubmit={handleSubmit} className="form__group field">
        <div className="form__container">
          {/* Input element with updated class name */}
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
          {/* Button element with updated class name */}
          <button type="submit" className="button">
            <span>Add Stock</span> {/* Span inside the button for the animation */}
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default StockInput;
