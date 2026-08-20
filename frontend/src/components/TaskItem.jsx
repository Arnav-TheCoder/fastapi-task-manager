import Button from "./Button";
import Card from "./Card";

function TaskItem({
  task,
  onDelete,
  onToggleComplete,
}) {
  return (
    <Card className="task-item">
      <div className="task-content">
        <h3>{task.title}</h3>

        <p>
          {task.description || "No description"}
        </p>

        <span
          className={
            task.completed
              ? "task-status completed"
              : "task-status pending"
          }
        >
          {task.completed
            ? "Completed"
            : "Pending"}
        </span>

        <div className="task-ai-info">
          <span>
            Priority:{" "}
            {task.priority || "Medium"}
          </span>

          <span>
            Estimated Time:{" "}
            {task.estimated_time ||
              "Not estimated"}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <Button
          variant="secondary"
          onClick={() =>
            onToggleComplete(task)
          }
        >
          {task.completed
            ? "Mark Pending"
            : "Complete"}
        </Button>

        <Button
          variant="danger"
          onClick={() =>
            onDelete(task.id)
          }
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}

export default TaskItem;