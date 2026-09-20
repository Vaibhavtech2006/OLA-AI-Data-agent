import base64
import io
import json
import os
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from prophet import Prophet

class ForecastingTools:
    def _load(self, file_path: str) -> pd.DataFrame:
        if file_path.endswith(".csv"):
            return pd.read_csv(file_path)
        elif file_path.endswith(".json"):
            return pd.read_json(file_path, lines=True)
        elif file_path.endswith(".parquet"):
            return pd.read_parquet(file_path)
        raise ValueError(f"Unsupported file format: {file_path}")

    def forecast_time_series(self, file_path: str, time_column: str, target_column: str, periods: int = 30) -> str:
        """
        Fits a Prophet model to time-series data and forecasts future values.
        Returns a JSON payload containing the analysis summary and a base64 encoded chart.
        """
        df = self._load(file_path)

        if time_column not in df.columns or target_column not in df.columns:
            return json.dumps({"message": f"Error: Columns '{time_column}' or '{target_column}' not found in dataset."})

        # Prophet requires columns to be named 'ds' and 'y'
        prophet_df = df[[time_column, target_column]].copy()
        prophet_df.columns = ['ds', 'y']
        prophet_df['ds'] = pd.to_datetime(prophet_df['ds'], errors='coerce')
        prophet_df = prophet_df.dropna().sort_values('ds')

        model = Prophet(yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False)
        model.fit(prophet_df)

        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)

        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Plot historical data
        ax.plot(prophet_df['ds'], prophet_df['y'], 'k.', label='Historical Data', alpha=0.6)
        
        # Plot forecast and confidence intervals
        ax.plot(forecast['ds'], forecast['yhat'], ls='-', c='#4F46E5', label='Forecast')
        ax.fill_between(forecast['ds'], forecast['yhat_lower'], forecast['yhat_upper'], color='#4F46E5', alpha=0.2, label='80% Confidence Interval')
        
        ax.set_title(f"Forecast for {target_column} ({periods} periods ahead)")
        ax.set_xlabel("Time")
        ax.set_ylabel(target_column)
        ax.legend()
        ax.grid(True, alpha=0.3)
        fig.tight_layout()

        os.makedirs("data/forecasts", exist_ok=True)
        output_path = os.path.join("data/forecasts", f"forecast_{target_column}.csv")
        forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods).to_csv(output_path, index=False)

        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=120)
        plt.close(fig)
        chart_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        summary_metrics = {
            "forecast_horizon": periods,
            "final_predicted_value": round(float(forecast['yhat'].iloc[-1]), 2),
            "trend_direction": "upward" if forecast['trend'].iloc[-1] > forecast['trend'].iloc[-periods] else "downward"
        }

        return json.dumps({
            "message": f"Successfully forecasted {periods} periods for '{target_column}'. The general trend is {summary_metrics['trend_direction']}. Forecast data saved to {output_path}.",
            "chart_base64": chart_base64,
            "output_path": output_path
        })