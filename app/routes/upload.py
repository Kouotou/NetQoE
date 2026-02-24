from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import models
from ..schemas import schemas
from ..utils import security

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/batch")
def batch_upload(
    batch_data: schemas.BatchUpload,
    db: Session = Depends(get_db),
    # current_user: models.User = Depends(security.get_current_user) # Optional: Enforce auth
):
    # Verify session exists
    session = db.query(models.Session).filter(models.Session.id == batch_data.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        # Bulk Insert Measurements
        if batch_data.measurements:
            db.bulk_insert_mappings(
                models.NetworkMeasurement,
                [
                    {**m.dict(), "session_id": batch_data.session_id}
                    for m in batch_data.measurements
                ]
            )

        # Bulk Insert SpeedTests
        if batch_data.speed_tests:
            db.bulk_insert_mappings(
                models.SpeedTest,
                [
                    {**s.dict(), "session_id": batch_data.session_id}
                    for s in batch_data.speed_tests
                ]
            )

        # Bulk Insert Events
        if batch_data.events:
            db.bulk_insert_mappings(
                models.Event,
                [
                    {**e.dict(), "session_id": batch_data.session_id}
                    for e in batch_data.events
                ]
            )

        # Bulk Insert MOS Feedback
        if batch_data.mos_feedback:
            db.bulk_insert_mappings(
                models.MosFeedback,
                [
                    {**f.dict(), "session_id": batch_data.session_id}
                    for f in batch_data.mos_feedback
                ]
            )
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    return {"status": "success", "message": "Batch upload completed"}
