from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import sys
import os
from backend.services.chatbot import ask_farming_assistant
from backend.services.rotation import get_rotation

sys.path.append(os.path.dirname(__file__))
from backend.services.recommendation import recommend_crops

app = FastAPI(title="Agricultural AI Platform")

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model once at startup
model = joblib.load(os.path.join(os.path.dirname(__file__), "model/yield_model.pkl"))

# Load training columns once at startup
df_ref = pd.read_csv(os.path.join(os.path.dirname(__file__), "data/crop_yield.csv"))
df_ref.columns = df_ref.columns.str.strip()
df_ref = df_ref.apply(lambda col: col.map(lambda x: x.strip() if isinstance(x, str) else x))
df_ref = df_ref.dropna()
df_ref = pd.get_dummies(df_ref, columns=["State", "Season", "Crop"])
df_ref = df_ref.drop(columns=["Yield", "Production"])
MODEL_COLUMNS = df_ref.columns.tolist()


# ─── Input Schemas ───────────────────────────────────────────

class RecommendRequest(BaseModel):
    rainfall: float
    temperature: float
    soil: str
    season: str

class YieldRequest(BaseModel):
    crop: str
    state: str
    season: str
    area: float
    rainfall: float
    fertilizer: float
    pesticide: float
    crop_year: int = 2024


# ─── Endpoints ───────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Agricultural AI Platform is running"}


@app.post("/recommend")
def recommend(req: RecommendRequest):
    features = {
        "rainfall": req.rainfall,
        "temperature": req.temperature,
        "soil": req.soil,
        "season": req.season,
    }
    results = recommend_crops(features)
    return {"recommendations": results}


@app.post("/predict-yield")
def predict_yield(req: YieldRequest):
    input_row = pd.DataFrame([{col: 0 for col in MODEL_COLUMNS}])

    input_row["Crop_Year"] = req.crop_year
    input_row["Area"] = req.area
    input_row["Annual_Rainfall"] = req.rainfall
    input_row["Fertilizer"] = req.fertilizer
    input_row["Pesticide"] = req.pesticide

    state_col = f"State_{req.state}"
    season_col = f"Season_{req.season}"
    crop_col = f"Crop_{req.crop}"

    if state_col in input_row.columns:
        input_row[state_col] = 1
    if season_col in input_row.columns:
        input_row[season_col] = 1
    if crop_col in input_row.columns:
        input_row[crop_col] = 1

    prediction = model.predict(input_row)
    return {"predicted_yield": round(float(prediction[0]), 4), "unit": "tonnes/hectare"}


class ChatRequest(BaseModel):
    question: str
    context: dict = {}

@app.post("/chat")
def chat(req: ChatRequest):
    response = ask_farming_assistant(req.question, req.context)
    return {"response": response}

class RotationRequest(BaseModel):
    current_crop: str

@app.post("/crop-rotation")
def crop_rotation(req: RotationRequest):
    result = get_rotation(req.current_crop)
    return result