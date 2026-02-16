from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, BigInteger, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid

from ..database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    university = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sessions = relationship("Session", back_populates="user")


class Session(Base):
    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True), nullable=True)
    
    # Aggregated stats
    avg_rssi = Column(Float, nullable=True)
    total_distance_km = Column(Float, default=0.0)
    drops_count = Column(Integer, default=0)
    handovers_count = Column(Integer, default=0)
    speedtest_count = Column(Integer, default=0)
    error_count = Column(Integer, default=0)

    user = relationship("User", back_populates="sessions")
    measurements = relationship("NetworkMeasurement", back_populates="session")
    speed_tests = relationship("SpeedTest", back_populates="session")
    events = relationship("Event", back_populates="session")
    mos_feedback = relationship("MosFeedback", back_populates="session")


class NetworkMeasurement(Base):
    __tablename__ = "network_measurements"

    id = Column(BigInteger, primary_key=True, index=True) # BigSerial
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"))
    technology = Column(String, nullable=False)  # 2G, 3G, 4G, 5G
    rssi = Column(Integer, nullable=True)
    rsrp = Column(Integer, nullable=True)
    sinr = Column(Integer, nullable=True)
    cell_id = Column(BigInteger, nullable=True)
    frequency = Column(Integer, nullable=True)
    bandwidth = Column(Integer, nullable=True)
    pci = Column(Integer, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    recorded_at = Column(DateTime(timezone=True), nullable=False)

    session = relationship("Session", back_populates="measurements")


class SpeedTest(Base):
    __tablename__ = "speed_tests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"))
    download_mbps = Column(Float, nullable=False)
    upload_mbps = Column(Float, nullable=False)
    ping_ms = Column(Float, nullable=False)
    jitter_ms = Column(Float, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    recorded_at = Column(DateTime(timezone=True), nullable=False)

    session = relationship("Session", back_populates="speed_tests")


class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"))
    event_type = Column(String, nullable=False) # handover, drop, call_start, speed_test
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    signal_strength = Column(Integer, nullable=True)
    recorded_at = Column(DateTime(timezone=True), nullable=False)

    session = relationship("Session", back_populates="events")


class MosFeedback(Base):
    __tablename__ = "mos_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id"))
    rating = Column(Integer, nullable=False) # 1-5
    emotion = Column(String, nullable=True)
    comment = Column(Text, nullable=True)
    technology = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("Session", back_populates="mos_feedback")
