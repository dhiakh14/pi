from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load the trained Random Forest model and scaler
rf_model = joblib.load('RF_model.joblib')  # Adjust path if necessary
scaler = joblib.load('scaler.joblib')      # Adjust path if necessary

@app.route('/predict/supplier_prediction', methods=['POST'])
def predict_supplier():
    try:
        data = request.json
        created_at = int(data['createdAt'])  # Ensure this is a regular Python int
        ai_rating = data['aiRating']
        click_count = data['clickCount']

        # Process the prediction
        prediction = rf_model.predict([[created_at, ai_rating, click_count]])
        probabilities = rf_model.predict_proba([[created_at, ai_rating, click_count]])

        # Define the status based on the prediction (modify this according to your model's logic)
        status = "active" if prediction[0] == 1 else "inactive"

        # Convert the prediction and probabilities to regular Python data types
        response = {
            'status': status,  # Map prediction to status
            'probabilities': probabilities.tolist()  # Convert probabilities to list
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Ensure the app runs on host '0.0.0.0' and port '5000'
    app.run(debug=True, host='0.0.0.0', port=5000)
