import requests
import sys

BASE_URL = "http://127.0.0.1:8000"
test_user = {
    "email": "bilal@drivepulse.com",
    "password": "password",
    "full_name": "Ahmad Bilal",
    "university": "University of Buea"
}

print(f"Registering user: {test_user['email']}...")

try:
    response = requests.post(f"{BASE_URL}/auth/register", json=test_user)
    if response.status_code == 200:
        print("SUCCESS: User registered successfully!")
        print(response.json())
    elif response.status_code == 400 and "already registered" in response.text:
        print("INFO: User already registered.")
    else:
        print(f"FAILED: {response.status_code} - {response.text}")
        sys.exit(1)
        
except Exception as e:
    print(f"ERROR: Could not connect to {BASE_URL}. Is the server running?")
    print(e)
    sys.exit(1)
