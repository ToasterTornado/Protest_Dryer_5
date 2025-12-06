from tarfile import NUL
from turtle import forward
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
import torchvision
import timm
import TrashNetDataset as trashnet
import numpy as np
from tqdm import tqdm
import torch.optim as optim
import os
import matplotlib.pyplot as plt

N_CLASSES = 6
class EfficientNetB0Transfer(nn.Module):
    def __init__(self, num_classes):
        super().__init__()

        self.backbone = timm.create_model(
            'efficientnet_b0',
            pretrained=True,
            num_classes=num_classes
        )

        # Freeze entire model
        for p in self.backbone.parameters():
            p.requires_grad = False

        # Replace classifier (timm uses .classifier)
        in_features = self.backbone.classifier.in_features
        self.backbone.classifier = nn.Linear(in_features, num_classes)

    def forward(self, x):
        return self.backbone(x)

import torch

def f1_score(logits, targets, average='macro'):
    """
    logits: (N, C) raw model outputs
    targets: (N,) integer class indices
    average: 'macro' or 'micro'
    """
    # Predicted labels
    preds = torch.argmax(logits, dim=1)

    num_classes = logits.shape[1]
    f1_per_class = []

    for cls in range(num_classes):
        tp = ((preds == cls) & (targets == cls)).sum().float()
        fp = ((preds == cls) & (targets != cls)).sum().float()
        fn = ((preds != cls) & (targets == cls)).sum().float()

        precision = tp / (tp + fp + 1e-8)
        recall    = tp / (tp + fn + 1e-8)
        f1        = 2 * precision * recall / (precision + recall + 1e-8)

        f1_per_class.append(f1)

    f1_per_class = torch.stack(f1_per_class)

    if average == 'macro':
        return f1_per_class.mean()

    elif average == 'micro':
        # Global counts
        tp = sum(((preds == c) & (targets == c)).sum() for c in range(num_classes))
        fp = sum(((preds == c) & (targets != c)).sum() for c in range(num_classes))
        fn = sum(((preds != c) & (targets == c)).sum() for c in range(num_classes))

        precision = tp / (tp + fp + 1e-8)
        recall    = tp / (tp + fn + 1e-8)
        return 2 * precision * recall / (precision + recall + 1e-8)

    else:
        raise ValueError("average must be 'macro' or 'micro'")


def train_epoch(model, dataset, dataloader, criterion, optimizer, bptt_steps=8, verbose=0):
    model.train()
    
    losses = []
    f1_scores = []

    total_loss = 0.0
    total_f1 = 0.0

    for n_batch, batch in tqdm(enumerate(dataloader), total=len(dataset)//BATCH_SIZE):
        img = batch['img']
        target = batch['target']
        optimizer.zero_grad()
            
        logits = model(img)
        predictions = torch.softmax(logits, axis=-1)

        loss = criterion(logits, target)
        f1 = f1_score(predictions, target)

        total_loss += loss.item()
        total_f1 += f1
        losses.append(loss.item())
        f1_scores.append(f1)

        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
            
        if verbose and n_batch % verbose == 0:
            print(f"Train Loss:  {total_loss/((n_batch+1)):.4f}, train f1: {total_f1/(n_batch+1):.4f}")

    
    return losses, f1_scores

@torch.no_grad()
def valid_epoch(model,  dataset, dataloader, criterion, verbose=1):
    model.eval()
    
    losses = []
    f1_scores = []

    total_loss = 0.0
    total_f1 = 0.0

    targets = torch.zeros(len(dataset))
    valid_predictions = torch.zeros(len(dataset), N_CLASSES)
    for n_batch, batch in tqdm(enumerate(dataloader), total=len(dataset)//BATCH_SIZE):
        img = batch['img']
        target = batch['target']
            
        logits = model(img)
        predictions = torch.softmax(logits, axis=-1)

        loss = criterion(logits, target)
        f1 = f1_score(predictions, target)

        targets[n_batch*BATCH_SIZE:(n_batch+1)*BATCH_SIZE] = target
        valid_predictions[n_batch*BATCH_SIZE:(n_batch+1)*BATCH_SIZE, :] = logits

        total_loss += loss.item()
        total_f1 += f1
        losses.append(loss.item())
        f1_scores.append(f1)
            
        if verbose and n_batch % verbose == 0:
            print(f"Valid Loss:  {total_loss/(n_batch+1):.4f}, valid f1: {total_f1/(n_batch+1):.4f}")

    return losses, f1_scores, valid_predictions, targets

MODEL_NAME = "EfficientNet_lighter_augm_v2"
MODELS_DIR_PATH = 'models/'

N_CLASSES = 6
BATCH_SIZE = 32
EARLY_STOPPING_ROUNDS = 5 # -1 - We turn it off
LEARNING_RATE = 5e-03
DROPOUT_P = 0.0
N_EPOCHS = 6
VERBOSE = 10

PARTITION = trashnet.PARTITION
def train_model():
    train_dataloader = DataLoader(trashnet.train_dataset, batch_size=BATCH_SIZE, shuffle=True, drop_last=True)
    valid_dataloader = DataLoader(trashnet.val_dataset, batch_size=BATCH_SIZE, shuffle=True, drop_last=True)

    model = EfficientNetB0Transfer(num_classes=N_CLASSES)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE)

    train_losses, train_f1_scores_ = [], []
    valid_losses, valid_f1_scores_ = [], []

    valid_predictions = []
    valid_loss = np.inf

    early_stopping_rounds = EARLY_STOPPING_ROUNDS
    for n_epoch in range(N_EPOCHS):
        print(f"EPOCH: {n_epoch}")
        print("Training...")
        train_losses_, train_f1_scores_  = train_epoch(model, trashnet.train_dataset, train_dataloader, criterion, optimizer, verbose=VERBOSE)
        train_losses += train_losses_
        
        valid_losses_, valid_f1_scores_ = [np.nan], [np.nan]
        if PARTITION and trashnet.val_dataset is not None:
            print("Validation...")

            valid_losses_, valid_f1_scores_, valid_predictions, targets = valid_epoch(model, trashnet.val_dataset, valid_dataloader, criterion, verbose=VERBOSE)
        
            
            valid_losses += valid_losses_
    
            valid_loss_ = np.mean(valid_losses_)
            if valid_loss_ < valid_loss:
                torch.save({'model': model, 'targets': targets, 'valid_predictions': valid_predictions,
                            'valid_losses': valid_losses, 'train_losses': train_losses}, 
                           os.path.join(MODELS_DIR_PATH, f"{MODEL_NAME}_epoch{n_epoch}.bin")
                           )
                print("The model is saved!")
                early_stopping_rounds = EARLY_STOPPING_ROUNDS

            valid_loss = valid_loss_
        else:
            early_stopping_rounds -= 1
        
        
        print(f"Overall Average Train loss: {np.mean(train_losses_):.4f} Valid Loss: {np.mean(valid_losses_):.4f}")

        if early_stopping_rounds == 0:
                print("The training has stopped!")
                break

    if PARTITION:
        return model, train_losses, valid_losses
    else:
        return model, train_losses

TRAIN = True
if TRAIN and __name__ == "__main__":
    if PARTITION:
        model, train_losses, valid_losses = train_model()
        plt.plot(train_losses)
        plt.plot(valid_losses)
        plt.show()
    else:
       model, train_losses = train_model()