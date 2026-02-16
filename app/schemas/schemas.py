from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# --- Auth ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    university: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


# --- Measurements ---
class MeasurementCreate(BaseModel):
    technology: str
    rssi: Optional[int] = None
    rsrp: Optional[int] = None
    sinr: Optional[int] = None
    cell_id: Optional[int] = None
    frequency: Optional[int] = None
    bandwidth: Optional[int] = None
    pci: Optional[int] = None
    latitude: float
    longitude: float
    recorded_at: datetime

class SpeedTestCreate(BaseModel):
    download_mbps: float
    upload_mbps: float
    ping_ms: float
    jitter_ms: Optional[float] = None
    latitude: float
    longitude: float
    recorded_at: datetime

class EventCreate(BaseModel):
    event_type: str
    latitude: float
    longitude: float
    signal_strength: Optional[int] = None
    recorded_at: datetime

class MosFeedbackCreate(BaseModel):
    rating: int
    emotion: Optional[str] = None
    comment: Optional[str] = None
    technology: Optional[str] = None
    latitude: float
    longitude: float


# --- Session ---
class SessionStart(BaseModel):
    pass

class SessionEnd(BaseModel):
    end_time: datetime
    avg_rssi: Optional[float] = None
    total_distance_km: float = 0.0
    drops_count: int = 0
    handovers_count: int = 0
    speedtest_count: int = 0
    error_count: int = 0

class SessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    start_time: datetime
    end_time: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# --- Upload ---
class BatchUpload(BaseModel):
    session_id: UUID
    measurements: List[MeasurementCreate] = []
    speed_tests: List[SpeedTestCreate] = []
    events: List[EventCreate] = []
    mos_feedback: List[MosFeedbackCreate] = []
