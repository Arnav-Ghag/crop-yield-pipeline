import pandas as pd
import os
# importing the updated crop suitability dataset
crop_sustanablity_updated = pd.read_csv(
    os.path.join(os.path.dirname(__file__), "D:\\DEV\\crop-yield-pipeline\\backend\\data\\crop_suitability_updated.csv")
)# inefficient boils down to read_csv("D:\\DEV\\crop-yield-pipeline\\backend\\data\\crop_suitability_updated.csv")


crop_sustanablity_updated.columns = crop_sustanablity_updated.columns.str.strip()
crop_sustanablity_updated = crop_sustanablity_updated.apply(lambda col: col.map(lambda x: x.strip() if isinstance(x, str) else x))

# creating a dataframe with the updated crop suitability dataset
df=pd.DataFrame(crop_sustanablity_updated, columns=['Crop', 'Temperature_C', 'Rainfall_mm', 'Soil_Type', 'Season', 'Rainfall_min_mm', 'Rainfall_max_mm', 'Temperature_min_C', 'Temperature_max_C'])


# -------------------------------
# Helper Functions
# -------------------------------

def compute_score(value, min_val, max_val):
    width = max_val - min_val
    ideal = (min_val + max_val) / 2
    tolerance = 0.2 * width

    # Inside range
    if min_val <= value <= max_val:
        distance = abs(value - ideal)
        relative_distance = distance / width
        score = (1 - relative_distance) * 100
        return max(score, 40)  # clamp edge

    # Tolerance zone
    elif (min_val - tolerance) <= value <= (max_val + tolerance):
        return 30

    # Outside
    else:
        return 0


def soil_score(user_soil, crop_soil):
    if pd.isna(crop_soil):
        return 0
    user_soil = user_soil.lower().strip()
    crop_soil = crop_soil.lower().strip()

    if user_soil == crop_soil:
        return 100
    elif user_soil in crop_soil or crop_soil in user_soil:
        return 50
    else:
        return 0


def season_score(user_season, crop_season):
    if pd.isna(crop_season):
        return 0
    return 100 if user_season.lower().strip() == crop_season.lower().strip() else 0


# -------------------------------
# Main Recommendation Function
# -------------------------------

def recommend_crops(features):
    results = []

    for _, row in df.iterrows():

        rain_s = compute_score(
            features["rainfall"],
            row["Rainfall_min_mm"],
            row["Rainfall_max_mm"]
        )

        temp_s = compute_score(
            features["temperature"],
            row["Temperature_min_C"],
            row["Temperature_max_C"]
        )

        soil_s = soil_score(features["soil"], row["Soil_Type"])
        season_s = season_score(features["season"], row["Season"])

        # Weighted score
        final_score = (
            0.4 * rain_s +
            0.3 * temp_s +
            0.2 * soil_s +
            0.1 * season_s
        )

        # Penalty rule
        if rain_s < 30 or temp_s < 30:
            final_score *= 0.3

        results.append({
            "crop": row["Crop"],
            "score": round(final_score, 2),
            "rain_score": rain_s,
            "temp_score": temp_s
        })

    # Sort and return top 3
    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return results[:3]


# -------------------------------
# Example Usage
# -------------------------------

features = {
    "rainfall": 1000,
    "temperature": 20,
    "soil": "loamy",
    "season": "kharif"
}

recommendations = recommend_crops(features)

for r in recommendations:
    print(r)