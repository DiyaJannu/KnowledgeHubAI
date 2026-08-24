from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate
from app.models.user import User
from app.database.connection import get_db
from app.core.security import hash_password
from fastapi import HTTPException
from app.schemas.auth import LoginRequest
from app.core.security import verify_password, create_access_token
from app.core.dependencies import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
import os
import shutil

from fastapi import UploadFile, File

from app.models.document import Document
from app.schemas.document import DocumentResponse
from app.services.pdf_service import extract_text
from app.services.text_service import chunk_text
from app.services.embedding_service import create_embeddings
from app.services.search_service import semantic_search
from app.schemas.question import QuestionRequest
from app.services.gemini_service import ask_gemini
from fastapi.responses import FileResponse
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import (
    ChatCreate,
    ChatResponse,
    ChatMessageResponse
)

router = APIRouter()
document_cache = {}


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully!"
    }


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me")
def get_me(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(
        User.email == current_user
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "name": db_user.name,
        "email": db_user.email
    }


@router.post("/upload", response_model=DocumentResponse)
def upload_document(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    upload_folder = "uploads"

    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db_user = db.query(User).filter(
        User.email == current_user
    ).first()

    new_document = Document(
        filename=file.filename,
        filepath=file_path,
        owner_id=db_user.id
    )

    db.add(new_document)
    db.commit()
    db.refresh(new_document)

    # PDF processing is now delayed until the first question
    return new_document


@router.get("/documents", response_model=list[DocumentResponse])
def get_documents(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == current_user).first()

    documents = (
        db.query(Document)
        .filter(Document.owner_id == db_user.id)
        .all()
    )

    return documents


@router.get("/document/{document_id}/file")
def get_document_file(
    document_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(
        User.email == current_user
    ).first()

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.owner_id == db_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    if not os.path.exists(document.filepath):
        raise HTTPException(
            status_code=404,
            detail="PDF file not found"
        )

    return FileResponse(
        path=document.filepath,
        media_type="application/pdf",
        filename=document.filename
    )


@router.delete("/document/{document_id}")
def delete_document(
    document_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(User.email == current_user).first()

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.owner_id == db_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    if os.path.exists(document.filepath):
        os.remove(document.filepath)

    document_cache.pop(document.id, None)

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully"
    }


@router.post("/ask")
def ask_question(
    request: QuestionRequest,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Find logged-in user
    db_user = db.query(User).filter(
        User.email == current_user
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    # Find the selected chat
    chat = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == request.chat_id,
            ChatSession.user_id == db_user.id
        )
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )

    # Get the document connected to this chat
    document = (
        db.query(Document)
        .filter(
            Document.id == chat.document_id,
            Document.owner_id == db_user.id
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    # Check whether this document has already been processed
    if document.id in document_cache:

        chunks = document_cache[document.id]["chunks"]
        embeddings = document_cache[document.id]["embeddings"]

    else:

        # Process PDF only once
        text = extract_text(document.filepath)

        chunks = chunk_text(text)

        embeddings = create_embeddings(chunks)

        # Store processed data in cache
        document_cache[document.id] = {
            "chunks": chunks,
            "embeddings": embeddings
        }

    # Find best matching chunk
    best_chunk, score = semantic_search(
        request.question,
        chunks,
        embeddings
    )

    # Ask Gemini
    answer = ask_gemini(
        context=best_chunk,
        question=request.question
    )

    # Save question and answer
    new_message = ChatMessage(
        question=request.question,
        answer=answer,
        session_id=chat.id
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return {
        "answer": answer
    }


@router.post("/chats", response_model=ChatResponse)
def create_chat(
    chat: ChatCreate,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    document = db.query(Document).filter(
        Document.id == chat.document_id,
        Document.owner_id == user.id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    new_chat = ChatSession(
        title=document.filename,
        user_id=user.id,
        document_id=document.id
    )

    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    return new_chat


@router.get("/chats", response_model=list[ChatResponse])
def get_chats(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    chats = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == user.id)
        .order_by(ChatSession.id.desc())
        .all()
    )

    return chats


@router.get(
    "/chat/{chat_id}",
    response_model=list[ChatMessageResponse]
)
def get_chat_messages(
    chat_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    chat = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == chat_id,
            ChatSession.user_id == user.id
        )
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )

    messages = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.session_id == chat.id
        )
        .order_by(ChatMessage.id.asc())
        .all()
    )

    return messages


@router.delete("/chat/{chat_id}")
def delete_chat(
    chat_id: int,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    chat = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == chat_id,
            ChatSession.user_id == user.id
        )
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found."
        )

    db.delete(chat)
    db.commit()

    return {
        "message": "Chat deleted successfully"
    }
