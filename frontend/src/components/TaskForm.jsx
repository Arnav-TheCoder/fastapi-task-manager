import { useState } from "react";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
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
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

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