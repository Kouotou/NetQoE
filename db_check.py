from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# Load env explicitly
load_dotenv()

url = os.getenv("DATABASE_URL")
print(f"DEBUG: DATABASE_URL from .env is: {url}")

if not url:
    print("ERROR: DATABASE_URL not found in environment variables.")
    # Fallback default from code
    url = "postgresql+psycopg://postgres:postgres@localhost/drivepulse"
    print(f"DEBUG: Using fallback URL: {url}")

try:
    engine = create_engine(url)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("SUCCESS: Connected to database successfully!")
except Exception as e:
    print(f"FAILED: Connection failed.\nError: {e}")
