from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class TaskDB(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(String, nullable=False)

    completed = Column(Boolean, default=False)

    priority = Column(
        String,
        nullable=True,
        default="Medium"
    )

    estimated_time = Column(
        String,
        nullable=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    user = relationship(
        "User",
        back_populates="tasks"
    )


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(
        String,
        nullable=False
    )

    tasks = relationship(
        "TaskDB",
        back_populates="user"
    )