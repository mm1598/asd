import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all necessary components, including scales
Chart.register(...registerables);

const StockChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        // Destroy the previous chart instance if it exists
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Create a new chart instance
        chartInstanceRef.current = new Chart(chartRef.current, {
            type: 'line', // Change to the desired chart type
            data: {
                labels: data.map(point => point.date), // Use 'date' for labels
                datasets: [
                    {
                        label: 'Stock Price',
                        data: data.map(point => point.close), // Use 'close' for stock prices
                        pointRadius: 0,
                        fill: false,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: 'category', // Ensure this scale type is registered
                        title: {
                            display: true,
                            text: 'Date',
                        },
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Price',
                        },
                    },
                },
            },
        });

        // Cleanup function to destroy the chart on unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data]); // Re-run effect when data changes

    return <canvas ref={chartRef} />;
};

export default StockChart;
