from flask import Flask, request, jsonify
from ultralytics import YOLO
from sklearn.preprocessing import LabelEncoder
import re


import joblib
import numpy as np
from scipy.sparse import hstack
import pandas as pd
from flask_cors import CORS




import cv2
import threading
import base64
import time

app = Flask(__name__)
CORS(app)



modelAziz= joblib.load('modele_regression.joblib')
modelSafety = YOLO('best.pt')
model = joblib.load('xgboost_model.joblib')
vectorizer = joblib.load('tfidf_vectorizer.joblib')
rf_model = joblib.load('RF_model.joblib') 
scaler = joblib.load('scaler.joblib') 
modelAbir = joblib.load("decision_tree_model.pkl")
label_encoder = joblib.load("label_encoder.pkl")

vectorizerEmira = joblib.load('vectorizerEmira.pkl')
modelEmira = joblib.load('livrable_model.pkl')
label_encoderEmira = joblib.load('label_encoderEmira.pkl')

modelMaram = joblib.load('price_predictor (1).pkl')
label_encodersMaram = joblib.load('label_encoders (1).pkl')

features = ['sentiment', 'aiRating', 'clickCount', 'createdAt']


camera_state = {
    "running": False,
    "frame": None,
    "results": None,
    "annotated_frame": None,
    "camera_thread": None,
    "camera_capture": None
}

def clean_text(text):
    text = text.lower()
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text

def extract_flags(text):
    delay_keywords = [
        'delay', 'late', 'postpone', 'hold up', 'deferred',
        'overdue', 'uncompleted', 'failed', 'unrevised', 'unsubmitted', 'unreviwed'
    ]
    progress_keywords = [
        'progress', 'working', 'ongoing', 'underway', 'minor'
    ]
    completion_keywords = [
        'completed', 'done', 'finished', 'approved', 'reviewed'
    ]

    contains_delay = int(any(kw in text for kw in delay_keywords))
    contains_progress = int(any(kw in text for kw in progress_keywords))
    contains_completion = int(any(kw in text for kw in completion_keywords))

    return contains_delay, contains_progress, contains_completion

@app.route('/predict-price', methods=['POST'])
def predict_price():
    data = request.get_json()

    first_name = data.get('first_name', '').strip()
    quantity = data.get('quantity')
    category = data.get('category', '').strip()

    if not first_name or quantity is None or not category:
        return jsonify({'error': 'first_name, quantity, and category are required'}), 400

    try:
        quantity = int(quantity)
    except ValueError:
        return jsonify({'error': 'quantity must be an integer'}), 400

    name_encoder = label_encodersMaram['first_name']
    category_encoder = label_encodersMaram['category']

    first_name_encoded = name_encoder.transform([first_name])[0] \
        if first_name in name_encoder.classes_ else len(name_encoder.classes_)

    category_encoded = category_encoder.transform([category])[0] \
        if category in category_encoder.classes_ else len(category_encoder.classes_)

    input_array = np.array([[first_name_encoded, quantity, category_encoded]])
    predicted_price = modelMaram.predict(input_array)[0]

    return jsonify({'predicted_price': float(predicted_price)})

@app.route('/predictEmira', methods=['POST'])
def predictEmira():
    try:
        data = request.get_json()

        description = data.get('description')
        created_at = data.get('createdAt')
        due_date = data.get('due_date')

        if not description or not created_at or not due_date:
            return jsonify({'error': 'Missing required fields'}), 400

        description_cleaned = clean_text(description)
        contains_delay, contains_progress, contains_completion = extract_flags(description_cleaned)

        df = pd.DataFrame({
            'description_clean': [description_cleaned],
            'contains_delay': [contains_delay],
            'contains_progress': [contains_progress],
            'contains_completion': [contains_completion],
            'createdAt': [created_at],
            'due_date': [due_date]
        })

        df['createdAt'] = pd.to_datetime(df['createdAt'], errors='coerce')
        df['due_date'] = pd.to_datetime(df['due_date'], errors='coerce')
        if df['createdAt'].isnull().any() or df['due_date'].isnull().any():
            return jsonify({'error': 'Invalid date format'}), 400

        df['days_to_due'] = (df['due_date'] - df['createdAt']).dt.days
        df['due_on_weekend'] = df['due_date'].dt.weekday >= 5

        description_vectorized = vectorizerEmira.transform(df['description_clean'])
        X = np.hstack([
            description_vectorized.toarray(),
            df[['contains_delay', 'contains_progress', 'contains_completion', 'days_to_due', 'due_on_weekend']].values
        ])

        prediction = modelEmira.predict(X)
        predicted_status = label_encoderEmira.inverse_transform(prediction)[0]

        return jsonify({'predicted_status': predicted_status})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

def run_camera():
    camera_state["camera_capture"] = cv2.VideoCapture(0)
    
    while camera_state["running"]:
        ret, frame = camera_state["camera_capture"].read()
        if not ret:
            break
            
        results = modelSafety.predict(source=frame, conf=0.6, verbose=False)
        
        annotated_frame = results[0].plot()
        
        camera_state.update({
            "frame": frame,
            "results": results,
            "annotated_frame": annotated_frame
        })
        
        time.sleep(0.03)

    if camera_state["camera_capture"] and camera_state["camera_capture"].isOpened():
        camera_state["camera_capture"].release()
    camera_state.update({
        "frame": None,
        "results": None,
        "annotated_frame": None,
        "camera_capture": None
    })

@app.route('/start_camera', methods=['POST'])
def start_camera():
    if camera_state["running"]:
        return jsonify({"status": "already running"})
    
    camera_state["running"] = True
    camera_state["camera_thread"] = threading.Thread(target=run_camera)
    camera_state["camera_thread"].daemon = True
    camera_state["camera_thread"].start()
    
    return jsonify({"status": "started"})

@app.route('/stop_camera', methods=['POST'])
def stop_camera():
    if not camera_state["running"]:
        return jsonify({"status": "not running"})
    
    camera_state["running"] = False
    
    if camera_state["camera_thread"]:
        camera_state["camera_thread"].join()
    
    return jsonify({"status": "stopped"})

@app.route('/detect', methods=['GET'])
def detect_objects():
    if not camera_state["running"] or camera_state["annotated_frame"] is None:
        return jsonify({"error": "Camera not running or not ready"}), 503
    
    _, buffer = cv2.imencode('.jpg', camera_state["annotated_frame"])
    jpg_as_text = base64.b64encode(buffer).decode('utf-8')
    
    detections = []
    for result in camera_state["results"]:
        for box in result.boxes:
            detections.append({
                "class": result.names[box.cls[0].item()],
                "confidence": float(box.conf[0].item()),
                "bbox": box.xyxy[0].tolist()
            })
    
    return jsonify({
        "image": jpg_as_text,
        "detections": detections
    })

@app.route('/camera_status', methods=['GET'])
def camera_status():
    return jsonify({
        "running": camera_state["running"],
        "ready": camera_state["annotated_frame"] is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    name = data.get('name', '').strip()
    description = data.get('description', '').strip()
    effectif = data.get('effectif')
    niveau_complexity = data.get('niveau_complexity', '').lower().strip()
    
    if not name or not description:
        return jsonify({'error': 'Name and description are required'}), 400
    if effectif is None:
        return jsonify({'error': 'Effectif (team size) is required'}), 400
    if niveau_complexity not in ['low', 'medium', 'hard']:
        return jsonify({'error': 'Niveau_complexity must be low, medium, or hard'}), 400
    
    complexity_map = {'low': 0, 'medium': 1, 'hard': 2}
    complexity_num = complexity_map[niveau_complexity]
    
    text = f"{name} {description}"
    text_length = len(text)
    
    features = hstack([
        vectorizer.transform([text]),        
        np.array([[text_length]]),           
        np.array([[effectif]]),              
        np.array([[complexity_num]])         
    ])
    
    duration = model.predict(features)[0]
    
    return jsonify({
        'predicted_duration_days': float(duration)  
    })

@app.route('/predict_dateecheance', methods=['POST'])
def predict_dateecheance():
    data = request.get_json()

    montant = data.get("montant")
    dateemission_str = data.get("dateemission") 

    if montant is None or dateemission_str is None:
        return jsonify({"error": "Les champs 'montant' et 'dateemission' sont requis."}), 400

    try:
        dateemission = pd.to_datetime(dateemission_str)
        dateemission_days = (dateemission - pd.Timestamp("1970-01-01")) // pd.Timedelta('1D')

        input_data = [[float(montant), dateemission_days]]

        predicted_duree_jours = modelAziz.predict(input_data)[0]

        predicted_dateecheance = dateemission + pd.Timedelta(days=predicted_duree_jours)

        if predicted_dateecheance <= dateemission:
            return jsonify({"error": "La date d'échéance prédite est inférieure ou égale à la date d'émission."}), 400

        return jsonify({
            "dateecheance_predite": predicted_dateecheance.strftime('%Y-%m-%d'),
            "duree_jours_predite": round(predicted_duree_jours, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    



    
@app.route('/predict/supp', methods=['POST'])
def predictsupp():
    try:
        # Get the JSON input from the request
        data = request.get_json()

        # Convert the data into a DataFrame
        input_data = pd.DataFrame([data])

        # Handle categorical columns (e.g., 'sentiment')
        encoder = LabelEncoder()
        input_data['sentiment'] = encoder.fit_transform(input_data['sentiment'])

        # Ensure all the expected columns are present
        for col in features:
            if col not in input_data.columns:
                input_data[col] = 0

        # Reorder the columns to match the training order
        input_data = input_data[features]

        # Preprocess the data (scaling)
        input_scaled = scaler.transform(input_data)  # Scaling the input

        # Predict using the trained model
        prediction = rf_model.predict(input_scaled)

        # Calculate feature contributions (for Random Forest model)
        feature_importances = rf_model.feature_importances_

        # Create a dictionary for feature contributions
        feature_contributions = {}
        for feature, importance in zip(features, feature_importances):
            feature_contributions[feature] = round(importance, 4)

        # Add predictionStatus to the response
        prediction_status = "active" if prediction[0] == 1 else "inactive"

        # Return the prediction and feature contributions as a JSON response
        return jsonify({
            'prediction': int(prediction[0]),
            'sentiment': data['sentiment'],
            'aiRating': data['aiRating'],
            'clickCount': data['clickCount'],
            'createdAt': data['createdAt'],
            'predictionStatus': prediction_status,  # Add predictionStatus here
            'featureImportance': feature_contributions
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

    

@app.route('/predict/project_status', methods=['POST'])
def predict_status():
    data = request.get_json()
    duration = data.get("duration", None)
    
    if duration is None:
        return jsonify({"error": "duration is required"}), 400

    X_input = pd.DataFrame([[duration]], columns=["duration"])
    prediction = modelAbir.predict(X_input)
    status_label = label_encoder.inverse_transform(prediction)[0]

    return jsonify({"predicted_status": status_label})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)