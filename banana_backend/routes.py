import logging
from fastapi import File, UploadFile, HTTPException, APIRouter, Depends
from io import BytesIO
import os
import uuid
from PIL import Image
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from banana_inspector import analyze_image
from database import SessionLocal
from models import Detect
from schemas import DetectCreate

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

router = APIRouter(prefix="/api")


@router.post("/upload-image/")
async def upload_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: int = 1  # replace with real auth logic if needed
):
  
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Generate a unique filename
        file_extension = file.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)

        # Save and verify image
        contents = await file.read()
        try:
            with Image.open(BytesIO(contents)) as img:
                img.verify()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image file")
        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        logger.info(f"Image uploaded: {unique_filename}")

        # Analyze image
        result = await analyze_image(file_path)
        logger.info(f"Analysis result: {result}")

        # Check if 'puwalu' disease was detected
        if result["status"] == '1' or not result["disease"]:  # If status is 1 or no disease detected
            return {
                "message": "No 'puwalu' disease detected in the image.",
                "detection": {
                    "image": unique_filename,
                    "disease": result.get("disease", "Not detected"),
                    "solution": result.get("solution", "N/A"),
                    "confidence": result.get("confidence", "N/A")
                }
            }

        # If disease is detected, save detection record to DB
        detection = Detect(
            user_id=user_id,
            image_path=unique_filename,
            disease=result["disease"],
            solution=result["solution"],
            confidence=result["confidence"]
        )
        db.add(detection)
        db.commit()
        db.refresh(detection)

        return {
            "message": "Detection completed and stored successfully",
            "detection": {
                "image": unique_filename,
                "disease": result["disease"],
                "solution": result["solution"],
                "confidence": result["confidence"]
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error: {str(e)}")  # Log the error
        raise HTTPException(status_code=500, detail="An internal error occurred. Please try again later.")


@router.get("/detection-history/")
def get_detection_history(db: Session = Depends(get_db), user_id: int = 1):
    try:
        history = db.query(Detect).filter(Detect.user_id == user_id).all()
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/images/{filename}")
def get_image(filename: str):
    file_path = os.path.join(UPLOAD_DIRECTORY, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path)
