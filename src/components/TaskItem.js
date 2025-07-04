import React, { useState } from "react";
import "./../styles/TaskItem.css"; // Create this CSS file

const TaskItem = ({ task, editTask, deleteTask, toggleComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);

  const handleEditSave = () => {
    if (editedTitle.trim()) {
      editTask(task.id, editedTitle.trim(), editedDescription.trim());
      setIsEditing(false);
    } else {
      alert("Task title cannot be empty!");
    }
  };

  // Function to format date for display
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // Uses user's locale
  };

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-content">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="edit-input"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="edit-textarea"
            ></textarea>
          </>
        ) : (
          <>
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            <span className="task-date">
              Created: {formatDateTime(task.createdAt)}
            </span>
          </>
        )}
      </div>
      <div className="task-actions">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task.id)}
          title="Toggle Completion"
        />
        {isEditing ? (
          <button onClick={handleEditSave} className="save-button">
            Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit
          </button>
        )}
        <button onClick={() => deleteTask(task.id)} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
