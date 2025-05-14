import os
import yaml
import time
from ultralytics import YOLO

# Paths
MODEL_PATH = "/home/gihan/Documents/Banana-Diseases/banana_backend/puwaluModel/best.pt"
DATASET_PATH = "/home/gihan/Documents/Banana-Diseases/banana_backend/puwalu dataset/puwalu-banana.v1i.yolov8"

# Updated Data Config
data_config = {
    "train": os.path.join(DATASET_PATH, "train/images"),
    "val": os.path.join(DATASET_PATH, "valid/images"),
    "test": os.path.join(DATASET_PATH, "test/images"),
    "nc": 2,  # Updated to 2 classes
    "names": ["banana", "puwalu-banana"]
}

# Save the updated config
data_config_path = os.path.join(DATASET_PATH, "data.yaml")
with open(data_config_path, "w") as file:
    yaml.dump(data_config, file)

# Training Parameters
model = YOLO(MODEL_PATH)

# Start time
start_time = time.time()

# Fine-tuning with adjustments for better accuracy
model.train(
    data=data_config_path,
    epochs=20,            # Increased epochs for better convergence
    batch=8,              # Reduced batch size for more precise updates
    imgsz=416,            # Image size for training
    device="cpu",         # CPU training
    optimizer="SGD",      # Optimizer choice for fine-tuning
    lr0=0.001,            # Base learning rate
    lrf=0.01,             # Learning rate final multiplier
    weight_decay=0.0005,  # Weight decay to prevent overfitting
    patience=10,          # Early stopping patience
    augment=True,         # Keep augmentations for better generalization
    mosaic=0.7,           # Increased mosaic augmentation
    mixup=0.2,            # Increased mixup augmentation
    project="Puwalu_Banana_Training",
    name="fine_tuned_training"
)

# Track training time
end_time = time.time()
training_time = end_time - start_time
hours = training_time // 3600
minutes = (training_time % 3600) // 60
seconds = training_time % 60

print(f"Training completed in {int(hours)}h {int(minutes)}m {int(seconds)}s")

# Evaluation after each epoch
for epoch in range(20):  # Assuming 20 epochs
    # Evaluation on validation data after each epoch
    results = model.val(
        data=data_config_path,
        split="val",         # Using validation set for evaluation
        imgsz=416,           # Image size for evaluation
        device="cpu",        # CPU for evaluation
        batch=4              # Batch size for evaluation
    )

    print(f"Epoch {epoch + 1}/20 - Accuracy Metrics:")
    print(f"Precision: {results['metrics/precision']:.4f}")
    print(f"Recall: {results['metrics/recall']:.4f}")
    print(f"mAP50: {results['metrics/mAP50']:.4f}")
    print(f"mAP50-95: {results['metrics/mAP50-95']:.4f}")
    print("-" * 50)

# Testing the model after training
print("\nEvaluating model accuracy on test dataset...\n")
results = model.val(
    data=data_config_path,
    split="test",         # Using test set for final evaluation
    imgsz=416,            # Image size for evaluation
    device="cpu",         # CPU for evaluation
    batch=4               # Batch size for evaluation
)

print("\nTest Evaluation Results:")
print(f"Precision: {results['metrics/precision']:.4f}")
print(f"Recall: {results['metrics/recall']:.4f}")
print(f"mAP50: {results['metrics/mAP50']:.4f}")
print(f"mAP50-95: {results['metrics/mAP50-95']:.4f}")
