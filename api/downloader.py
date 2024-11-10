from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame, TimeFrameUnit
from datetime import datetime, timedelta
from settings import * 
from populate import symbols
import pandas as pd
import numpy as np

client = StockHistoricalDataClient(
        config['ALPACA_KEY'],
        config['ALPACA_SECRET']
    )

def download_prereqs():
    for s in symbols:
        df = get_df(symbol=s)
        df.to_feather(f"data/{s}.feather")

def get_df(
    symbol: str,
    start: str=(datetime.now() - timedelta(days=18250)).strftime('%Y-%m-%d'), 
    end: str=datetime.now().strftime('%Y-%m-%d')
) -> pd.DataFrame:
    request_params = StockBarsRequest(
        symbol_or_symbols=symbol,  
        timeframe=TimeFrame(amount=4, unit=TimeFrameUnit.Hour),
        start=start,
        end=end,
    )

    bars = client.get_stock_bars(request_params)
    df = bars.df
    df.reset_index(inplace=True)
    df.set_index('timestamp', inplace=True)
    df.drop(columns=['symbol'], inplace=True)

    return df
