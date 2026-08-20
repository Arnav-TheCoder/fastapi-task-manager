# Task Manager API + React Dashboard

A full-stack task management application built using FastAPI, PostgreSQL, and React, with JWT-based authentication and AI-powered task description generation using Ollama.

## Features

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected API endpoints
- Create tasks
- View all tasks
- View task by ID
- Update and edit tasks
- Mark tasks as completed or pending
- Delete tasks
- User-specific task management
- PostgreSQL database persistence
- React dashboard interface
- REST API architecture
- AI-powered task description suggestions

## Tech Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT
- Passlib / bcrypt
- Requests

### Frontend

- React
- Vite
- JavaScript
- CSS

### AI

- Ollama
- Qwen2.5 3B

## Architecture
```text
React Frontend
       ↓
FastAPI REST API
       ↓
Authentication + Business Logic
       ↓
SQLAlchemy ORM
       ↓
PostgreSQL Database
```
For AI-powered features:
```text
React Frontend
       ↓
FastAPI
       ↓
Ollama API
       ↓
Qwen2.5 3B
```
## Project Structure
```text
fastapi-task-manager/
│
├── app/
│   ├── main.py
│   ├── database.py
│   ├── db_models.py
│   ├── models.py
│   ├── auth.py
│   └── ai.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── requirements.txt
├── .gitignore
└── README.md
```

## Backend Setup

### 1. Create a virtual environment

```bash
python -m venv venv
```
### 2. Activate the virtual environment

Windows:

```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure PostgreSQL

Create a `.env` file and add your PostgreSQL connection string:
```text
DATABASE_URL=your_postgresql_connection_string
```

### 5. Run the backend
```bash
uvicorn app.main:app --reload
```

Backend:
```bash
http://127.0.0.1:8000
```

API documentation:
```bash
http://127.0.0.1:8000/docs
```

## Frontend Setup

Go to the frontend directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Run the development server:
```bash
npm run dev
```
Frontend:
```bash
http://localhost:5173
```

## Authentication

The application uses JWT authentication.

Users can:

- Register an account.
- Log in to receive a JWT token.
- Use the token to access protected endpoints.
- Manage only their own tasks.

The token is sent using the `Authorization` header:
```bash
Authorization: Bearer <token>
```

## AI Integration

The Task Management System includes AI-powered task analysis using Ollama and the Qwen2.5 3B local language model.

### AI Features

- AI-generated task descriptions
- Task priority suggestion
- Estimated task completion time
- Local AI inference using Ollama
- AI results stored with tasks in PostgreSQL

### AI Workflow

1. User enters a task title and description.
2. React sends the task information to FastAPI.
3. FastAPI sends a structured prompt to Ollama.
4. Qwen2.5 3B analyzes the task.
5. AI returns priority and estimated completion time.
6. FastAPI returns the AI results to React.
7. The results are stored with the task in PostgreSQL.

### AI Stack

- Ollama
- Qwen2.5 3B
- FastAPI
- React
- PostgreSQL

### How It Works

1. User enters a task title.
2. React sends the title to the FastAPI backend.
3. FastAPI sends a prompt to the local Ollama API.
4. Qwen2.5 3B generates a task description.
5. FastAPI returns the generated description.
6. React displays the suggestion in the description field.
7. The user can edit the generated description before creating the task.

### AI Stack
- Ollama
- Qwen2.5 3B
- FastAPI
- React

### Ollama Setup

Install Ollama and download the model:
```bash
ollama pull qwen2.5:3b
```

Make sure Ollama is running before using the AI feature.

## API Endpoints
### Authentication

| Method | Endpoint    |  Description                    |
| ------ | ----------- | -----------------               |
|  POST  |  /users     |  Register a new user            |
|  POST  |  /login     |  Log in and receive a JWT token |
|  GET   |  /protected |  Test authenticated access      |

### Tasks
| Method | Endpoint | Description |
| ------ | ----------- | ----------------- |
|  POST    |/tasks | Create a task |
|  GET     |/tasks | Get the user's tasks |
|  GET     |/tasks/{id} | Get a specific task|
|  PUT     |/tasks/{id} | Update a task |
|  DELETE  |/tasks/{id} | Delete a task |

### AI
|  Method | Endpoint | Description |
| ------ | ----------- | ----------------- |
|  POST |  /ai/suggest-description | Generate an AI-powered task description |
|  POST |  /ai/analyze-task        | Analyze task priority and estimated completion time |

### Testing

The API can be tested using the built-in FastAPI Swagger documentation:
```bash
http://127.0.0.1:8000/docs
```
The React frontend can be used to test:

- User registration
- Login and logout
- Task creation
- AI description generation
- Task editing
- Task completion
- Task deletion

## Future Improvements
- Add AI-powered task priority and category suggestions.
- Implement due dates, reminders, and notifications.
- Add advanced task search and filtering.
- Add automated unit and integration testing.
- Deploy the full-stack application using Docker and a cloud platform.