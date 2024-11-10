# from cuml.ensemble import RandomForestClassifier
# from cuml.svm import SVC
# from cuml.neural_network import MLPClassifier, MLPRegressor
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.neural_network import MLPClassifier, MLPRegressor 
from sklearn.metrics import accuracy_score
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import TimeSeriesSplit
import pandas as pd
import numpy as np
import pandas_ta as ta

def get_features(df: pd.DataFrame) -> pd.DataFrame:
    rolling_bar_lookback = 720 # 12M lookback # Was 1440

    # Prereqs
    # macd = ta.macd(df['close'], fast=12, slow=26, signal=9)
    # df['macd'] = macd['MACD_12_26_9']
    # df['macd_signal'] = macd['MACDs_12_26_9']
    # df['macd_hist'] = macd['MACDh_12_26_9']
    df['rsi'] = ta.rsi(df['close'], timeperiod=14)
    df['rolling_high_6M'] = df['close'].rolling(int(rolling_bar_lookback/2)).max()
    df['rolling_low_6M'] = df['close'].rolling(int(rolling_bar_lookback/2)).min()
    df['rolling_high_3M'] = df['close'].rolling(int(rolling_bar_lookback/4)).max()
    df['rolling_low_3M'] = df['close'].rolling(int(rolling_bar_lookback/4)).min()
    df['rolling_high_1M'] = df['close'].rolling(int(rolling_bar_lookback/12)).max()
    df['rolling_low_1M'] = df['close'].rolling(int(rolling_bar_lookback/12)).min()
    df['rolling_high_1W'] = df['close'].rolling(int(rolling_bar_lookback/48)).max()
    df['rolling_low_1W'] = df['close'].rolling(int(rolling_bar_lookback/48)).min()
    df['atr_30'] = ta.atr(df['high'], df['low'], df['close'], timeperiod=14)
    df['atr_7'] = ta.atr(df['high'], df['low'], df['close'], timeperiod=7)
    df['sma_200'] = df['close'].rolling(200).mean()
    df['sma_50'] = df['close'].rolling(50).mean()

    # Features
    # df['feat_macd_sent'] = np.where(
    #     (df['macd'] > df['macd_signal']), 
    #     1, 
    #     np.where(
    #         (df['macd'] < df['macd_signal']),
    #         -1,
    #         0
    #     )
    # )
    df['feat_rsi'] = df['rsi'] / df['rsi'].rolling(90).max()
    df['feat_dist_to_rolling_high_6M'] = (df['close'] - df['rolling_high_6M']) / df['rolling_high_6M'].rolling(3).max() 
    df['feat_dist_to_rolling_low_6M'] = (df['close'] - df['rolling_low_6M']) / df['rolling_low_6M'].rolling(3).max()
    df['feat_dist_to_rolling_high_3M'] = (df['close'] - df['rolling_high_3M']) / df['rolling_high_3M'].rolling(3).max()
    df['feat_dist_to_rolling_low_3M'] = (df['close'] - df['rolling_low_3M']) / df['rolling_low_3M'].rolling(3).max()
    df['feat_dist_to_rolling_high_1M'] = (df['close'] - df['rolling_high_1M']) / df['rolling_high_1M'].rolling(3).max()
    df['feat_dist_to_rolling_low_1M'] = (df['close'] - df['rolling_low_1M']) / df['rolling_low_1M'].rolling(3).max()
    df['feat_dist_to_rolling_high_1W'] = (df['close'] - df['rolling_high_1W']) / df['rolling_high_1W'].rolling(3).max()
    df['feat_dist_to_rolling_low_1W'] = (df['close'] - df['rolling_low_1W']) / df['rolling_low_1W'].rolling(3).max()
    df['feat_atr_30'] = df['atr_30'] / df['atr_30'].rolling(90).max()
    df['feat_atr_7'] = df['atr_7'] / df['atr_7'].rolling(21).max()
    df['feat_dist_to_sma_200'] = (df['close'] - df['sma_200']) / df['sma_200']
    df['feat_dist_to_sma_50'] = (df['close'] - df['sma_50']) / df['sma_50']
    df['feat_volume'] = df['volume'] / df['volume'].rolling(21).max()

    # List of features
    features = []
    for i in df.columns:
        if 'feat' in i:
            features.append(i)

    return df[features]

def get_target(df: pd.DataFrame) -> pd.Series:
    # Target 
    lookahead = 120
    pct = 0.015

    df['target'] = np.where(
        df['close'].shift(-lookahead).rolling(lookahead).max() >= df['close'] * (1.0 + pct),
        1, # Bullish move in next lookahead 4 hours
        np.where(
            df['close'].shift(-lookahead).rolling(lookahead).min() <= df['close'] * (1.0 - pct),
            -1, # Bearish move in next lookahead 4 hours  
            0
        )
    )

    return df['target']
    
# def train(df: pd.DataFrame, n_splits: int = 5):
#     features = get_features(df)
#     target = get_target(df)
#
#     ft_t = features
#     ft_t['target'] = target
#     ft_t = ft_t.dropna()
#
#     # model = SVC(kernel='rbf', n_jobs=-1)
#     # model = MLPClassifier(hidden_layer_sizes=(100, 100, 100), max_iter=1000) # Sacrifce accuracy for speed
#     # model = RandomForestClassifier(n_estimators=1000, max_depth=4, n_jobs=-1)
#     model = RandomForestRegressor(n_estimators=1000, max_depth=4, n_jobs=-1)
#
#     tscv = TimeSeriesSplit(n_splits=n_splits)
#     accuracies = []
#
#     for train_index, test_index in tscv.split(ft_t):
#         train_x, test_x = ft_t.iloc[train_index], ft_t.iloc[test_index]
#         train_y, test_y = train_x.pop('target'), test_x.pop('target')
#
#         model.fit(train_x, train_y)
#         pred = model.predict(test_x)
#         accuracy = accuracy_score(test_y, pred)
#         accuracies.append(accuracy)
#
#     return {
#         'model': model,
#         'accuracies': accuracies,
#         'accuracy': sum(accuracies) / len(accuracies) # Mean accuracy
#     }

def train(df: pd.DataFrame, n_splits: int = 5):
    features = get_features(df)
    target = get_target(df)
    
    ft_t = features
    ft_t['target'] = target
    ft_t = ft_t.dropna()

    # model = SVC(kernel='rbf', n_jobs=-1)
    # model = MLPClassifier(hidden_layer_sizes=(100, 100, 100), max_iter=1000) # Sacrifce accuracy for speed
    model = RandomForestClassifier(n_estimators=1000, max_depth=4, n_jobs=-1)

    tscv = TimeSeriesSplit(n_splits=n_splits)
    accuracies = []

    for train_index, test_index in tscv.split(ft_t):
        train_x, test_x = ft_t.iloc[train_index], ft_t.iloc[test_index]
        train_y, test_y = train_x.pop('target'), test_x.pop('target')
        
        model.fit(train_x, train_y)
        pred = model.predict(test_x)
        accuracy = accuracy_score(test_y, pred)
        accuracies.append(accuracy)

    return {
        'model': model,
        'accuracies': accuracies,
        'accuracy': sum(accuracies) / len(accuracies) # Mean accuracy
    }
