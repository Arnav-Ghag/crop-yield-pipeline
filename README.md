# 🌾 Agricultural AI Platform

A full-stack AI-powered agricultural decision support system for Indian farmers. Combines rule-based crop recommendation, machine learning yield prediction, an AI farming assistant, and crop rotation planning — all in one dashboard.

---

## Features

### 🌱 Crop Recommendation (Rule-Based)
- Input your rainfall, temperature, soil type, and season
- Scoring algorithm with weighted factors (40% rainfall, 30% temperature, 20% soil, 10% season)
- Penalty system for out-of-range values
- Returns top 3 recommended crops with suitability scores

### 📊 Yield Prediction (Machine Learning)
- Random Forest Regressor trained on 19,691 rows of Indian crop data (1997–present)
- Features: Annual Rainfall, Fertilizer, Pesticide, Area, State, Season, Crop
- **R² Score: 0.9807** — model explains 98% of yield variation
- **MAE: 9.44** tonnes/hectare
- Predicts yield in tonnes per hectare

### 🤖 AI Farming Assistant (LLM)
- Powered by LLaMA 3.1 via Groq API
- Answers questions about fertilizers, pest control, crop care, and Indian farming practices
- Context-aware responses tailored to Indian agriculture

### 🔄 Crop Rotation Advisor (Rule-Based)
- Select your current crop to get next season recommendations
- Based on soil health principles (nitrogen fixation, nutrient depletion cycles)
- Covers 15 major Indian crops with scientific reasoning

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| ML Model | Scikit-learn (Random Forest) |
| AI Chatbot | Groq API (LLaMA 3.1) |
| Data | Pandas, Joblib |

---

## Project Structure

```
crop-yield-pipeline/
├── backend/
│   ├── data/
│   │   ├── crop_yield.csv
│   │   └── crop_suitability_updated.csv
│   ├── model/
│   │   ├── train_yield.py
│   │   ├── predict_yield.py
│   │   └── yield_model.pkl
│   ├── services/
│   │   ├── recommendation.py
│   │   ├── chatbot.py
│   │   └── rotation.py
│   └── main.py
├── frontend/
│   └── src/
│       └── App.jsx
└── README.md
```

---

## Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install fastapi uvicorn scikit-learn pandas numpy joblib groq python-dotenv

# Train the model (first time only)
python backend/model/train_yield.py

# Add your Groq API key to backend/services/chatbot.py
# GROQ_API_KEY = "your_key_here"

# Start the backend
uvicorn backend.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`
API docs available at `http://127.0.0.1:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/recommend` | Get top 3 crop recommendations |
| POST | `/predict-yield` | Predict crop yield in tonnes/ha |
| POST | `/chat` | Ask the AI farming assistant |
| POST | `/crop-rotation` | Get next season crop suggestions |

---

## ML Model Details

- **Algorithm**: Random Forest Regressor (100 estimators)
- **Dataset**: 19,691 rows of Indian crop data across all states
- **Features**: Annual Rainfall, Fertilizer, Pesticide, Area, Crop Year, State (one-hot), Season (one-hot), Crop (one-hot)
- **Target**: Yield (tonnes/hectare)
- **Train/Test Split**: 80/20
- **R² Score**: 0.9807
- **MAE**: 9.44 tonnes/hectare

---

## Screenshots

<img width="1815" height="958" alt="Crop Advisor" src="https://github.com/user-attachments/assets/cf321857-5239-42b1-a2e3-1e3d1de0e8cf" />

<img width="1814" height="956" alt="Yeild Forcast" src="https://github.com/user-attachments/assets/a43a8d62-a5b0-489e-a503-35074e3bbe46" />

<img width="1683" height="966" alt="Ai Assistant" src="https://github.com/user-attachments/assets/05f784b1-d899-460a-b9ae-827e9f4bf420" />

<img width="1817" height="962" alt="Crop Rotation" src="https://github.com/user-attachments/assets/ff909d08-7515-4eca-bf6e-ef9511e32d1c" />


---

## Author

**Arnav Ghag**  
Electronics & Telecommunication Engineering  
GitHub: [@Arnav-Ghag](https://github.com/Arnav-Ghag)

---

## Acknowledgements

- Dataset sourced from Kaggle
- AI assistant powered by [Groq](https://groq.com) (LLaMA 3.1)
- Built as an AI/ML college project
