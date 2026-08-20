from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db_models import TaskDB, User
from app.models import TaskCreate


def get_user(db: Session, username: str):
    user = db.query(User).filter(
        User.username == username
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


def create_task_service(
    db: Session,
    task: TaskCreate,
    username: str
):
    user = get_user(db, username)

    new_task = TaskDB(
        title=task.title,
        description=task.description,
        completed=task.completed,
        priority=task.priority,
        estimated_time=task.estimated_time,
        user_id=user.id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task


def get_tasks_service(
    db: Session,
    username: str,
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    completed: bool | None = None,
    sort_by: str = "id",
    order: str = "asc"
):
    user = get_user(db, username)

    if page < 1:
        page = 1

    if limit < 1:
        limit = 10

    if limit > 100:
        limit = 100

    query = db.query(TaskDB).filter(
        TaskDB.user_id == user.id
    )

    if search:
        search_term = f"%{search}%"

        query = query.filter(
            or_(
                TaskDB.title.ilike(search_term),
                TaskDB.description.ilike(search_term)
            )
        )

    if completed is not None:
        query = query.filter(
            TaskDB.completed == completed
        )

    allowed_sort_fields = {
        "id": TaskDB.id,
        "title": TaskDB.title,
        "completed": TaskDB.completed
    }

    sort_column = allowed_sort_fields.get(
        sort_by,
        TaskDB.id
    )

    if order.lower() == "desc":
        query = query.order_by(
            sort_column.desc()
        )
    else:
        query = query.order_by(
            sort_column.asc()
        )

    offset = (page - 1) * limit

    return (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

def get_task_service(
    db: Session,
    task_id: int,
    username: str
):
    user = get_user(db, username)

    task = db.query(TaskDB).filter(
        TaskDB.id == task_id,
        TaskDB.user_id == user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


def update_task_service(
    db: Session,
    task_id: int,
    task: TaskCreate,
    username: str
):
    existing_task = get_task_service(
        db,
        task_id,
        username
    )

    existing_task.title = task.title
    existing_task.description = task.description
    existing_task.completed = task.completed
    existing_task.priority = task.priority
    existing_task.estimated_time = task.estimated_time

    db.commit()
    db.refresh(existing_task)

    return existing_task


def delete_task_service(
    db: Session,
    task_id: int,
    username: str
):
    task = get_task_service(
        db,
        task_id,
        username
    )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }