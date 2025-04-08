from fastapi import FastAPI
from register import register 
from login import login
from fastapi.middleware.cors import CORSMiddleware
from routes import router

app = FastAPI()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


app.include_router(router)
app.include_router(register, prefix="/api")
app.include_router(login, prefix="/api")
