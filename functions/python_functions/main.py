import functions_framework
import cv2
import requests
import numpy as np
from flask import jsonify, request
import os
import firebase_admin
from firebase_admin import credentials, storage
import logging

# Initialize Firebase Admin SDK
firebase_key_path = "/secrets/firebase-admin-key"
if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_key_path)
    firebase_admin.initialize_app(cred, {'storageBucket': 'scanscore-6cbf7.appspot.com'})

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()

def download_image(image_url):
    response = requests.get(image_url)
    if response.status_code == 200:
        image_array = np.frombuffer(response.content, np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        return image
    else:
        return None

def findCheckedBoxes(image):
    original = image.copy()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    # Find contours and filter using contour area filtering to remove noise
    cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)[-2:]
    AREA_THRESHOLD = 10
    for c in cnts:
        area = cv2.contourArea(c)
        if area < AREA_THRESHOLD:
            cv2.drawContours(thresh, [c], -1, 0, -1)

    # Repair checkbox horizontal and vertical walls
    repair_kernel1 = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 1))
    repair = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, repair_kernel1, iterations=1)
    repair_kernel2 = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 5))
    repair = cv2.morphologyEx(repair, cv2.MORPH_CLOSE, repair_kernel2, iterations=1)

    # Detect checkboxes using shape approximation and aspect ratio filtering
    checkbox_contours = []
    cnts, _ = cv2.findContours(repair, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[-2:]
    for c in cnts:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.035 * peri, True)
        x,y,w,h = cv2.boundingRect(approx)
        if x < 100 and y < 100 and w > 50 and h > 50:
            print("Excluding potential QR code checkbox as qrcode")
            continue
        aspect_ratio = w / float(h)
        if len(approx) == 4 and (0.8 <= aspect_ratio <= 1.2):
            cv2.rectangle(original, (x, y), (x + w, y + h), (0, 0, 255), 1)
            checkbox_contours.append(c)

    # print('Checkboxes:', len(checkbox_contours))

    checkedBoxes = 0
    isChecked = []
    for contour in checkbox_contours:

        mask = np.zeros_like(repair)
        cv2.drawContours(mask, [contour], 0, 255, thickness=cv2.FILLED)

        # Apply the mask to the original image
        result = cv2.bitwise_and(repair, mask)
        # cv2.imshow('result', result)
        # Count the number of white pixels in the masked area
        white_pixel_count = np.sum(result == 255)

        # print("Number of white pixels in the specified contour area:", white_pixel_count)
        if white_pixel_count > 800:
            isChecked.append(1)
            # print("Is checked")
            cv2.drawContours(original, [contour], 0, (0, 255, 0), 2)
            checkedBoxes += 1
            continue
        isChecked.append(0)
    # print(checkedBoxes)
    # print(isChecked)
    # cv2.imshow('thresh', thresh)
    # cv2.imshow('repair', repair)
    # cv2.imshow('original', original)
    # In your Python script (findCheckedBoxes function)
    cv2.imwrite('/tmp/graded_image.jpg', original)  # Save the graded image
    return isChecked

def gradeFile(actualInput, expectedInput):
    maxScore = len(expectedInput)
    score = 0

    # Reverse actualInput using slicing and compare with expectedInput
    for actual, expected in zip(actualInput[::-1], expectedInput):
        if actual == expected:
            score += 1

    result = [score, maxScore, score/maxScore * 100]
    return result

def upload_to_firebase(userId, folderName, file_name, metadata=None):
    bucket = storage.bucket()
    blob = bucket.blob(f"userUploads/{userId}/{folderName}/{file_name}")

    temp_file_path = '/tmp/' + file_name
    print("Saving image to", temp_file_path)
    blob.upload_from_filename(temp_file_path)

    if metadata:
        if isinstance(metadata, list):
            blob.metadata = {
                'gradedImage': True,
                'score': str(metadata[0]),
                'maxScore': str(metadata[1]),
                'percentage': f"{metadata[2]:.2f}"
            }
        elif isinstance(metadata, str):
            blob.metadata = {'qrCodeData': metadata, 'answerKey': True, 'type': 'answerKey'}

    blob.patch()
    return blob.public_url

# Read the image using OpenCV
@functions_framework.http
def process_image(request):
    logger.info("Received full request: %s", request)
    request_json = request.get_json()

    if not request_json:
        return jsonify({"error": "Invalid JSON"}), 400

    image_url = request_json.get('image_url')
    correct_answers = request_json.get('correct_answers')
    user_id = request_json.get('user_id')
    folder_name = request_json.get('folder_name')

    if not image_url or not correct_answers or not user_id or not folder_name:
        return jsonify({"error": "Missing required parameters"}), 400

    image = download_image(image_url)
    if image is None:
        return jsonify({"error": "Failed to download image from URL"}), 400

    evaluation = findCheckedBoxes(image)
    grade = gradeFile(evaluation, correct_answers)

    public_url = upload_to_firebase(user_id, folder_name, 'graded_image.jpg', grade)

    return jsonify({"score": grade[0], "maxScore": grade[1], "percentage": grade[2], "graded_image_url": public_url})

def process_qr_code(image):
    original = image.copy()
    detector = cv2.QRCodeDetector()

    data, bbox, _ = detector.detectAndDecode(image)

    if bbox is not None:
        bbox = np.int32(bbox)
        cv2.polylines(original, [bbox], isClosed=True, color=(0, 0, 255), thickness=2)

    # Return the data and the bounding box
    cv2.imwrite('/tmp/qr_code.jpg', original)
    return data, bbox

@functions_framework.http
def read_qrcode(request):
    request_json = request.get_json()

    if not request_json:
        return jsonify({"error": "Invalid JSON"}), 400
    user_id = request_json.get('user_id')
    image_url = request_json.get('image_url')
    folder_name = request_json.get('folder_name')

    if not image_url or not user_id or not folder_name:
        return jsonify({"error": "Missing required parameters"}), 400

    image = download_image(image_url)
    if image is None:
        return jsonify({"error": "Failed to download image from URL"}), 400
    data, bbox = process_qr_code(image)
    public_url = upload_to_firebase(user_id, folder_name, 'qr_code.jpg', data)



    logger.info(data)
    if bbox is not None:
        return jsonify({"data": data, "answer_key_url": public_url})
    else:
        return jsonify({"error": "No QR code found in the image"}), 400