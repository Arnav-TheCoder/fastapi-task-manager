function TaskItem({ task, onDelete, onToggleComplete }) {
  const handleToggle = () => {
    onToggleComplete(task);
  };

  return (
    <div className="task-item">
      <div>
        <h3>{task.title}</h3>
        <p>{task.description}</p>

        <span>
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>

      <div>
        <button onClick={handleToggle}>
          {task.completed ? "Undo" : "Complete"}
        </button>

        <button onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;