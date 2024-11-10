import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const StockChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(chartRef.current, {
            type: 'line', 
            data: {
                labels: data.map(point => point.date), 
                datasets: [
                    {
                        label: 'Stock Price',
                        data: data.map(point => point.close), 
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
                        type: 'category', 
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

        
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [data]); 

    return <canvas ref={chartRef} />;
};

export default StockChart;
