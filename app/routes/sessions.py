from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from ..database import get_db
from ..models import models
from ..schemas import schemas
from ..utils import security

router = APIRouter(prefix="/sessions", tags=["Sessions"])

@router.post("/start", response_model=schemas.SessionResponse)
def start_session(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    new_session = models.Session(user_id=current_user.id)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@router.patch("/{session_id}/end", response_model=schemas.SessionResponse)
def end_session(
    session_id: UUID,
    session_data: schemas.SessionEnd,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Ensure user owns the session
    if session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this session")

    session.end_time = session_data.end_time
    session.avg_rssi = session_data.avg_rssi
    session.total_distance_km = session_data.total_distance_km
    session.drops_count = session_data.drops_count
    session.handovers_count = session_data.handovers_count
    session.speedtest_count = session_data.speedtest_count
    session.error_count = session_data.error_count

    db.commit()
    db.refresh(session)
    return session
