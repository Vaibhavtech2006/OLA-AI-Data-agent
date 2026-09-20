import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Create the folder structure
os.makedirs('data/extract', exist_ok=True)

# Generate 100 days of dummy stock data
dates = [datetime.today() - timedelta(days=x) for x in range(100)]
prices = np.linspace(100, 150, 100) + np.random.normal(0, 5, 100)

# Save to CSV
df = pd.DataFrame({'date': dates, 'price': prices})
df = df.sort_values('date')
df.to_csv('data/extract/historical_prices.csv', index=False)

print("Mock data successfully created at data/extract/historical_prices.csv!")