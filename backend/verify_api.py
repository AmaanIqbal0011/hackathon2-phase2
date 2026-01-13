import asyncio
import httpx
from uuid import uuid4
import sys

BASE_URL = "http://127.0.0.1:8000"

async def main():
    email = f"test_{uuid4()}@example.com"
    password = "password123"

    try:
        async with httpx.AsyncClient(base_url=BASE_URL, timeout=10.0) as client:
            # 1. Health
            try:
                resp = await client.get("/health")
                print(f"Health: {resp.status_code} {resp.json()}")
            except httpx.ConnectError:
                print("Could not connect to server. Is it running?")
                sys.exit(1)

            assert resp.status_code == 200

            # 2. Signup
            print(f"Signing up {email}...")
            resp = await client.post("/auth/signup", json={"email": email, "password": password, "name": "Test User"})
            print(f"Signup: {resp.status_code}")
            if resp.status_code != 201:
                print(resp.text)
            assert resp.status_code == 201
            user_id = resp.json()["id"]

            # 3. Login
            print("Logging in...")
            resp = await client.post("/auth/login", data={"username": email, "password": password})
            print(f"Login: {resp.status_code}")
            assert resp.status_code == 200
            token = resp.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            # 4. Create Todo
            print("Creating Todo...")
            resp = await client.post("/api/todos", json={"title": "Test Task", "description": "Testing"}, headers=headers)
            print(f"Create: {resp.status_code}")
            assert resp.status_code == 201
            todo = resp.json()
            todo_id = todo["id"]
            assert todo["title"] == "Test Task"

            # 5. List Todos
            print("Listing Todos...")
            resp = await client.get("/api/todos", headers=headers)
            print(f"List: {resp.status_code}")
            assert resp.status_code == 200
            todos = resp.json()
            assert len(todos) >= 1
            assert any(t["id"] == todo_id for t in todos)

            # 6. Update Todo
            print("Updating Todo...")
            resp = await client.put(f"/api/todos/{todo_id}", json={"title": "Updated Task"}, headers=headers)
            print(f"Update: {resp.status_code}")
            assert resp.status_code == 200
            assert resp.json()["title"] == "Updated Task"

            # 6b. Toggle Complete
            print("Toggling Complete...")
            resp = await client.patch(f"/api/todos/{todo_id}/complete", headers=headers)
            print(f"Complete: {resp.status_code}")
            assert resp.status_code == 200
            assert resp.json()["completed"] is True

            # 7. Isolation Test (User B)
            print("Testing Isolation...")
            email2 = f"test2_{uuid4()}@example.com"
            await client.post("/auth/signup", json={"email": email2, "password": password})
            resp = await client.post("/auth/login", data={"username": email2, "password": password})
            token2 = resp.json()["access_token"]
            headers2 = {"Authorization": f"Bearer {token2}"}

            # Try to access User A's todo
            resp = await client.get(f"/api/todos/{todo_id}", headers=headers2)
            print(f"Access User A todo by User B: {resp.status_code}")
            assert resp.status_code == 404

            # 8. Delete Todo
            print("Deleting Todo...")
            resp = await client.delete(f"/api/todos/{todo_id}", headers=headers)
            print(f"Delete: {resp.status_code}")
            assert resp.status_code == 204

            print("Verification Successful!")
    except Exception as e:
        print(f"Test Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
