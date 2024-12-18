import grading
import vision
import cv2
image = cv2.imread('checkboxes2.png')

evaluation = vision.findCheckedBoxes(image)
