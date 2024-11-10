import React, { useState } from 'react';
import '../stockinput.css'; 

const StockInput = ({ onAddStock }) => {
  const [stockName, setStockName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (stockName) {
      setError(null); 
      await onAddStock(stockName.toUpperCase(), false); 
      setStockName(''); 
    } else {
      setError('Please enter a stock name.');
    }
  };

  const handleAddToWishlist = async () => {
    if (stockName) {
      await onAddStock(stockName.toUpperCase(), true); 
      setStockName(''); 
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
            className="input"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            placeholder="Enter stock name" 
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
