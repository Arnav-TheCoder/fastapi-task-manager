from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.db_models import Base
from app.config import FRONTEND_URL

from app.routes import ai, tasks, auth, users


app = FastAPI(
    title="Task Manager API",
    description="AI-powered Task Management REST API",
    version="2.0.0"
)


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Register API routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {
        "message": "Task Manager API is running",
        "version": "2.0.0"
    }