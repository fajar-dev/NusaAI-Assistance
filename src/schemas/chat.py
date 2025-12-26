from typing import List, Optional, Any
from pydantic import BaseModel

class Source(BaseModel):
    content: str
    metadata: dict
    score: float

class AskRequest(BaseModel):
    users: Any
    space: Optional[Any] = None
    question: str

class AskResponse(BaseModel):
    question: str
    answer: str
    sources: List[Source]
