import pandas as pd
import joblib

# Load the saved model
model = joblib.load("yield_model.pkl")

# Load original data to get the correct columns
df = pd.read_csv("D:\\DEV\\crop-yield-pipeline\\backend\\data\\crop_yield.csv")
df.columns = df.columns.str.strip()
df = df.apply(lambda col: col.map(lambda x: x.strip() if isinstance(x, str) else x))
df = df.dropna()
df = pd.get_dummies(df, columns=["State", "Season", "Crop"])
df = df.drop(columns=["Yield", "Production"])

# Sample input - change these values to test
sample = {
    "Crop_Year": 2023,
    "Area": 1000,
    "Annual_Rainfall": 1100,
    "Fertilizer": 50000,
    "Pesticide": 200,
    "State_Assam": 0,
    "State_Maharashtra": 1,   # change state here
    "Season_Kharif": 1,        # change season here
    "Crop_Rice": 1,            # change crop here
}

# Build input row with all columns set to 0
input_row = pd.DataFrame([{col: 0 for col in df.columns}])

# Fill in known values
for key, val in sample.items():
    if key in input_row.columns:
        input_row[key] = val

prediction = model.predict(input_row)
print(f"Predicted Yield: {round(prediction[0], 4)} tonnes/hectare")