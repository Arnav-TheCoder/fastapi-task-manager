# Task Manager API + React Dashboard

A full-stack task management application built using FastAPI, PostgreSQL, and React.

## Features

- Create tasks
- View all tasks
- View task by ID
- Update task status
- Delete tasks
- PostgreSQL database persistence
- React dashboard interface
- REST API architecture

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic

### Frontend
- React
- Vite
- JavaScript
- CSS

## Architecture

React Frontend
↓
FastAPI REST API
↓
SQLAlchemy ORM
↓
PostgreSQL Database

## Project Structure
fastapi-task-manager/

│

├── app/

│ ├── main.py

│ ├── database.py

│ ├── models.py

│ └── db_models.py

│

├── frontend/

│ ├── src/

│ └── package.json

│

├── requirements.txt

└── README.md


## Backend Setup

Create virtual environment:

```bash
python -m venv venv
```
Activate:

Windows:
```
venv\Scripts\activate
```
Install dependencies:
```
pip install -r requirements.txt
```
Create .env:
```
DATABASE_URL=your_postgresql_connection_string
```
Run backend:
```
uvicorn app.main:app --reload
```
API documentation:
```
http://127.0.0.1:8000/docs
```
Frontend Setup

Go to frontend:
```
cd frontend
```
Install dependencies:
```
npm install
```
Run:
```
npm run dev
```
Frontend:
```
http://localhost:5173
```
API Endpoints:
| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| POST   | /tasks      | Create task       |
| GET    | /tasks      | Get all tasks     |
| GET    | /tasks/{id} | Get specific task |
| PUT    | /tasks/{id} | Update task       |
| DELETE | /tasks/{id} | Delete task       |

Future Improvements:
- Authentication using JWT
- User accounts
- Task categories
- Deployment
- Automated testing
