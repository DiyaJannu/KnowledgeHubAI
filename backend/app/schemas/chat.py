from pydantic import BaseModel


class ChatCreate(BaseModel):
    document_id: int


class ChatResponse(BaseModel):
    id: int
    title: str
    document_id: int

    class Config:
        from_attributes = True


class ChatMessageResponse(BaseModel):
    id: int
    question: str
    answer: str

    class Config:
        from_attributes = True
