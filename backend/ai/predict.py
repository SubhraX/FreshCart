import joblib
import sys
import json
import numpy as np
import math
import os

# Path is relative to backend root
model_path = os.path.join("ai", "cart_health_model.pkl")

def main():
    try:
        # 1. Load Model
        if not os.path.exists(model_path):
            print("0") # Return 0 if model is missing to avoid hanging
            sys.exit(1)

        model = joblib.load(model_path)

        # 2. Parse Input from Node.js
        # Safety: sys.argv[1] contains the JSON string of features
        features_list = json.loads(sys.argv[1])
        
        # Ensure it's the correct shape (1 row, 6 columns)
        features = np.array(features_list).reshape(1, -1)

        # 3. Predict
        score = model.predict(features)[0]

        # 4. Final Formatting (Ceiling + Clamp 0-10)
        final_score = math.ceil(float(score))
        final_score = max(0, min(10, final_score))

        print(final_score)

    except Exception as e:
        # Log to stderr so it doesn't mess up the stdout score
        print(f"Python Internal Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()