# Crop rotation rules based on Indian agriculture principles
ROTATION_RULES = {
    "Rice": {
        "next_crops": ["Wheat", "Mustard", "Gram"],
        "reason": "Rice depletes nitrogen. Follow with nitrogen-fixing legumes or Rabi cereals."
    },
    "Wheat": {
        "next_crops": ["Moong", "Urad", "Sunflower"],
        "reason": "Wheat exhausts soil. Follow with short-duration pulses to restore fertility."
    },
    "Cotton": {
        "next_crops": ["Wheat", "Gram", "Mustard"],
        "reason": "Cotton is a heavy feeder. Follow with cereals or oilseeds."
    },
    "Maize": {
        "next_crops": ["Gram", "Mustard", "Potato"],
        "reason": "Maize depletes nitrogen. Legumes or oilseeds work well after."
    },
    "Sugarcane": {
        "next_crops": ["Wheat", "Onion", "Potato"],
        "reason": "Sugarcane exhausts soil heavily. Rest with short-cycle crops."
    },
    "Groundnut": {
        "next_crops": ["Wheat", "Maize", "Sorghum"],
        "reason": "Groundnut fixes nitrogen — cereals benefit greatly after it."
    },
    "Soybean": {
        "next_crops": ["Wheat", "Maize", "Barley"],
        "reason": "Soybean enriches soil with nitrogen. Cereals thrive after."
    },
    "Mustard": {
        "next_crops": ["Rice", "Maize", "Moong"],
        "reason": "Mustard suppresses weeds. Follow with cereals or short pulses."
    },
    "Gram": {
        "next_crops": ["Wheat", "Maize", "Rice"],
        "reason": "Gram fixes nitrogen. Any cereal benefits from following it."
    },
    "Potato": {
        "next_crops": ["Mustard", "Wheat", "Onion"],
        "reason": "Potato depletes potassium. Rotate with oilseeds or cereals."
    },
    "Onion": {
        "next_crops": ["Maize", "Soybean", "Groundnut"],
        "reason": "Onion is hard on soil. Legumes or cereals restore balance."
    },
    "Tur (Arhar)": {
        "next_crops": ["Wheat", "Maize", "Rice"],
        "reason": "Arhar fixes nitrogen. Follow with any cereal crop."
    },
    "Moong": {
        "next_crops": ["Wheat", "Maize", "Rice"],
        "reason": "Moong enriches soil. Cereals benefit greatly after."
    },
    "Barley": {
        "next_crops": ["Moong", "Urad", "Groundnut"],
        "reason": "Barley depletes nutrients. Legumes restore soil health."
    },
    "Sunflower": {
        "next_crops": ["Wheat", "Gram", "Mustard"],
        "reason": "Sunflower is a heavy feeder. Follow with legumes or cereals."
    },
}

DEFAULT_ROTATION = {
    "next_crops": ["Moong", "Gram", "Mustard"],
    "reason": "General rotation: legumes and oilseeds restore soil health after most crops."
}

def get_rotation(current_crop: str) -> dict:
    # Try exact match first, then case-insensitive
    rule = ROTATION_RULES.get(current_crop)
    if not rule:
        for key in ROTATION_RULES:
            if key.lower() == current_crop.lower().strip():
                rule = ROTATION_RULES[key]
                break
    if not rule:
        rule = DEFAULT_ROTATION

    return {
        "current_crop": current_crop,
        "recommended_next": rule["next_crops"],
        "reason": rule["reason"]
    }