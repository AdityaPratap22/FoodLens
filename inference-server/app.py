from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("foodlens_mobilenetv2.h5")

class_names = ['spring_rolls','fried_rice','pizza',
               'french_fries','omelette','samosa',
               'ice_cream','donuts'
]

def predict_food(image: Image.Image):
    image = image.resize((224, 224))
    img = np.array(image) / 255.0
    img = np.expand_dims(img, axis=0)

    preds = model.predict(img)
    idx = np.argmax(preds)
    confidence = float(np.max(preds))

    return class_names[idx], confidence

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    label, confidence = predict_food(image)

    return {
        "food": label,
        "confidence": confidence
    }
