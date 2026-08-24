from fastapi import Depends, HTTPException
from app.core.oauth2 import oauth2_scheme
from app.core.security import verify_token


def get_current_user(token: str = Depends(oauth2_scheme)):

    email = verify_token(token)

    if email is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return email
