import torch
import torch.nn
from training import EfficientNetB0Transfer, trashnet
import matplotlib.pyplot as plt
import os
import cv2


MODELS_PATH = "models/"
MODEL_NAME = "EfficientNet_lighter_augm_v2_epoch2.bin"
TEST_IMGS_DIR_PATH = "test_imgs/"

torch_load = torch.load(os.path.join(MODELS_PATH, MODEL_NAME), weights_only=False)
model = torch_load['model']

INPUT_IMG = torch.zeros((3, trashnet.IMAGE_SIZE, trashnet.IMAGE_SIZE)) #Test dummy image

TEST_IMG_PATHS = [path for path in os.scandir(TEST_IMGS_DIR_PATH)]
TEST_IMG_FILE = TEST_IMG_PATHS[0]
img = cv2.imread(TEST_IMG_FILE.path)
img_tensor = torch.tensor( trashnet.VAL_TRANSFORMS(image=img)['image'], dtype=torch.float ).unsqueeze(0)

with torch.no_grad():
    out = model(img_tensor)

out = torch.softmax(out, axis=-1)
predicted_idx = torch.argmax(out, axis=-1).item()
predicted_class = trashnet.IDX2CLASS[predicted_idx]

print(f"Predicted class: {predicted_class}")
cv2.imshow("window", img) #Show only the first channel of the image
cv2.waitKey(5000)