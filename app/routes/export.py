from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from uuid import UUID
import pandas as pd
import io

from ..database import get_db, engine
from ..models import models
from ..utils import security

router = APIRouter(prefix="/export", tags=["Export"])

@router.get("/session/{session_id}/csv")
def export_session_csv(
    session_id: UUID,
    current_user: models.User = Depends(security.get_current_user)
):
    # Using pandas read_sql for simplicity
    query = f"SELECT * FROM network_measurements WHERE session_id = '{session_id}'"
    
    try:
        df = pd.read_sql(query, engine)
        
        stream = io.StringIO()
        df.to_csv(stream, index=False)
        response = StreamingResponse(iter([stream.getvalue()]),
                                     media_type="text/csv")
        response.headers["Content-Disposition"] = f"attachment; filename=session_{session_id}.csv"
        return response
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")
