from flask import Flask, render_template, request, jsonify
import os
from werkzeug.utils import secure_filename
import torch
from pathlib import Path

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='./yolov5s.pt')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'})

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    results = model(filepath)
    results.save(save_dir='static/detections')  # Saves image with detections

    output_image = Path('static/detections') / filename
    predictions = results.pandas().xyxy[0].to_dict(orient="records")

    return jsonify({
        'image_url': str(output_image),
        'detections': predictions
    })

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)
