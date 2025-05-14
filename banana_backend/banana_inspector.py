import asyncio
from ultralytics import YOLO
import matplotlib.pyplot as plt
import cv2

solutions = {
    "Cigar-End": "Spray Thiophanate methyl (1g per one water liter) and cover the whole banana.",
    "Crown-rot": """
    1) When cutting the canes, they should be cut at the very harvesting stage. 
    That is, they should still be green and about 75% of their maximum diameter before harvesting. 
    And the plant should be cut at a time of approximately 75-90 days after planting.

    2) Also, when cutting the avery, since the surface area of the avery is large when cutting with knives,
     it is best if you can cut it with something like a sharp thread instead of using a knife. If you are cutting with a knife,
    it is best to dip the knife in a concentrated chlorine solution.
    """,
    "Cracked nuts": """
    1) Calcium, Boron treatment should be given. Dolomite can be mixed at a rate of 200g per square meter and Boron Borax
     at a rate of 5g per square meter and added to the soil.(It should be applied 2-3 weeks before applying fertilizer.) 
     But this treatment takes a while to get the treatment.

    2) For a quick response, Calcium nitrate can be mixed with water and sprayed on the avaries.
    (20g per 1l and Boron Borax at a rate of 2g per water.)
    """,
    "Anthracnose": """
    1) Prune and remove infected leaves and plant parts to reduce fungal spread.

    2) Apply a fungicide containing copper or azoxystrobin at the early stages of infection.

    3) Ensure proper spacing between plants to improve air circulation.

    4) Avoid overhead irrigation to keep leaves dry and prevent fungal growth.

    5) Maintain good field sanitation to prevent the fungus from persisting in plant debris.
    """
}


async def analyze_image(image_path: str) -> dict:
    try:
        # Load your YOLOv8 model (Primary model - Puwalu)
        model = YOLO('puwaluModel/puwalu.pt')  # Path to your primary model

        # Run inference on the image for initial detection
        results = model.predict(image_path)

        # Load secondary model for further analysis
        secondary_model = YOLO('diseaseModel/disease.pt')  # Path to your secondary model

        # Run inference on the same image again
        secondary_results = secondary_model.predict(image_path)

        # Flag for any detections in secondary analysis
        detections_found = False

        # Process secondary predictions
        for result in secondary_results:
            class_ids = result.boxes.cls.numpy()
            class_names = [secondary_model.names[int(class_id)] for class_id in class_ids]
            confidences = result.boxes.conf.numpy()

            # Display detections
            for class_name, conf in zip(class_names, confidences):
                detections_found = True
                print(f"Secondary Detection - Class: {class_name}, Confidence: {conf:.2f}")
                return {
                    "status": 3,
                    "disease": class_name,
                    "confidence": float(conf),
                    "solution": solutions.get(class_name, "No solution available")
                }

        # If no detections are found
        print("No detections found in the secondary analysis.")
        return {
            "status": 2,
            "disease": "",
            "confidence": ""
        }

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return {
            "status": 0,
            "disease": "",
            "confidence": ""
        }


