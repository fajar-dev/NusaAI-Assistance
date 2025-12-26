from sqlalchemy import Column, Integer, String, Text, Float, DateTime, func
from src.core.database import Base

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    similarity_score = Column(Float, nullable=True)
    similarity_results = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
