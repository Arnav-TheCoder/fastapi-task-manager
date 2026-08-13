from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.models import TaskCreate, TaskResponse, UserCreate, UserResponse, UserLogin
from app.database import engine, get_db
from app.db_models import Base, TaskDB, User
from app.auth import hash_password, verify_password, create_access_token, get_current_user

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
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    new_task = TaskDB(
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=user.id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    tasks = db.query(TaskDB).filter(
        TaskDB.user_id == user.id
    ).all()

    return tasks

@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

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

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing_task = db.query(TaskDB).filter(
        TaskDB.id == task_id,
        TaskDB.user_id == user.id
    ).first()

    if not existing_task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    existing_task.title = task.title
    existing_task.description = task.description
    existing_task.completed = task.completed

    db.commit()
    db.refresh(existing_task)

    return existing_task

@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    user = db.query(User).filter(
        User.username == current_user
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    task = db.query(TaskDB).filter(
        TaskDB.id == task_id,
        TaskDB.user_id == user.id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}

@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    existing_email = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user

@app.post("/login")
def login(
    user: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    access_token = create_access_token(db_user.username)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.get("/protected")
def protected_route(
    current_user: str = Depends(get_current_user)
):
    return {
        "message": "You have access to this protected endpoint!",
        "username": current_user
    }