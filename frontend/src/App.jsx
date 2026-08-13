import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("username") || ""
  );

  const handleLogin = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setLoggedInUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLoggedInUser("");
    setTasks([]);
  };

  const checkAuthentication = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Authentication failed");
        return;
      }

      alert(`Authenticated as ${data.username}`);
    } catch (error) {
      alert("Could not connect to the server");
    }
  };

  // Get tasks belonging to the logged-in user
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        setTasks([]);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
        setError("");
      } catch (error) {
        console.error(error);
        setError("Unable to load tasks. Make sure the API is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [loggedInUser]);

  // Add newly created task to the UI
  const handleTaskCreated = (newTask) => {
    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  // Delete task
  const handleDelete = async (taskId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to delete task");
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (task) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleUpdate = async (updatedTask) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("User is not authenticated");
    return false;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/tasks/${updatedTask.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          completed: updatedTask.completed,
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to update task");
      return false;
    }

    const updated = await response.json();

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updated.id ? updated : task
      )
    );

    return true;
  } catch (error) {
    console.error("Error updating task:", error);
    return false;
  }
};

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Task Manager</h1>

          <Register />
          <Login onLogin={handleLogin} />

          {loggedInUser && (
            <div>
              <p>Logged in as: {loggedInUser}</p>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}

          <button onClick={checkAuthentication}>
            Check Authentication
          </button>

          <p>
            Manage your tasks with React, FastAPI and PostgreSQL.
          </p>
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

            <span>
              {tasks.filter((task) => task.completed).length} completed
            </span>
          </div>

          {loading && (
            <p className="status-message">
              Loading tasks...
            </p>
          )}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

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
              onUpdate={handleUpdate} 
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;