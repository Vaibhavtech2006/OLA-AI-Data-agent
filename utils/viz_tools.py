import base64
import io
import json
import os
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

class VizTools:
    def _load(self, file_path: str) -> pd.DataFrame:
        if file_path.endswith(".csv"): return pd.read_csv(file_path)
        elif file_path.endswith(".parquet"): return pd.read_parquet(file_path)
        return pd.read_json(file_path, lines=True)

    def generate_chart(self, file_path: str, chart_type: str, x_column: str, y_column: str = None, title: str = "") -> str:
        df = self._load(file_path)
        os.makedirs("data/charts", exist_ok=True)
        fig, ax = plt.subplots(figsize=(8, 5))
        
        if chart_type == "bar":
            if y_column: df.groupby(x_column)[y_column].sum().plot(kind="bar", ax=ax)
            else: df[x_column].value_counts().plot(kind="bar", ax=ax)
        elif chart_type == "line": df.plot(x=x_column, y=y_column, kind="line", ax=ax)
        elif chart_type == "scatter": df.plot(x=x_column, y=y_column, kind="scatter", ax=ax)
        elif chart_type == "hist": df[x_column].plot(kind="hist", ax=ax)
        elif chart_type == "pie": df[x_column].value_counts().plot(kind="pie", ax=ax, autopct="%1.1f%%")
        
        ax.set_title(title or f"{chart_type.title()} of {x_column}")
        fig.tight_layout()
        
        output_path = os.path.join("data/charts", f"chart_{x_column}_{chart_type}.png")
        fig.savefig(output_path, dpi=120)
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=120)
        plt.close(fig)
        
        return json.dumps({
            "message": f"Generated {chart_type} chart saved to {output_path}.",
            "chart_base64": base64.b64encode(buf.getvalue()).decode("utf-8"),
            "output_path": output_path
        })