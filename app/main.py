from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.models import Task
from app.database import engine, get_db
from app.db_models import Base, TaskDB

app = FastAPI(
    title="Task Manager API",
    description="A simple REST API built with FastAPI",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {
        "message": "Task Manager API is running"
    }


@app.post("/tasks")
def create_task(task: Task, db: Session = Depends(get_db)):
    new_task = TaskDB(
        title=task.title,
        description=task.description,
        completed=task.completed
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(TaskDB).all()

@app.get("/tasks/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()

    if task is None:
        return {"error": "Task not found"}

    return task

@app.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    updated_task: Task,
    db: Session = Depends(get_db)
):
    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()

    if task is None:
        return {"error": "Task not found"}

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
        return {"error": "Task not found"}

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }