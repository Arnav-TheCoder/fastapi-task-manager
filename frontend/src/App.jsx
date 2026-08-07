import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/tasks");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load tasks. Make sure the API is running.");
    } finally {
      setLoading(false);
    }
  };

  fetchTasks();
}, []);

  const handleTaskCreated = (newTask) => {
    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  const handleDelete = async (taskId) => {
    const response = await fetch(
      `http://127.0.0.1:8000/tasks/${taskId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      console.error("Failed to delete task");
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  };
  const handleToggleComplete = async (task) => {
  const response = await fetch(
    `http://127.0.0.1:8000/tasks/${task.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        completed: !task.completed,
      }),
    }
  );

  if (!response.ok) {
    console.error("Failed to update task");
    return;
  }

  const updatedTask = await response.json();

  setTasks((currentTasks) =>
    currentTasks.map((currentTask) =>
      currentTask.id === updatedTask.id
        ? updatedTask
        : currentTask
    )
  );
};

  return (
  <div className="app">
    <header className="header">
      <div>
        <h1>Task Manager</h1>
        <p>Manage your tasks with React, FastAPI and PostgreSQL.</p>
      </div>

      <div className="task-count">
        <strong>{tasks.length}</strong>
        <span>Total Tasks</span>
      </div>
    </header>

    <main>
      <section className="form-section">
        <h2>Add a New Task</h2>
        <TaskForm onTaskCreated={handleTaskCreated} />
      </section>

      <section className="tasks-section">
        <div className="section-header">
          <h2>Your Tasks</h2>
          <span>{tasks.filter((task) => task.completed).length} completed</span>
        </div>

        {loading && <p className="status-message">Loading tasks...</p>}

{error && <p className="error-message">{error}</p>}

{!loading && !error && tasks.length === 0 && (
  <p className="status-message">
    No tasks yet. Add your first task above.
  </p>
)}

{!loading && !error && tasks.length > 0 && (
  <TaskList
    tasks={tasks}
    onDelete={handleDelete}
    onToggleComplete={handleToggleComplete}
  />
)}
      </section>
    </main>
  </div>
);
}

export default App;