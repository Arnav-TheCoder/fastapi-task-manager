import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import Card from "./Card";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState("");

  // Generate AI description
  const handleAISuggestion = async () => {
    if (!title.trim()) {
      setError("Enter a task title first.");
      return;
    }

    setAiLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/suggest-description`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "AI suggestion failed"
        );
      }

      setDescription(data.description);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Analyze task using AI
  const analyzeTask = async () => {
    if (!title.trim()) {
      setError("Enter a task title first.");
      return;
    }

    setAiLoading(true);
    setError("");
    setAiResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ai/analyze-task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "AI analysis failed"
        );
      }

      setAiResult(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Create task
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in first.");
      }

      const taskData = {
        title: title.trim(),
        description: description.trim(),
        completed: false,
        priority: aiResult?.priority || "Medium",
        estimated_time:
          aiResult?.estimated_time || null,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to create task"
        );
      }

      onTaskCreated(data);

      setTitle("");
      setDescription("");
      setAiResult(null);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form
        onSubmit={handleSubmit}
        className="task-form"
      >
        <Input
          label="Task Title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Enter task title"
          required
        />

        <div className="input-group">
          <label>Description</label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Enter task description"
          />
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleAISuggestion}
          disabled={aiLoading}
        >
          {aiLoading
            ? "Generating..."
            : "✨ Generate with AI"}
        </Button>

        <Button
          type="button"
          onClick={analyzeTask}
          disabled={aiLoading}
        >
          {aiLoading
            ? "Analyzing..."
            : "🤖 Analyze Task with AI"}
        </Button>

        {aiResult && (
          <div className="ai-result">
            <p>
              <strong>AI Priority:</strong>{" "}
              {aiResult.priority}
            </p>

            <p>
              <strong>Estimated Time:</strong>{" "}
              {aiResult.estimated_time}
            </p>
          </div>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Add Task"}
        </Button>
      </form>
    </Card>
  );
}

export default TaskForm;