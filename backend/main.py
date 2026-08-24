from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import home
from app.routers import user

from app.database.connection import Base, engine
from app.models.user import User
from app.models.document import Document
from app.models.chat import ChatSession, ChatMessage


app = FastAPI()


# Allow React frontend to access FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Include routers
app.include_router(home.router)
app.include_router(user.router)
