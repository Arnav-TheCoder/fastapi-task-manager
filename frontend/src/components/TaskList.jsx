import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  onDelete,
  onToggleComplete,
}) {
  if (tasks.length === 0) {
    return (
      <p className="status-message">
        No tasks found.
      </p>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}

export default TaskList;