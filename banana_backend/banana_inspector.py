import asyncio
import os
import cv2
from inference_sdk import InferenceHTTPClient
from ultralytics import YOLO

# Set your Roboflow API Key
os.environ["ROBOFLOW_API_KEY"] = "Xfr6Y5g9Pajgl2tatQ82"

# Define solutions for diseases
solutions = {
    "Cordana": """
        1) Apply a fungicide containing mancozeb or chlorothalonil. 
        2) Remove and destroy infected leaves to prevent further spread. 
        3) Ensure good air circulation around the plants to minimize moisture buildup.
    """,
    "Pestalotiopsis": """
        1) Prune and destroy infected plant parts to reduce fungal spread.
        2) Apply a copper-based fungicide to affected areas.
        3) Improve drainage and avoid waterlogging.
    """,
    "Sigatoka": """
        1) Apply fungicides containing azoxystrobin or propiconazole.
        2) Increase spacing between plants to improve air circulation.
        3) Ensure regular pruning of older, infected leaves.
    """,
    "Healthy": "No treatment required. The leaf is in good health.",

    # Fruit Diseases
    "Cigar-End": """
        Spray Thiophanate methyl (1g per one water liter) and cover the whole banana.
    """,
    "Crown-rot": """
        Cut canes at the green stage. Use concentrated chlorine solution to disinfect cutting tools.
    """,
    "Cracked nuts": """
        Apply Calcium nitrate and Boron Borax as a quick response spray treatment.
    """,
    "Anthracnose": """
        Apply a fungicide containing copper or azoxystrobin. Ensure proper field sanitation.
    """
}

# Model IDs
LEAF_DISEASE_MODEL_ID = "banana-leaf-disease-2-fzorv/1"  # Roboflow Leaf Disease Model
FRUIT_MODEL_PATH = 'diseaseModel/disease.pt'  # Local path for fruit disease model

# Initialize the Roboflow Inference Client
client = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key=os.environ["ROBOFLOW_API_KEY"]
)


async def analyze_image(image_path: str) -> dict:
    try:
        # Check if the image path is valid
        if not os.path.exists(image_path):
            print(f"Error: Image path '{image_path}' does not exist.")
            return {
                "status": 0,
                "type": None,
                "disease": None,
                "confidence": None,
                "solution": None
            }

        # ============================
        # Step 1: Detect Leaf Diseases
        # ============================
        print("Checking for leaf diseases...")
        result = client.infer(image_path, model_id=LEAF_DISEASE_MODEL_ID)

        predictions = result["predictions"]
        if len(predictions) > 0:
            prediction = predictions[0]
            disease_name = prediction["class"]
            confidence = float(prediction["confidence"])

            print(f"Leaf Disease Detected - Class: {disease_name}, Confidence: {confidence:.2f}")

            # Check if the detected class is in the new classes
            if disease_name in ["Cordana", "Healthy", "Pestalotiopsis", "Sigatoka"]:
                return {
                    "status": 1,
                    "type": "leaf",
                    "disease": disease_name,
                    "confidence": confidence,
                    "solution": solutions.get(disease_name, "No solution available")
                }

        # =============================
        # Step 2: Detect Fruit Diseases
        # =============================
        print("No leaf disease detected. Proceeding with fruit disease detection...")
        fruit_model = YOLO(FRUIT_MODEL_PATH)
        fruit_results = fruit_model.predict(image_path)

        for result in fruit_results:
            class_ids = result.boxes.cls.numpy()
            confidences = result.boxes.conf.numpy()

            for class_id, conf in zip(class_ids, confidences):
                # Ensure that the class ID is an integer
                class_name = fruit_model.names[int(class_id)]
                conf = float(conf)  # Convert to scalar float

                print(f"Fruit Disease Detected - Class: {class_name}, Confidence: {conf:.2f}")

                if class_name in ["Cigar-End", "Crown-rot", "Cracked nuts", "Anthracnose"]:
                    return {
                        "status": 2,
                        "type": "fruit",
                        "disease": class_name,
                        "confidence": conf,
                        "solution": solutions.get(class_name, "No solution available")
                    }

        # No diseases detected in both leaf and fruit
        print("No disease detected in leaf or fruit.")
        return {
            "status": 3,
            "type": None,
            "disease": "No disease detected",
            "confidence": 0.0,
            "solution": "No treatment required."
        }

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {
            "status": 0,
            "type": None,
            "disease": None,
            "confidence": None,
            "solution": None
        }


# Example Usage
# asyncio.run(analyze_image("path/to/your/image.jpg"))
