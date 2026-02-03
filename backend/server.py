from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import asyncio
import resend
from emergentintegrations.llm.chat import LlmChat, UserMessage
import shutil
import mimetypes

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend API Key
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RECIPIENT_EMAIL = os.environ.get('RECIPIENT_EMAIL', 'szabolcssr8@gmail.com')

# Perplexity API Key
PERPLEXITY_API_KEY = os.environ.get('PERPLEXITY_API_KEY', '')

# Create uploads directory
UPLOADS_DIR = ROOT_DIR / 'uploads'
UPLOADS_DIR.mkdir(exist_ok=True)

# Create the main app
app = FastAPI()

# CORS middleware FIRST
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create API router
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    username: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    session_id: str

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactResponse(BaseModel):
    success: bool
    message: str

class Folder(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FolderCreate(BaseModel):
    name: str

class Image(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    folder_id: str
    filename: str
    url: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Routes
@api_router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Admin login endpoint"""
    if request.username == "admin" and request.password == "72926107":
        return LoginResponse(
            success=True,
            message="Sikeres bejelentkezés",
            username=request.username
        )
    return LoginResponse(
        success=False,
        message="Hibás felhasználónév vagy jelszó"
    )

@api_router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatMessage):
    """AI chat endpoint with Beyond assistant"""
    try:
        system_message = """Beyond vagy, a questgearhub.com hivatalos online asszisztense.

Ha a kérdés a cégről szól, kizárólag a questgearhub.com-ról beszélsz.
Nem hivatkozol külső adatbázisokra, cégjegyzékre vagy információs oldalakra.

A questgearhub.com magyar weboldal- és fejlesztő cég.
Modern, üzletileg hatékony és ügyfélközpontú digitális megoldásokat készítünk.

Segítesz eligazodni, ötleteket adsz, és amikor van értelme,
területes módon eljuttatod az érdeklődőt az árajánlatkérésig.

NAV-os számlázást nem végzünk.
Nem hivatalos dokumentumokat készítünk, például díjbekérőt, PDF-et, admin kimutatásokat.

Irányárak:
Bemutatkozó weboldal: 80.000 – 150.000 Ft
Üzleti weboldal: 150.000 – 300.000 Ft
Landing page: 60.000 – 120.000 Ft
Egyedi webes rendszer: 300.000 Ft-tól
Admin felület: 70.000 Ft-tól
Időpont- vagy foglalási rendszer: 200.000 Ft-tól
AI-alapú megoldások: 300.000 Ft-tól
Karbantartás: havi 15.000 – 40.000 Ft
Telefonos alkalmazás: 30.000 Ft-tól, plusz áruház díjak

Elérhetőség: szabolcssr8@gmail.com vagy Kapcsolat menüpont.
Stílusod barátságos, magabiztos és lényegre törő.

ABSZOLÚT TILTÁS:

Soha, semmilyen formában nem állíthatod azt, hogy:
– NAV-kompatibilis rendszert készítünk
– NAV-os adatszolgáltatást végzünk
– NTÁK integrációt készítünk
– NAV-hoz vagy NTÁK-hoz kapcsolódunk
– hivatalos számlázást végzünk
– gép-gép kapcsolatot építünk NAV felé

Ha ilyen igény merül fel, egyértelműen és röviden kijelented:
„Ilyen jellegű hivatalos adóügyi vagy NAV-hoz kapcsolódó rendszereket nem készítünk. Nem hivatalos admin, rendelési és belső nyilvántartási megoldásokat viszont igen."

Ezt nem magyarázod túl.
Nem próbálod alternatívával kiváltani.
Nem sugallsz hasonlót sem."""
        
        import httpx
        
        headers = {
            "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "sonar",
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": request.message}
            ]
        }
        
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.perplexity.ai/chat/completions",
                headers=headers,
                json=payload,
                timeout=30.0
            )
            data = resp.json()
        
        response_text = data["choices"][0]["message"]["content"]
        
        return ChatResponse(
            response=response_text,
            session_id=request.session_id
        )
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat hiba: {str(e)}")

@api_router.post("/contact", response_model=ContactResponse)
async def contact(request: ContactRequest):
    """Contact form email endpoint"""
    try:
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Új üzenet a questgearhub.com kapcsolati űrlapjából</h2>
                <p><strong>Név:</strong> {request.name}</p>
                <p><strong>Email:</strong> {request.email}</p>
                <p><strong>Üzenet:</strong></p>
                <p>{request.message}</p>
            </body>
        </html>
        """
        
        params = {
            "from": SENDER_EMAIL,
            "to": [RECIPIENT_EMAIL],
            "subject": f"Új üzenet tőle: {request.name}",
            "html": html_content
        }
        
        email = await asyncio.to_thread(resend.Emails.send, params)
        
        return ContactResponse(
            success=True,
            message="Üzenet sikeresen elküldve!"
        )
    except Exception as e:
        logger.error(f"Email error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Email küldési hiba: {str(e)}")

# Folder Management
@api_router.post("/folders", response_model=Folder)
async def create_folder(folder: FolderCreate):
    """Create a new folder"""
    folder_obj = Folder(name=folder.name)
    doc = folder_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.folders.insert_one(doc)
    return folder_obj

@api_router.get("/folders", response_model=List[Folder])
async def get_folders():
    """Get all folders"""
    folders = await db.folders.find({}, {"_id": 0}).to_list(1000)
    for folder in folders:
        if isinstance(folder['created_at'], str):
            folder['created_at'] = datetime.fromisoformat(folder['created_at'])
    return folders

@api_router.delete("/folders/{folder_id}")
async def delete_folder(folder_id: str):
    """Delete a folder and its images"""
    # Delete all images in this folder
    images = await db.images.find({"folder_id": folder_id}, {"_id": 0}).to_list(1000)
    for image in images:
        file_path = ROOT_DIR / 'uploads' / image['filename']
        if file_path.exists():
            file_path.unlink()
    
    await db.images.delete_many({"folder_id": folder_id})
    await db.folders.delete_one({"id": folder_id})
    return {"success": True}

# Image Management
@api_router.post("/images")
async def upload_image(folder_id: str = Form(...), file: UploadFile = File(...)):
    """Upload an image to a folder"""
    try:
        # Generate unique filename
        file_ext = file.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = UPLOADS_DIR / unique_filename
        
        # Save file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create image record
        image_obj = Image(
            folder_id=folder_id,
            filename=unique_filename,
            url=f"/api/uploads/{unique_filename}"
        )
        
        doc = image_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.images.insert_one(doc)
        return image_obj
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Feltöltési hiba: {str(e)}")

@api_router.get("/images/{folder_id}", response_model=List[Image])
async def get_images(folder_id: str):
    """Get all images in a folder"""
    images = await db.images.find({"folder_id": folder_id}, {"_id": 0}).to_list(1000)
    for image in images:
        if isinstance(image['created_at'], str):
            image['created_at'] = datetime.fromisoformat(image['created_at'])
    return images

@api_router.delete("/images/{image_id}")
async def delete_image(image_id: str):
    """Delete an image"""
    image = await db.images.find_one({"id": image_id}, {"_id": 0})
    if image:
        file_path = ROOT_DIR / 'uploads' / image['filename']
        if file_path.exists():
            file_path.unlink()
        await db.images.delete_one({"id": image_id})
    return {"success": True}

# Custom route for serving images with correct content-type
@api_router.get("/uploads/{filename}")
def serve_image(filename: str):
    """Serve uploaded images with correct content-type"""
    file_path = UPLOADS_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Guess the mime type
    mime_type, _ = mimetypes.guess_type(str(file_path))
    if mime_type is None:
        mime_type = "application/octet-stream"
    
    return FileResponse(
        path=str(file_path),
        media_type=mime_type,
        filename=filename
    )

# Include router
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()