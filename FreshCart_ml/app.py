from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
import math
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# FIX: This ensures it looks in the 'FreshCart_ml' folder where app.py and the .pkl live
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'cart_health_model.pkl')
print("Model path is:", MODEL_PATH)

model = None
try:
    if os.path.exists(MODEL_PATH):
        # Explicitly using the absolute path derived above
        model = joblib.load(MODEL_PATH)
        print(f"✅ Model loaded successfully from {MODEL_PATH}")
    else:
        print(f"❌ Model file NOT FOUND at {MODEL_PATH}")
except Exception as e:
    print(f"❌ Failed to load model: {e}")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "alive"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        features_list = data.get('features', [])
        
        if not model:
            return jsonify({"error": "Model not loaded"}), 500

        features = np.array(features_list).reshape(1, -1)
        score = model.predict(features)[0]

        final_score = max(0, min(10, math.ceil(float(score))))

        return jsonify({"healthScore": final_score})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)