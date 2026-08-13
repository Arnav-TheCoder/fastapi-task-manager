import { useState } from "react";

function TaskItem({ task, onDelete, onToggleComplete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleToggle = () => {
    onToggleComplete(task);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    const updatedTask = {
      ...task,
      title: title.trim(),
      description: description.trim(),
    };

    const success = await onUpdate(updatedTask);

    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  };

  return (
    <div className="task-item">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <button onClick={handleSave}>
            Save
          </button>

          <button onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <span>
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>
      )}

      {!isEditing && (
        <div>
          <button onClick={handleToggle}>
            {task.completed ? "Undo" : "Complete"}
          </button>

          <button onClick={() => setIsEditing(true)}>
            Edit
          </button>

          <button onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskItem;