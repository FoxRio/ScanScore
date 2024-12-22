import cv2
import numpy as np

# Load image, convert to grayscale, Gaussian blur, Otsu's threshold
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
        aspect_ratio = w / float(h)
        if len(approx) == 4 and (0.8 <= aspect_ratio <= 1.2):
            cv2.rectangle(original, (x, y), (x + w, y + h), (0, 0, 255), 1)
            checkbox_contours.append(c)

    print('Checkboxes:', len(checkbox_contours))

    checkedBoxes = 0
    isChecked = []
    for contour in checkbox_contours:
        # Create a binary mask for the specified contour
        mask = np.zeros_like(repair)
        cv2.drawContours(mask, [contour], 0, 255, thickness=cv2.FILLED)

        # Apply the mask to the original image
        result = cv2.bitwise_and(repair, mask)
        # cv2.imshow('result', result)
        # Count the number of white pixels in the masked area -- White because the colors are reversed
        white_pixel_count = np.sum(result == 255)

        print("Number of white pixels in the specified contour area:", white_pixel_count)
        if white_pixel_count > 1400:
            isChecked.append(True)
            print("Is checked")
            cv2.drawContours(original, [contour], 0, (0, 255, 0), 2)
            checkedBoxes += 1
            continue
        isChecked.append(False)
    # print(checkedBoxes)
    # print(isChecked)
    # cv2.imshow('thresh', thresh)
    # cv2.imshow('repair', repair)
    # cv2.imshow('original', original)
    cv2.imshow('Result', original)
    cv2.waitKey()
    return isChecked
#
# print(findCheckedBoxes(image))
