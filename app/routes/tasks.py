from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user
from app.models import TaskCreate, TaskResponse

from app.services.task_service import (
    create_task_service,
    get_tasks_service,
    get_task_service,
    update_task_service,
    delete_task_service
)


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return create_task_service(
        db,
        task,
        current_user
    )


@router.get(
    "",
    response_model=list[TaskResponse]
)
def get_tasks(
    page: int = 1,
    limit: int = 10,
    search: str | None = None,
    completed: bool | None = None,
    sort_by: str = "id",
    order: str = "asc",
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return get_tasks_service(
        db,
        current_user,
        page,
        limit,
        search,
        completed,
        sort_by,
        order
    )


@router.get(
    "/{task_id}",
    response_model=TaskResponse
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return get_task_service(
        db,
        task_id,
        current_user
    )


@router.put(
    "/{task_id}",
    response_model=TaskResponse
)
def update_task(
    task_id: int,
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return update_task_service(
        db,
        task_id,
        task,
        current_user
    )


@router.delete(
    "/{task_id}"
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    return delete_task_service(
        db,
        task_id,
        current_user
    )