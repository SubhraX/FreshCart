import requests

# The local URL where your Flask app is running
URL = "http://localhost:10000/predict"

# Sample features: [protein, carbs, fat, sugar, fiber, processed_count]
payload = {
    "features": [15.5, 40.0, 10.2, 5.0, 8.5, 1]
}

print(f"Checking ML Server at {URL}...")

try:
    # Sending the POST request
    response = requests.post(URL, json=payload)
    
    # Check if the request was successful
    if response.status_code == 200:
        print("✅ SUCCESS!")
        print("AI Prediction:", response.json())
    else:
        print(f"❌ FAILED (Status Code: {response.status_code})")
        print("Error Message:", response.text)

except Exception as e:
    print("❌ CONNECTION ERROR: Is your Flask app running?")
    print(f"Details: {e}")