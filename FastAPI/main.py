from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

# CORS settings
origins = [
    "http://localhost",
    "http://localhost:3000",
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the TensorFlow model
try:
    options = tf.saved_model.LoadOptions(experimental_io_device='/job:localhost')
    MODEL = tf.keras.models.load_model("../models/1", options=options)
except Exception as e:
    raise Exception(f"Error loading TensorFlow model: {str(e)}")

# Define class names
CLASS_NAMES = ["Eczema", "Healthy"]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    try:
        image = np.array(Image.open(BytesIO(data)))
        return image
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading image file: {str(e)}")

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    try:
        image = read_file_as_image(await file.read())
        # Resize the image to the expected dimensions
        resized_image = np.array(Image.fromarray(image).resize((256, 256)))
        img_batch = np.expand_dims(resized_image, 0)

        predictions = MODEL.predict(img_batch)

        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        confidence = float(np.max(predictions[0]))

        return {
            'class': predicted_class,
            'Accuracy': confidence
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting image: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app)
