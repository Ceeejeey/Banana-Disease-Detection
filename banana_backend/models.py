from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    detections = relationship("Detect", back_populates="user")


class Detect(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    image_path = Column(String, nullable=False)  # e.g., media/image123.png
    disease = Column(String, nullable=False)
    solution = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="detections")
