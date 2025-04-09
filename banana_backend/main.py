from fastapi import FastAPI
from register import register 
from login import login
from fastapi.middleware.cors import CORSMiddleware
from routes import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, you can specify domains like ["https://example.com"]
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
async def read_root():
    return {"Hello": "World"}


app.include_router(router)
app.include_router(register, prefix="/api")
app.include_router(login, prefix="/api")
