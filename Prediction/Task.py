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
modelAbir = joblib.load("classification_model.pkl")
label_encoder = joblib.load("label_encoder.pkl")

modelEmira = joblib.load('completed_vs_lateNewEmiraZr.pkl')
vectorizerEmira = joblib.load('tfidf_vectorizerEmiraZr.pkl')
scalerEmira = joblib.load('scalerNewEmiraZr.pkl')

modelMaram = joblib.load('price_predictor (1).pkl')
label_encodersMaram = joblib.load('label_encoders (1).pkl')

features = ['sentiment', 'aiRating', 'clickCount', 'createdAt']

stop_words = {
    "and", "by", "for", "with", "in", "on", "at", "the", "to", "of", "a", "an", "this", "that",
    "is", "was", "were", "be", "being", "been", "has", "have", "had", "do", "does", "did",
    "doing", "or", "as", "if", "than", "how", "but", "so", "from", "up", "down", "into",
    "off", "it", "its", "you", "he", "she", "we", "they", "all", "any", "some", "much",
    "many", "few", "more", "most", "less", "least", "great", "little", "better", "best"
}

delay_keywords = [
    'delay', 'late', 'postpone', 'hold up', 'deferred', 'overdue',
    'uncompleted', 'failed', 'unrevised', 'unsubmitted', 'unreviewed'
]
progress_keywords = [
    'in progress', 'working', 'ongoing', 'started', 'underway',
    'in development', 'in review', 'in process', 'in production', 'in testing'
]
completion_keywords = ['completed', 'done', 'finished', 'approved', 'reviewed','finalized','final']

def clean_description(text):
    if pd.isnull(text):
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    return " ".join([word for word in text.split() if word not in stop_words])

def extract_features(data):
    # Clean description
    desc = clean_description(data.get('description', ''))

    # Boolean features
    contains_delay = any(k in desc for k in delay_keywords)
    contains_progress = any(k in desc for k in progress_keywords)
    contains_completion = any(k in desc for k in completion_keywords)

    # Dates
    created_at = pd.to_datetime(data.get('createdAt'), errors='coerce')
    due_date = pd.to_datetime(data.get('due_date'), errors='coerce')
    days_to_due = (due_date - created_at).days if pd.notnull(created_at) and pd.notnull(due_date) else 0
    due_on_weekend = due_date.weekday() >= 5 if pd.notnull(due_date) else False

    # Text combo
    title = data.get('title', '')
    project = data.get('projectName', '')
    text_combo = f"{title} {project} {desc}"
    text_vec = vectorizerEmira.transform([text_combo])

    # **Add progress ratio**
    completed_count = data.get('completed_count', 0)
    total_count = data.get('total_count', 0)
    progress_ratio = completed_count / total_count if total_count > 0 else 0  # Avoid division by zero

    # Numerical features
    num_features = np.array([[contains_delay, contains_progress, contains_completion, days_to_due, due_on_weekend,progress_ratio]])
    num_scaled = scalerEmira.transform(num_features)

    # Combine and return
    return np.hstack([text_vec.toarray(), num_scaled])


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

@app.route('/predictNewEmira', methods=['POST'])
def predictEmira():
    data = request.get_json()
    features = extract_features(data)
    prediction = modelEmira.predict(features)[0]

    # Calculate progress ratio from raw input
    completed_count = data.get('completed_count', 0)
    total_count = data.get('total_count', 0)
    progress_ratio = completed_count / total_count if total_count > 0 else 0

    # Clean description for keywords
    description = clean_description(data.get('description', ''))
    contains_completion = any(k in description for k in completion_keywords)

    # Rule-based override
    if progress_ratio < 0.5 and not contains_completion:
        label = 'Late'
    else:
        label = 'Late' if prediction == 1 else 'Completed'

    return jsonify({'prediction': label})

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

    

@app.route('/predict/risk_level', methods=['POST'])
def predict_risk_level():
    data = request.get_json()

    try:
        duration = float(data["duration_days"])
        budget = float(data["estimated_budget_kdt"])
        team = int(data["team_size"])
        complexity = int(data["complexity_encoded"])
    except (KeyError, ValueError):
        return jsonify({
            "error": "Les champs requis sont : duration_days, estimated_budget_kdt, team_size, complexity_encoded"
        }), 400

    X_input = pd.DataFrame([[duration, budget, team, complexity]],
                           columns=["duration_days", "estimated_budget_kdt", "team_size", "complexity_encoded"])

    prediction = modelAbir.predict(X_input)
    predicted_label = label_encoder.inverse_transform(prediction)[0]

    return jsonify({"predicted_risk_level": predicted_label})

if __name__ == '__main__':
    app.run(debug=True, port=5000)