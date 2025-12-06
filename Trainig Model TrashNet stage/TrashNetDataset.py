import os
import torch
from torch.utils.data import Dataset, Subset
from torchvision import transforms
from PIL import Image
from typing import List, Tuple, Dict
from sklearn.model_selection import train_test_split
import numpy as np
# import shutil
import random
import cv2 # OpenCV for fast image loading (required by Albumentations)
import albumentations as A # The core augmentation library
from albumentations.pytorch import ToTensorV2 

# --- 1. Configuration and Hyperparameters ---
IMAGE_SIZE = 224

# DEFAULT_TRANSFORMS = transforms.Compose([
#     transforms.Resize((224, 224)),       
#     transforms.ToTensor(),               
#     transforms.Normalize(                
#         mean=[0.485, 0.456, 0.406], # ImageNet mean
#         std=[0.229, 0.224, 0.225]   # ImageNet standard deviation
#     )
# ])

TRAIN_TRANSFORMS = A.Compose([
    # Required to match EfficientNet input size
    A.Resize(IMAGE_SIZE, IMAGE_SIZE),
    
    # Core Augmentations:
    A.HorizontalFlip(p=0.5),
    # A.VerticalFlip(p=0.5),
    # A.ShiftScaleRotate(shift_limit=0.0625, scale_limit=0.1, rotate_limit=15, p=0.6), # Affine transforms
    A.RandomBrightnessContrast(brightness_limit=0.1, contrast_limit=0.2, p=0.5),
    
    # Geometric Augmentations:
    # A.Cutout(num_holes=8, max_h_size=8, max_w_size=8, fill_value=0, p=0.3), # Drops random patches
    # A.CoarseDropout(max_holes=8, max_height=8, max_width=8, p=0.3),

    # Blur Augmentation:
    # A.OneOf([
    #     A.GaussNoise(p=0.2),
    #     A.ISONoise(p=0.2),
    # ], p=0.4),
    
    # Normalization (Crucial step for pre-trained models)
    A.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
    # Convert the NumPy array to a PyTorch Tensor
    ToTensorV2(),
])

# 2.2. Validation/Test Transforms (Only resize and normalize)
VAL_TRANSFORMS = A.Compose([
    A.Resize(IMAGE_SIZE, IMAGE_SIZE),
    A.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
    ToTensorV2(),
])

# Define the 6 classes based on your data structure
CLASSES = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
DATA_DIR = 'unsplit_trashnet_data' 
PARTITION = True # if we want to partition the data into train and validation sets
VALIDATION_SPLIT_RATIO = 0.2 # 20% of data will be used for validation

# --- 2. The Revised Dataset Class ---

class TrashNetDataset(Dataset):
    """
    A custom PyTorch Dataset that takes a pre-compiled list of (path, label) samples 
    rather than scanning a root directory. This makes it highly flexible for splitting.
    """
    def __init__(self, samples: List[Tuple[str, int]], transform=None):
        """
        Initializes the dataset.
        
        Args:
            samples (List[Tuple[str, int]]): A list of (image_path, label) tuples.
            transform (callable, optional): Optional transform to be applied on a sample.
        """
        self.samples = samples
        self.transform = transform
        
        if not self.samples:
            raise ValueError("The samples list cannot be empty.")
            
        print(f"Dataset initialized with {len(self.samples)} samples.")

    def __len__(self) -> int:
        """Returns the total number of samples in the dataset."""
        return len(self.samples)

    def __getitem__(self, index: int) -> Tuple[torch.Tensor, int]:
        """
        Retrieves one sample (image tensor and its label) from the dataset.
        """
        path, target = self.samples[index]
        
        try:
            # Load the image and convert it to RGB
            image = cv2.imread(path)
            # Check for failed read (e.g., file corruption)
            if image is None:
                 raise FileNotFoundError(f"OpenCV failed to read image at {path}")
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # --- CRITICAL CHANGE 2: Apply Albumentations transform ---
            if self.transform:
                # Albumentations takes a dict {'image': numpy_array} and returns transformed results
                transformed = self.transform(image=image)
                image_tensor = transformed["image"]
            else:
                # Fallback (less efficient if transforms are not used)
                image_tensor = ToTensorV2()(image=image)["image"]

        except Exception as e:
            # Fallback for corrupted/unreadable images
            print(f"Error loading image {path}. Returning dummy data.")
            # Return zero tensor and label 0 to avoid crashing the DataLoader
            return torch.zeros(3, 224, 224), 0 

        return {'img': image_tensor, 'target': target}

# --- 3. Utility Function for Data Gathering and Splitting ---

def get_all_samples_and_split(root_dir: str, val_split: float = 0.2, random_state: int = 42):
    """
    Scans the root directory, gathers all image paths and labels, and splits them 
    into training and validation lists.
    
    Returns: 
        (train_samples, val_samples, class_to_idx)
    """
    
    all_samples: List[Tuple[str, int]] = []
    class_to_idx: Dict[str, int] = {}
    
    # 3.1. Gather all files and create class mapping
    available_extensions = ('.jpg', '.jpeg', '.png')
    class_names = sorted([d.name for d in os.scandir(root_dir) if d.is_dir()])
    
    if not class_names:
        raise FileNotFoundError(f"No class folders found in {root_dir}. Check path.")
        
    for i, class_name in enumerate(class_names):
        class_to_idx[class_name] = i
        class_path = os.path.join(root_dir, class_name)
        target_label = i

        for entry in os.scandir(class_path):
            if entry.is_file() and entry.name.lower().endswith(available_extensions):
                all_samples.append((entry.path, target_label))

    # Check if we actually found any images
    if not all_samples:
        raise RuntimeError(f"Found 0 images in subfolders of: {root_dir}")

    # 3.2. Prepare for splitting
    paths = np.array([s[0] for s in all_samples])
    labels = np.array([s[1] for s in all_samples])
    
    # 3.3. Perform the split
    # We use 'stratify=labels' to ensure the class distribution is maintained in both splits
    train_paths, val_paths, train_labels, val_labels = train_test_split(
        paths, labels, test_size=val_split, stratify=labels, random_state=random_state
    )
    
    # Reassemble into the required list of tuples for the Dataset class
    train_samples = list(zip(train_paths, train_labels))
    val_samples = list(zip(val_paths, val_labels))
    
    print(f"Total images found: {len(all_samples)}")
    print(f"Training images: {len(train_samples)}")
    print(f"Validation images: {len(val_samples)}")
    
    return train_samples, val_samples, class_to_idx

DATA_DIR = 'Trashnetdataset'
VALIDATION_SPLIT_RATIO = 0.3

train_samples, val_samples, class_map = get_all_samples_and_split(
    root_dir=DATA_DIR, 
    val_split=VALIDATION_SPLIT_RATIO
)

CLASS2IDX = class_map.copy()
IDX2CLASS = {v: k for k, v in CLASS2IDX.items()}

print(f"\nClass Mapping: {class_map}")


train_dataset = TrashNetDataset(samples=train_samples, transform=TRAIN_TRANSFORMS)
val_dataset = TrashNetDataset(samples=val_samples, transform=VAL_TRANSFORMS)

train_dataset[0]
print(len(train_dataset), len(val_dataset))