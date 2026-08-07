from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.models import TaskCreate, TaskResponse
from app.database import engine, get_db
from app.db_models import Base, TaskDB

app = FastAPI(
    title="Task Manager API",
    description="A simple REST API built with FastAPI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {
        "message": "Task Manager API is running"
    }


@app.post(
    "/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    new_task = TaskDB(
        title=task.title,
        description=task.description,
        completed=task.completed
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(TaskDB).all()

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
    )

    return task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    updated_task: TaskCreate,
    db: Session = Depends(get_db)
):
    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
    )

    task.title = updated_task.title
    task.description = updated_task.description
    task.completed = updated_task.completed

    db.commit()
    db.refresh(task)

    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
    )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }