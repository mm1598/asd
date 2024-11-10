from flask import Flask, jsonify
from train import *
from downloader import *
from glob import glob
from populate import symbols
import os
# import populate

app = Flask(__name__)
models = {}
dfs = {}

# If no data
if not glob('data/*.feather'):
    print('Downloading data...')
    download_prereqs()

# Train before serving
for g in glob('data/*.feather'):
    stock = g.split('/')[-1].split('.')[0]
    print(f'Training {stock}... Total: {len(glob("data/*.feather"))}')
    df = pd.read_feather(g)
    dfs[stock] = df
    models[stock] = train(df)
    
@app.route('/')
def index():
    return jsonify({'msg': 'Working'})

@app.route('/data/<string:stock>')
def get_data(stock: str):
    start = (datetime.now() - timedelta(days=120)).strftime('%Y-%m-%d')
    end = datetime.now().strftime('%Y-%m-%d') 
    df = get_df(
        symbol=stock, 
        start=start, 
        end=end
    )
    df.index = df.index.strftime('%Y-%m-%d-%H')

    response = jsonify({
        'stock': stock,
        'data': df.to_dict('index')
    })    
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/predict/<string:stock>')
def predict_stock(stock: str):
    models_list = list(models.keys())
    start = (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d')
    end = datetime.now().strftime('%Y-%m-%d') 
    df = get_df(symbol=stock, start=start, end=end)

    if os.path.exists(f'data/{stock}.feather') and not models.get(stock) and dfs.get(stock) is None:
        print(f'Using disk cached data for {stock}')
        df = pd.read_feather(f'data/{stock}.feather')
        models[stock] = train(df)

    elif not models.get(stock) and not (dfs.get(stock) is None):
        print(f'Using memory cached data for {stock}')
        df = dfs[stock]
        models[stock] = train(df)

    elif not models.get(stock):
        print(f'Downloading data for {stock}... this may take a while')
        df = get_df(symbol=stock)
        df.to_feather(f'data/{stock}.feather')
        models[stock] = train(df) 
    
    df_c = df.copy()
    df = df[:-2] # Remove last two candles to avoid putting in training

    # Get last candle in df
    features = get_features(df)[-1:]
    pred = models[stock]['model'].predict(features)

    response = jsonify({
        'stock': stock,
        'prediction': pred.tolist(),
        'accuracy': models[stock]['accuracy'],
    })

    return response

app.run(host='0.0.0.0', port=5000)

# Clean up models -- cuML seems to not like me 
# for key in models.keys():
#     models[key]['model'] = None
#     del models[key]
