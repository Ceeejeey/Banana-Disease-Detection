import cv2
import matplotlib.pyplot as plt
from ultralytics import YOLO

# Hardcoded image path
IMAGE_PATH = "/home/gihan/Documents/Banana-Diseases/banana_backend/uploads/test.jpg"

# Solutions for diseases
solutions = {
    "Cigar end": "Spray Thiophanate methyl (1g per one water liter) and cover the whole banana.",
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
    """
}

def test_disease_model(image_path: str):
    try:
        # Load the disease model
        model = YOLO('diseaseModel/best.pt')  # Update the path if needed

        print(f"Running detection on image: {image_path}")

        # Run inference
        results = model.predict(image_path)

        # Check for detections
        detections_found = False

        for result in results:
            class_ids = result.boxes.cls.numpy()
            class_names = [model.names[int(class_id)] for class_id in class_ids]
            confidences = result.boxes.conf.numpy()

            for class_name, conf in zip(class_names, confidences):
                detections_found = True
                print(f"Detected Disease: {class_name} with Confidence: {conf:.2f}")
                print(f"Solution: {solutions.get(class_name, 'No solution available')}\n")

        # Plot annotated image if detections found
        if detections_found:
            annotated_image = results[0].plot()
            annotated_image_rgb = cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB)
            plt.imshow(annotated_image_rgb)
            plt.axis('off')
            plt.title("Detection Result")
            plt.show()
        else:
            print("No diseases detected in the image.")

    except Exception as e:
        print(f"Error occurred: {str(e)}")

# Run the test
test_disease_model(IMAGE_PATH)
