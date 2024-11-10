import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StockChart from './components/StockChart'; // Ensure this path is correct
import StockInput from './components/StockInput'; // Import your StockInput component
import WishlistPage from './components/WishlistPage'; // Import your WishlistPage component
import './App.css'; // Import your custom CSS

const App = () => {
    const [chartData, setChartData] = useState([]);
    const [stocks, setStocks] = useState([]); // State for the watchlist
    const [accuracyScore, setAccuracyScore] = useState(null); // State for accuracy score
    const [predictedPrice, setPredictedPrice] = useState(null); // State for predicted price

    const handleAddStock = async (stockName) => {
        // Fetch the new stock data
        try {
            const response = await fetch(`https://hackfin-api.lookaway.dev/data/${stockName}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data for ${stockName}`);
            }
            const result = await response.json();
            const rawData = result.data;

            // Format the data for the chart
            const formattedData = Object.entries(rawData).map(([date, values]) => ({
                date,
                close: values.close,
            }));

            // Update chart data and stocks state
            setChartData(formattedData);
            setStocks(prevStocks => [...prevStocks, { name: stockName, chartData: formattedData }]);

            // Here you can implement your logic to calculate accuracy and predicted price
            setAccuracyScore(Math.random() * 100); // Replace with actual logic
            setPredictedPrice(Math.random() * 200); // Replace with actual logic
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
    };

    return (
        <Router>
            <div className="container">
                <div className="content">
                    <div className="text-section">
                        <h1>Stock Performance Predictor</h1>
                        <StockInput onAddStock={handleAddStock} />
                        {accuracyScore !== null && (
                            <h3>Model Accuracy: {accuracyScore.toFixed(2)}%</h3>
                        )}
                        {predictedPrice !== null && (
                            <h3>Predicted Price in 30 Days: ${predictedPrice.toFixed(2)}</h3>
                        )}
                        <Link to="/wishlist">View Wishlist</Link>
                    </div>
                    <div className="chart-section">
                        {chartData.length > 0 ? (
                            <StockChart data={chartData} />
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