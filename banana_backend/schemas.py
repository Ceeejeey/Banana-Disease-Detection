from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# For storing new detections
class DetectCreate(BaseModel):
    user_id: int
    image_path: str
    disease: str
    solution: str
    confidence: float


# For returning detection data (e.g., in history)
class DetectOut(BaseModel):
    id: int
    user_id: int
    image_path: str
    disease: str
    solution: str
    confidence: float
    created_at: datetime

    class Config:
        orm_mode = True
