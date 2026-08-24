from pydantic import BaseModel


class QuestionRequest(BaseModel):

    question: str

    chat_id: int
