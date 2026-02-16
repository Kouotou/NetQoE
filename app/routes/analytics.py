from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID
from typing import List, Dict, Any

from ..database import get_db
from ..models import models
from ..utils import security

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/session/{session_id}/summary")
def get_session_summary(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    session = db.query(models.Session).filter(models.Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Calculate avg MOS if needed (or query from feedback)
    avg_mos = db.query(func.avg(models.MosFeedback.rating))\
        .filter(models.MosFeedback.session_id == session_id).scalar()

    return {
        "session_id": session_id,
        "avg_rssi": session.avg_rssi,
        "avg_mos": avg_mos,
        "total_distance_km": session.total_distance_km,
        "total_drops": session.drops_count,
        "total_handovers": session.handovers_count,
        "total_speed_tests": session.speedtest_count
    }

@router.get("/session/{session_id}/map")
def get_session_map_data(
    session_id: UUID, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    measurements = db.query(
        models.NetworkMeasurement.latitude,
        models.NetworkMeasurement.longitude,
        models.NetworkMeasurement.rssi,
        models.NetworkMeasurement.technology,
        models.NetworkMeasurement.recorded_at
    ).filter(models.NetworkMeasurement.session_id == session_id).all()

    return [
        {
            "lat": m.latitude,
            "lon": m.longitude,
            "rssi": m.rssi,
            "tech": m.technology,
            "time": m.recorded_at
        }
        for m in measurements
    ]

@router.get("/session/{session_id}/mos-correlation")
def get_mos_correlation(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    # Simple correlation: Just return avg RSSI and avg MOS for now
    avg_rssi = db.query(func.avg(models.NetworkMeasurement.rssi))\
        .filter(models.NetworkMeasurement.session_id == session_id).scalar()
    
    avg_mos = db.query(func.avg(models.MosFeedback.rating))\
        .filter(models.MosFeedback.session_id == session_id).scalar()
    
    interpretation = "Unknown"
    if avg_rssi and avg_mos:
        if avg_rssi > -90 and avg_mos > 3:
            interpretation = "Good Signal, Good Quality"
        elif avg_rssi < -110 and avg_mos < 3:
            interpretation = "Poor Signal, Poor Quality"
        else:
            interpretation = "Mixed/Inconclusive"

    return {
        "avg_rssi": avg_rssi,
        "avg_mos": avg_mos,
        "interpretation": interpretation
    }
