import os
import subprocess
from pathlib import Path

#Dataset Paths
YOLOV5_DIR = Path('./yolov5') 
DATA_YAML = Path('/absolute/path/to/your/data.yaml')
PRETRAINED_WEIGHTS = 'yolov5s.pt' 
IMG_SIZE = 640
BATCH_SIZE = 16
EPOCHS = 50
EXPERIMENT_NAME = 'custom_yolo_model'

def train_yolov5():
    #Directory File Check
    assert YOLOV5_DIR.exists(), f"YOLOv5 directory not found at {YOLOV5_DIR}. Clone it from https://github.com/ultralytics/yolov5" #Clones Model From GitHub If Not Avalible
    assert DATA_YAML.exists(), f"data.yaml not found at {DATA_YAML}"

    train_cmd = [
        'python', str(YOLOV5_DIR / 'train.py'),
        '--img', str(IMG_SIZE),
        '--batch', str(BATCH_SIZE),
        '--epochs', str(EPOCHS),
        '--data', str(DATA_YAML),
        '--weights', PRETRAINED_WEIGHTS,
        '--name', EXPERIMENT_NAME
    ]

    print("🚀 Starting training...")
    subprocess.run(train_cmd)
    print(f"\n✅ Training finished! Check results in {YOLOV5_DIR / 'runs' / 'train' / EXPERIMENT_NAME}")

if __name__ == '__main__':
    train_yolov5()
