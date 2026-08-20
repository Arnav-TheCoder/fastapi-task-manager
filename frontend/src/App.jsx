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

  // Day 16 controls
  const [search, setSearch] = useState("");
  const [completedFilter, setCompletedFilter] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const handleLogin = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);

    setLoggedInUser(username);
    setPage(1);
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
      const response = await fetch(
        "http://127.0.0.1:8000/protected",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your tasks.");
          setLoading(false);
          return;
        }

        const params = new URLSearchParams();

        params.append("page", page);
        params.append("limit", limit);
        params.append("sort_by", sortBy);
        params.append("order", order);

        if (search.trim()) {
          params.append("search", search.trim());
        }

        if (completedFilter !== "") {
          params.append("completed", completedFilter);
        }

        const response = await fetch(
          `http://127.0.0.1:8000/tasks?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();

        setTasks(data);
      } catch (error) {
        console.error(error);
        setError(
          "Unable to load tasks. Make sure the API is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [
    page,
    limit,
    search,
    completedFilter,
    sortBy,
    order,
  ]);

  // Create task
  const handleTaskCreated = (newTask) => {
    setTasks((currentTasks) => [
      newTask,
      ...currentTasks,
    ]);
  };

  // Delete task
  const handleDelete = async (taskId) => {
    const token = localStorage.getItem("token");

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
        throw new Error("Failed to delete task");
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskId
        )
      );
    } catch (error) {
      console.error(error);
      setError("Failed to delete task.");
    }
  };

  // Toggle complete
  const handleToggleComplete = async (task) => {
    const token = localStorage.getItem("token");

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
        throw new Error("Failed to update task");
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
      console.error(error);
      setError("Failed to update task.");
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
              <p>
                Logged in as: {loggedInUser}
              </p>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}

          <button onClick={checkAuthentication}>
            Check Authentication
          </button>

          <p>
            Manage your tasks with React,
            FastAPI and PostgreSQL.
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

          <TaskForm
            onTaskCreated={handleTaskCreated}
          />
        </section>

        <section className="tasks-section">

          <div className="section-header">
            <h2>Your Tasks</h2>

            <span>
              {
                tasks.filter(
                  (task) => task.completed
                ).length
              } completed
            </span>
          </div>

          {/* Day 16 Controls */}
          <div className="task-controls">

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />

            <select
              value={completedFilter}
              onChange={(event) => {
                setCompletedFilter(
                  event.target.value
                );
                setPage(1);
              }}
            >
              <option value="">
                All Tasks
              </option>

              <option value="false">
                Pending
              </option>

              <option value="true">
                Completed
              </option>
            </select>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setPage(1);
              }}
            >
              <option value="id">
                ID
              </option>

              <option value="title">
                Title
              </option>

              <option value="completed">
                Status
              </option>
            </select>

            <select
              value={order}
              onChange={(event) => {
                setOrder(event.target.value);
                setPage(1);
              }}
            >
              <option value="asc">
                Ascending
              </option>

              <option value="desc">
                Descending
              </option>
            </select>

          </div>

          {/* Loading */}
          {loading && (
            <p className="status-message">
              Loading tasks...
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            tasks.length === 0 && (
              <p className="status-message">
                No tasks found.
              </p>
            )}

          {/* Tasks */}
          {!loading &&
            !error &&
            tasks.length > 0 && (
              <>
                <TaskList
                  tasks={tasks}
                  onDelete={handleDelete}
                  onToggleComplete={
                    handleToggleComplete
                  }
                />

                {/* Pagination */}
                <div className="pagination">

                  <button
                    onClick={() =>
                      setPage(
                        (currentPage) =>
                          Math.max(
                            1,
                            currentPage - 1
                          )
                      )
                    }
                    disabled={page === 1}
                  >
                    Previous
                  </button>

                  <span>
                    Page {page}
                  </span>

                  <button
                    onClick={() =>
                      setPage(
                        (currentPage) =>
                          currentPage + 1
                      )
                    }
                    disabled={
                      tasks.length < limit
                    }
                  >
                    Next
                  </button>

                </div>
              </>
            )}

        </section>

      </main>
    </div>
  );
}

export default App;