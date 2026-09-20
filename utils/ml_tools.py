import json, pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

class MLTools:
    def _load(self, file_path: str) -> pd.DataFrame:
        if file_path.endswith(".csv"): return pd.read_csv(file_path)
        elif file_path.endswith(".parquet"): return pd.read_parquet(file_path)
        return pd.read_json(file_path, lines=True)

    def train_model(self, file_path: str, target_column: str, model_type: str = "auto") -> str:
        df = self._load(file_path).dropna()
        X, y = df.drop(columns=[target_column]), df[target_column]
        
        for col in X.select_dtypes(include=["object", "category"]).columns:
            X[col] = LabelEncoder().fit_transform(X[col].astype(str))
            
        is_classification = model_type == "classification" or (model_type == "auto" and (y.dtype == "object" or y.nunique() <= 20))
        if is_classification and y.dtype == "object": y = LabelEncoder().fit_transform(y.astype(str))
            
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        if is_classification:
            model = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_train, y_train)
            preds = model.predict(X_test)
            metrics = {"task": "classification", "accuracy": round(accuracy_score(y_test, preds), 4)}
        else:
            model = RandomForestRegressor(n_estimators=100, random_state=42).fit(X_train, y_train)
            preds = model.predict(X_test)
            metrics = {"task": "regression", "rmse": round(mean_squared_error(y_test, preds) ** 0.5, 4)}
            
        importances = sorted(zip(X.columns, model.feature_importances_), key=lambda x: -x[1])[:10]
        metrics["top_features"] = [{"feature": f, "importance": round(float(i), 4)} for f, i in importances]
        
        return json.dumps({"message": f"Trained a {metrics['task']} model. Metrics: {json.dumps(metrics)}", "output_path": file_path})