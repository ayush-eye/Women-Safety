import argparse
import json
import os
from pathlib import Path

import cv2
import numpy as np


def load_face(image_path, face_cascade):
    image = cv2.imread(str(image_path))
    if image is None:
        return None
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    if len(faces) == 0:
        return None
    x, y, w, h = max(faces, key=lambda item: item[2] * item[3])
    face = gray[y : y + h, x : x + w]
    return cv2.resize(face, (200, 200))


def build_training_data(labels_path):
    with open(labels_path, "r", encoding="utf-8") as f:
        criminals = json.load(f)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = []
    labels = []
    label_map = {}

    for idx, criminal in enumerate(criminals):
        face = load_face(criminal["photo"], face_cascade)
        if face is None:
            continue
        faces.append(face)
        labels.append(idx)
        label_map[idx] = {
            "id": criminal["id"],
            "name": criminal["name"],
            "description": criminal["description"],
        }

    return faces, labels, label_map


def recognize(probe_path, labels_path):
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    probe_face = load_face(probe_path, face_cascade)
    if probe_face is None:
        return {"message": "No face detected in uploaded image.", "matches": []}

    faces, labels, label_map = build_training_data(labels_path)
    if not faces or not labels:
        return {"message": "No valid criminal faces available for comparison.", "matches": []}

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.train(faces, np.array(labels))

    label, confidence = recognizer.predict(probe_face)
    match = label_map.get(label)
    threshold = 80.0

    if match and confidence <= threshold:
        return {
            "message": "Criminal match found.",
            "matches": [
                {
                    "id": match["id"],
                    "name": match["name"],
                    "description": match["description"],
                    "confidence": confidence,
                }
            ],
        }

    return {"message": "No criminal match detected.", "matches": []}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Recognize criminal using OpenCV LBPH face recognition.")
    parser.add_argument("--probe", required=True, help="Path to the uploaded probe image.")
    parser.add_argument("--labels", required=True, help="JSON file containing criminal labels and photo paths.")
    args = parser.parse_args()

    probe_path = Path(args.probe)
    labels_path = Path(args.labels)

    if not probe_path.exists() or not labels_path.exists():
        print(json.dumps({"message": "Probe or labels file not found.", "matches": []}))
        exit(1)

    result = recognize(str(probe_path), str(labels_path))
    print(json.dumps(result))
