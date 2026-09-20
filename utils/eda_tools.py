import json
import pandas as pd

class EDATools:
    def _load(self, file_path: str) -> pd.DataFrame:
        if file_path.endswith(".csv"):
            return pd.read_csv(file_path)
        elif file_path.endswith(".json"):
            return pd.read_json(file_path, lines=True)
        elif file_path.endswith(".parquet"):
            return pd.read_parquet(file_path)
        raise ValueError(f"Unsupported file format: {file_path}")

    def profile_dataset(self, file_path: str) -> str:
        df = self._load(file_path)
        summary = {
            "shape": df.shape,
            "columns": df.columns.tolist(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "missing_values": df.isnull().sum().to_dict(),
            "numeric_summary": json.loads(df.describe(include="number").to_json()),
        }
        return json.dumps({
            "message": (
                f"Profiled {file_path}: {df.shape[0]} rows, {df.shape[1]} columns.\n"
                f"{json.dumps(summary, indent=2, default=str)}"
            ),
            "output_path": file_path,
        })

    def correlation_matrix(self, file_path: str) -> str:
        df = self._load(file_path)
        corr = df.corr(numeric_only=True).round(3)
        return json.dumps({
            "message": f"Correlation matrix:\n{corr.to_string()}",
            "output_path": file_path,
        })

    def detect_outliers(self, file_path: str, column: str) -> str:
        df = self._load(file_path)
        q1, q3 = df[column].quantile([0.25, 0.75])
        iqr = q3 - q1
        lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
        outliers = df[(df[column] < lower) | (df[column] > upper)]
        return json.dumps({
            "message": f"Found {len(outliers)} outliers in '{column}' (outside [{lower:.2f}, {upper:.2f}]).",
            "output_path": file_path,
        })

    def missing_value_report(self, file_path: str) -> str:
        df = self._load(file_path)
        missing = df.isnull().sum()
        missing = missing[missing > 0]
        if missing.empty:
            message = "No missing values found."
        else:
            pct = (missing / len(df) * 100).round(2)
            message = "\n".join(f"{col}: {n} missing ({pct[col]}%)" for col, n in missing.items())
        return json.dumps({"message": message, "output_path": file_path})