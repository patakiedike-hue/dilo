import requests
import sys
import json
import uuid
from datetime import datetime

class QuestGearHubAPITester:
    def __init__(self, base_url="https://devfolio-169.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.session_id = f"test-session-{uuid.uuid4()}"

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'} if not files else {}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    response = requests.post(url, data=data, files=files)
                else:
                    response = requests.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_login_valid(self):
        """Test valid admin login"""
        return self.run_test(
            "Valid Admin Login",
            "POST",
            "login",
            200,
            data={"username": "admin", "password": "72926107"}
        )

    def test_login_invalid(self):
        """Test invalid login"""
        return self.run_test(
            "Invalid Login",
            "POST", 
            "login",
            200,  # API returns 200 with success: false
            data={"username": "admin", "password": "wrongpassword"}
        )

    def test_chat_ai(self):
        """Test AI chat functionality"""
        return self.run_test(
            "AI Chat - Beyond Assistant",
            "POST",
            "chat",
            200,
            data={
                "message": "Szia! Mi a questgearhub.com?",
                "session_id": self.session_id
            }
        )

    def test_contact_form(self):
        """Test contact form email sending"""
        return self.run_test(
            "Contact Form Email",
            "POST",
            "contact",
            200,
            data={
                "name": "Test User",
                "email": "test@example.com",
                "message": "Ez egy teszt üzenet a questgearhub.com kapcsolati űrlapjából."
            }
        )

    def test_folder_management(self):
        """Test folder CRUD operations"""
        # Create folder
        folder_name = f"Test Folder {datetime.now().strftime('%H%M%S')}"
        success, folder_data = self.run_test(
            "Create Folder",
            "POST",
            "folders",
            200,
            data={"name": folder_name}
        )
        
        if not success:
            return False
            
        folder_id = folder_data.get('id')
        if not folder_id:
            print("❌ No folder ID returned")
            return False

        # Get folders
        success, _ = self.run_test(
            "Get All Folders",
            "GET",
            "folders",
            200
        )
        
        if not success:
            return False

        # Get images in folder (should be empty)
        success, _ = self.run_test(
            "Get Images in Folder",
            "GET",
            f"images/{folder_id}",
            200
        )
        
        if not success:
            return False

        # Delete folder
        success, _ = self.run_test(
            "Delete Folder",
            "DELETE",
            f"folders/{folder_id}",
            200
        )
        
        return success

def main():
    print("🚀 Starting QuestGearHub API Testing...")
    print("=" * 60)
    
    tester = QuestGearHubAPITester()
    
    # Test authentication
    print("\n📋 AUTHENTICATION TESTS")
    print("-" * 30)
    tester.test_login_valid()
    tester.test_login_invalid()
    
    # Test AI chat (this might take a few seconds)
    print("\n🤖 AI CHAT TESTS")
    print("-" * 30)
    print("⏳ Note: AI responses may take 5-10 seconds...")
    tester.test_chat_ai()
    
    # Test contact form
    print("\n📧 EMAIL TESTS")
    print("-" * 30)
    tester.test_contact_form()
    
    # Test folder management
    print("\n📁 FILE MANAGEMENT TESTS")
    print("-" * 30)
    tester.test_folder_management()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"Success rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("🎉 Backend APIs are working well!")
        return 0
    elif success_rate >= 50:
        print("⚠️  Some backend issues detected")
        return 1
    else:
        print("❌ Major backend issues detected")
        return 2

if __name__ == "__main__":
    sys.exit(main())