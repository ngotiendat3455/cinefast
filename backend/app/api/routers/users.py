from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session, require_auth
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.auth_service import update_user_profile

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(require_auth)):
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_profile(
    data: UserUpdate,
    current_user: User = Depends(require_auth),
    db: Session = Depends(get_db_session),
):
    return update_user_profile(db, current_user, data.name, data.email, data.password)
