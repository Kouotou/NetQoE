# 🛠️ DrivePulse Backend Setup Guide

This guide will walk you through setting up the real infrastructure required for the backend to work: PostgreSQL Database and Environment Variables.

## 1. Install PostgreSQL

If you haven't installed PostgreSQL yet:

1.  **Download**: Go to [postgresql.org/download/windows/](https://www.postgresql.org/download/windows/) and download the interactive installer.
2.  **Install**: Run the installer.
    *   **Password**: When asked for a password for the superuser (`postgres`), **write it down**. You will need it.
    *   **Port**: Keep the default port `5432`.
3.  **Verify**: Open "SQL Shell (psql)" from your Start Menu, press Enter for defaults, and type your password when prompted.

## 2. Create the Database

Open **pgAdmin 4** (installed with Postgres) or use the **SQL Shell** to run these commands:

```sql
-- Create the database
CREATE DATABASE drivepulse;

-- (Optional) Create a specific user for the app
CREATE USER drivepulse_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE drivepulse TO drivepulse_user;
```

## 3. Configure the Environment

1.  In the project folder, make a copy of `.env.example` and name it `.env`.
    ```powershell
    copy .env.example .env
    ```
2.  Open `.env` in a text editor and update the values:

    **DATABASE_URL**:
    *   If using the default `postgres` user:
        `postgresql+psycopg://postgres:YOUR_INSTALL_PASSWORD@localhost:5432/drivepulse`
    *   If using the custom user created above:
        `postgresql+psycopg://drivepulse_user:secure_password_123@localhost:5432/drivepulse`

    **SECRET_KEY**:
    *   This is used to sign JWT tokens. Make it random and long.
    *   You can generate one by running this in your terminal:
        ```powershell
        python -c "import secrets; print(secrets.token_hex(32))"
        ```
    *   Paste the output into the `SECRET_KEY` field in `.env`.

## 4. Run the Application

Now that the database is running and the config is set, run the app:

```powershell
.\venv\Scripts\uvicorn app.main:app --reload
```

The app will automatically connect to your new Local PostgreSQL database and create the necessary tables (`users`, `sessions`, etc.) the first time it runs.

## 5. Testing with Real Data

Now you can use the API Docs ([http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)) to:
1.  **Register** a new user (`/auth/register`).
2.  **Login** (`/auth/login`) to get an `access_token`.
3.  Click simple "Authorize" button at top right of Swagger UI and paste the token to test protected endpoints.
