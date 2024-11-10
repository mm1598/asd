import React from 'react';

const PredictionCard = ({ prediction, ticker }) => {
  return (
    <div className="prediction-card">
      <h2>Prediction for {ticker}</h2>
      <p>Predicted Change: {prediction.change}%</p>
      <p>Confidence Level: {prediction.confidence}%</p>
      {/* Add animations for this card */}
    </div>
  );
};

export default PredictionCard;