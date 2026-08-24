from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def home():
    return {
        "message": "Welcome to KnowledgeHub AI 🚀"
    }


@router.get("/about")
def about():
    return {
        "project": "KnowledgeHub AI",
        "version": "1.0",
        "developer": "Diya Jannu"
    }
