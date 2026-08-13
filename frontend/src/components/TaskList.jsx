import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  onDelete,
  onToggleComplete,
  onUpdate,
}) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default TaskList;