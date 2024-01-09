from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Load the TensorFlow model
try:
    options = tf.saved_model.LoadOptions(experimental_io_device='/job:localhost')
    MODEL = tf.keras.models.load_model("../models/1", options=options)
except Exception as e:
    raise Exception(f"Error loading TensorFlow model: {str(e)}")

# Define class names
CLASS_NAMES = ["Eczema", "Healthy"]

@app.route("/ping")
def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    try:
        image = np.array(Image.open(BytesIO(data)))
        return image
    except Exception as e:
        return jsonify({"error": f"Error reading image file: {str(e)}"}), 400

@app.route("/predict", methods=["POST"])
def predict():
    try:
        file = request.files["file"]
        image = read_file_as_image(file.read())

        # Resize the image to the expected dimensions
        resized_image = np.array(Image.fromarray(image).resize((256, 256)))
        img_batch = np.expand_dims(resized_image, 0)

        predictions = MODEL.predict(img_batch)

        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        confidence = float(np.max(predictions[0]))

        return jsonify({
            'class': predicted_class,
            'Accuracy': confidence
        })
    except Exception as e:
        return jsonify({"error": f"Error predicting image: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0')
