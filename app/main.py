from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, sessions, upload, analytics, export

# Create tables (For dev/demo purposes)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DrivePulse Backend", version="1.0.0")

# CORS
origins = ["*"] # Allow all for mobile app dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(sessions.router)
app.include_router(upload.router)
app.include_router(analytics.router)
app.include_router(export.router)

@app.get("/")
def root():
    return {"message": "DrivePulse API is running"}
