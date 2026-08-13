import { useState } from "react";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleSuggestDescription = async () => {
    if (!title.trim()) {
      setAiError("Enter a task title first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setAiError("Please log in first.");
      return;
    }

    setAiLoading(true);
    setAiError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ai/suggest-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: title.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to generate description");
      }

      setDescription(data.description);
    } catch (error) {
      console.error("AI suggestion error:", error);
      setAiError(error.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        completed: false,
      }),
    });

    if (!response.ok) {
      console.error("Failed to create task");
      return;
    }

    const newTask = await response.json();

    onTaskCreated(newTask);

    setTitle("");
    setDescription("");
    setAiError("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <button
        type="button"
        onClick={handleSuggestDescription}
        disabled={aiLoading}
      >
        {aiLoading ? "Generating..." : "✨ Suggest Description"}
      </button>

      {aiError && (
        <p className="error-message">
          {aiError}
        </p>
      )}

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <button type="submit">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;