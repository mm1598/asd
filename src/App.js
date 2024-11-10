import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StockChart from './components/StockChart';
import StockInput from './components/StockInput';
import WishlistPage from './components/WishlistPage';
import './App.css';

const App = () => {
    const [chartData, setChartData] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [accuracyScore, setAccuracyScore] = useState(null);
    const [predictedPrice, setPredictedPrice] = useState(null);
    const [priceSentiment, setPriceSentiment] = useState({ message: '', sentimentColor: '' });
    const [showWishlist, setShowWishlist] = useState(false);

    const handleAddStock = async (stockName, addToWishlist) => {
        try {
            const response = await fetch(`https://hackfin-api.lookaway.dev/data/${stockName}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data for ${stockName}`);
            }
            const result = await response.json();
            const rawData = result.data;

            const formattedData = Object.entries(rawData).map(([date, values]) => ({
                date,
                close: values.close,
            }));

            setChartData(formattedData);

            const predictionResponse = await fetch(`https://hackfin-api.lookaway.dev/predict/${stockName}`);
            if (!predictionResponse.ok) {
                throw new Error(`Failed to fetch prediction data for ${stockName}`);
            }
            const predictionResult = await predictionResponse.json();

            const accuracy = predictionResult.accuracy * 100;
            const predictedPriceValue = predictionResult.prediction[0];

            setAccuracyScore(accuracy.toFixed(2));
            setPredictedPrice(predictedPriceValue.toFixed(2));

            // Set sentiment based on predictedPriceValue
            if (predictedPriceValue === 1) {
                setPriceSentiment({ message: 'Predicted: Bullish', sentimentColor: '#00ff00' }); // Brighter green for bullish
            } else if (predictedPriceValue === -1) {
                setPriceSentiment({ message: 'Predicted: Bearish', sentimentColor: '#ff0000' }); // Brighter red for bearish
            } else {
                setPriceSentiment({ message: 'Predicted: Neutral', sentimentColor: 'grey' });
            }

            if (addToWishlist) {
                setStocks(prevStocks => [
                    ...prevStocks,
                    { 
                        name: stockName, 
                        chartData: formattedData,
                        accuracyScore: accuracy.toFixed(2),
                        predictedPrice: predictedPriceValue.toFixed(2),
                        priceSentiment: priceSentiment
                    }
                ]);
            }
        } catch (error) {
            console.error("Error fetching stock data or prediction:", error);
        }
    };

    return (
        <Router>
            <div className="container">
                <div className="content">
                    <div className="text-section">
                        <h1>Stock Performance Predictor</h1>
                        <div className="input-section">
                            <StockInput onAddStock={handleAddStock} />
                            <button onClick={() => setShowWishlist(!showWishlist)}>
                                {showWishlist ? 'Hide Wishlist' : 'Show Wishlist'}
                            </button>
                        </div>
                        {showWishlist && (
                            <div className="wishlist-page">
                                <WishlistPage stocks={stocks} />
                            </div>
                        )}
                    </div>
                    <div className="chart-section">
                        {chartData.length > 0 ? (
                            <>
                                <StockChart data={chartData} />
                                <div className="predictions">
                                    {accuracyScore !== null && (
                                        <h3>Model Accuracy: {accuracyScore}%</h3>
                                    )}
                                    {predictedPrice !== null && (
                                        <h3 style={{ color: '#4bc0c0' }}>
                                            {priceSentiment.message.split(': ')[0]}: 
                                            <span style={{ color: priceSentiment.sentimentColor }}>
                                                {priceSentiment.message.split(': ')[1]}
                                            </span>
                                        </h3>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p>No chart data available. Please add a stock.</p>
                        )}
                    </div>
                </div>
                <Routes>
                    <Route path="/wishlist" element={<WishlistPage stocks={stocks} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;