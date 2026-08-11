from pydantic import BaseModel, ConfigDict


class TaskCreate(BaseModel):
    title: str
    description: str
    completed: bool = False


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    completed: bool

    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    username: str
    email: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True