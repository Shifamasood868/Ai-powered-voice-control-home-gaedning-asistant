from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import cv2
from ultralytics import YOLO
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize YOLO model
model = YOLO('best.pt')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process the image
        results = model.predict(filepath, conf=0.25, iou=0.45)
        
        # Visualize results
        img = cv2.imread(filepath)
        annotated_img = results[0].plot()
        
        # Convert images to base64 for API response
        _, original_img_encoded = cv2.imencode('.jpg', img)
        original_base64 = base64.b64encode(original_img_encoded).decode('utf-8')
        
        _, result_img_encoded = cv2.imencode('.jpg', annotated_img)
        result_base64 = base64.b64encode(result_img_encoded).decode('utf-8')
        
        # Get detection details
        detections = []
        for result in results:
            for box, conf, cls_id in zip(result.boxes.xyxy, result.boxes.conf, result.boxes.cls):
                detections.append({
                    'class': model.names[int(cls_id)],
                    'confidence': float(conf),
                    'box': [float(x) for x in box]
                })
        
        # Clean up - remove the uploaded file
        os.remove(filepath)
        
        return jsonify({
            'original_image': f"data:image/jpeg;base64,{original_base64}",
            'result_image': f"data:image/jpeg;base64,{result_base64}",
            'detections': detections,
            'plant_info': get_plant_info(model.names[int(cls_id)]) if detections else None
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

def get_plant_info(plant_name):
    # This is a mock function - replace with your actual plant database or API
    plant_db = {
        "monstera": {
            "name": "Monstera Deliciosa",
            "commonNames": ["Swiss Cheese Plant", "Split-leaf Philodendron"],
            "scientificName": "Monstera deliciosa",
            "family": "Araceae",
            "origin": "Central America",
            "description": "A tropical plant known for its large, glossy leaves with distinctive holes and splits.",
            "careInstructions": {
                "light": "Bright, indirect light",
                "watering": "Water when top inch of soil is dry",
                "humidity": "50-60% humidity preferred",
                "temperature": "65-85°F (18-29°C)",
                "soil": "Well-draining potting mix"
            },
            "tips": [
                "Provide a moss pole for climbing support",
                "Mist leaves regularly",
                "Clean leaves monthly",
                "Fertilize monthly during growing season"
            ],
            "toxicity": "Toxic to pets and children if ingested"
        }
    }
    return plant_db.get(plant_name.lower(), None)

if __name__ == '__main__':
    app.run(debug=True, port=4000)