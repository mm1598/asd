import psycopg2
import pandas as pd
import os
from sqlalchemy import create_engine, text
from datetime import datetime, timedelta
from downloader import *
from datetime import datetime, timedelta

symbols = [
    "AAPL", 
    "MSFT", 
    "GOOGL", 
    "AMZN", 
    "FB", 
    "TSLA"
]

#
# DB_HOST = "0.0.0.0"
# DB_PORT = "5432"
# DB_NAME = os.environ.get("POSTGRES_DB")
# DB_USER = os.environ.get("POSTGRES_USER")
# DB_PASSWORD = os.environ.get("POSTGRES_PASSWORD")
#
# conn = psycopg2.connect(
#     host=DB_HOST,
#     port=DB_PORT,
#     dbname="postgres",
#     user=DB_USER,
#     password=DB_PASSWORD
# )
# conn.autocommit = True  
# cur = conn.cursor()
#
# cur.execute(f"SELECT 1 FROM pg_database WHERE datname = %s", (DB_NAME,))
# db_exists = cur.fetchone() is not None
#
# if not db_exists:
#     cur.execute(f"CREATE DATABASE {DB_NAME}")
#     print(f"Database '{DB_NAME}' created successfully.")
# else:
#     print(f"Database '{DB_NAME}' already exists.")
#
# cur.close()
# conn.close()
#
# engine = create_engine(f'postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}')
#
# with engine.connect() as connection:
#     for s in symbols:
#         create_table_query = f"""
#         CREATE TABLE IF NOT EXISTS market_data_{s} (
#             time TIMESTAMPTZ NOT NULL,
#             open DOUBLE PRECISION,
#             high DOUBLE PRECISION,
#             low DOUBLE PRECISION,
#             close DOUBLE PRECISION,
#             volume BIGINT
#         );
#         """
#     connection.execute(text(create_table_query))
#     print("Table 'market_data' is ready.")
#
#     for s in symbols:
#         df = get_df(symbol=s)
#
#         index = [datetime.utcnow() - timedelta(minutes=i * 15) for i in range(4)]
#         df = pd.DataFrame(df, index=index)
#         df.index.name = "time"  
#
#         result = connection.execute(text("SELECT COUNT(*) FROM market_data"))
#         row_count = result.scalar()
#
#         if row_count == 0:
#             df.to_sql(f'market_data_{s}', engine, if_exists='append', index=True, index_label='time')
#             print("Data inserted successfully.")
#         else:
#             print(f"Table 'market_data_{s}' already has data, skipping insertion.")
