import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error

# Step 1: Load data
df = pd.read_csv("D:\\DEV\\crop-yield-pipeline\\backend\\data\\crop_yield.csv")

# Step 2: Clean column names
df.columns = df.columns.str.strip()
df = df.apply(lambda col: col.map(lambda x: x.strip() if isinstance(x, str) else x))

# Step 3: Drop rows with missing values
df = df.dropna()

# Step 4: Encode categorical columns
df = pd.get_dummies(df, columns=["State", "Season", "Crop"])

# Step 5: Define features and target
X = df.drop(columns=["Yield", "Production"])
y = df["Yield"]

# Step 6: Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 7: Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Step 8: Evaluate
y_pred = model.predict(X_test)
print("R2 Score:", round(r2_score(y_test, y_pred), 4))
print("MAE:", round(mean_absolute_error(y_test, y_pred), 4))
print("Training complete.")

import joblib

# Save the model
joblib.dump(model, "yield_model.pkl")
print("Model saved.")