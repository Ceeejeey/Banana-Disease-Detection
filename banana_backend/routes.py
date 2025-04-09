import logging
from fastapi import File, UploadFile, HTTPException, APIRouter
from io import BytesIO
import os
import uuid
from PIL import Image
from fastapi.responses import FileResponse


from banana_inspector import analyze_image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

router = APIRouter(
    prefix="/api"
)


@router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Generate a unique filename
        file_extension = file.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        # Full path to save the file
        file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)

        # Save the file
        contents = await file.read()

        # Validate image (additional check)
        try:
            with Image.open(BytesIO(contents)) as img:
                img.verify()  # Verify that it's a valid image
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Write the file
        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        logger.info(f"Image uploaded: {unique_filename}")

        # Analyze the image
        result = await analyze_image(file_path)
        logger.info(f"Image analysis result: {result}")

        os.remove(file_path)
        logger.info(f"Image deleted: {unique_filename}")

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/uploaded-images/")
def list_uploaded_images():
    try:
        # Get list of files in upload directory
        images = [
            f for f in os.listdir(UPLOAD_DIRECTORY)
            if os.path.isfile(os.path.join(UPLOAD_DIRECTORY, f))
        ]
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/images/{filename}")
def get_image(filename: str):
    file_path = os.path.join(UPLOAD_DIRECTORY, filename)

    # Check if file exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(file_path)
