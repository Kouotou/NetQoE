# NetQoE - Android
A crowdsourced QoE/QoS monitoring tool for cellular networks in Cameroon.

## Features
- **Low Battery Impact:** Event-driven signal sampling.
- **QoE Integration:** Correlates MOS (1-5) with radio KPIs.
- **Offline First:** Batched uploads via WorkManager.

## Architecture
Modular Clean Architecture (MVVM) using Kotlin & Jetpack Compose.
# DrivePulse Backend

A minimal, high-performance FastAPI backend for the DrivePulse Android Drive Test application. This backend handles user authentication, session tracking, network measurement collection, analytics, and data export.

## 🚀 Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens) + Bcrypt hashing
- **Data Processing**: Pandas (for CSV exports)
- **Server**: Uvicorn

## 📂 Project Structure

```
app/
├── main.py              # Application entry point
├── database.py          # Database connection & session handling
├── models/              # SQLAlchemy database models
│   └── models.py
├── schemas/             # Pydantic schemas for validation
│   └── schemas.py
├── routes/              # API endpoints
│   ├── auth.py          # Login & Registration
│   ├── sessions.py      # Drive test session management
│   ├── upload.py        # Batch upload of measurements
│   ├── analytics.py     # Session summaries & maps
│   └── export.py        # CSV export functionality
└── utils/               # Helper utilities
    └── security.py      # Auth & Password helpers
```

## 🛠️ Setup & Installation

### 1. Prerequisites
- Python 3.9+
- PostgreSQL (Local or Remote)

### 2. Clone the Repository
```bash
git clone https://github.com/Kouotou/NetQoE.git
cd Drivepulse_backend
```

### 3. Create Virtual Environment
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Configure Database
By default, the app connects to a local PostgreSQL instance. You can configure this by setting the `DATABASE_URL` environment variable.

Default: `postgresql+psycopg://postgres:postgres@localhost/drivepulse`

**Note:** The application will automatically create necessary tables on startup for development convenience.

## ▶️ Running the Application

Start the server with hot-reload enabled:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload 
# <--uvicorn app.main:app --reload-->
```

## 📚 API Documentation

Once the server is running, you can access the interactive API documentation:

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## 🔑 Key Features

### Authentication
- `/auth/register`: Create a new user account.
- `/auth/login`: Authenticate and receive a JWT access token.

### Drive Test Sessions
- `/sessions/start`: Begin a new drive test session.
- `/sessions/{id}/end`: End a session and save aggregate stats.

### Data Collection
- `/upload/batch`: Efficiently upload large batches of:
  - Network Measurements (RSSI, RSRP, SINR, etc.)
  - Speed Tests
  - Events (Handovers, Drops)
  - MOS Feedback

### Analytics & Export
- `/analytics/session/{id}/summary`: Get session KPIs.
- `/analytics/session/{id}/map`: Get geo-tagged signal data.
- `/export/session/{id}/csv`: Download session data as CSV.
