// src/components/TaskItem.js
import React, { useState } from "react";
import "./../styles/TaskItem.css"; // Component-specific styling

const TaskItem = ({ task, editTask, deleteTask, toggleComplete }) => {
  const [isEditing, setIsEditing] = useState(false); // State to control edit mode
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState(
    task.priority || "Medium"
  ); // Default to Medium if not set
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || ""); // Ensure it's an empty string for date input
  const [editedTags, setEditedTags] = useState(
    task.tags ? task.tags.join(", ") : ""
  ); // State for editing tags
  const [editError, setEditError] = useState(""); // State for displaying edit error

  const handleEditSave = () => {
    const trimmedEditedTitle = editedTitle.trim();
    if (!trimmedEditedTitle) {
      setEditError("Task title cannot be empty!"); // Set error message
      return;
    }

    setEditError(""); // Clear any previous error

    // Split tags string into an array, clean, and filter empty strings
    const tagsArray = editedTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    // Call editTask from props with all updated fields
    editTask(
      task.id,
      trimmedEditedTitle,
      editedDescription.trim(),
      editedPriority,
      editedDueDate,
      tagsArray
    );
    setIsEditing(false); // Exit edit mode
  };

  // Helper to format creation date/time
  const formatCreationDateTime = (isoString) => {
    const date = new Date(isoString);
    // Use toLocaleString for user-friendly, localized date and time
    return date.toLocaleString();
  };

  // Helper to format due date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "N/A";
    // Add T00:00:00 to ensure date is parsed consistently in local timezone
    // This is important for date inputs which often provide YYYY-MM-DD and without time, can lead to timezone issues
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString(); // Formats date based on user's locale
  };

  return (
    // Apply class for completed tasks and priority for visual distinction
    <div
      className={`task-item ${task.completed ? "completed" : ""} priority-${
        (task.priority || "medium").toLowerCase() // Ensure priority is lowercase for class name
      }`}
      data-testid="task-item-container" // For testing purposes
    >
      <div className="task-content">
        {isEditing ? (
          // Edit mode UI
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => {
                setEditedTitle(e.target.value);
                if (editError) setEditError(""); // Clear error when user types
              }}
              className="edit-input"
              aria-label="Edit Task Title"
              aria-describedby={editError ? "edit-task-title-error" : undefined}
            />
            {editError && (
              <p
                id="edit-task-title-error"
                className="error-message"
                role="alert"
              >
                {editError}
              </p>
            )}
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="edit-textarea"
              aria-label="Edit Task Description"
            ></textarea>
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              className="edit-select"
              aria-label="Edit Task Priority"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <input
              type="date"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="edit-input"
              aria-label="Edit Due Date"
            />
            <input
              type="text"
              value={editedTags}
              onChange={(e) => setEditedTags(e.target.value)}
              className="edit-input"
              placeholder="Tags (comma-separated)"
              aria-label="Edit Tags"
            />
          </>
        ) : (
          // Display mode UI
          <>
            <h3
              style={task.completed ? { textDecoration: "line-through" } : {}}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <span className="task-priority">
              Priority: {task.priority || "Medium"}
            </span>{" "}
            <span className="task-date">
              Created: {formatCreationDateTime(task.createdAt)}
            </span>{" "}
            {task.dueDate && (
              <span className="task-date">
                Due: {formatDisplayDate(task.dueDate)}
              </span>
            )}{" "}
            {task.tags &&
              task.tags.length > 0 && ( // Display tags if they exist
                <div className="task-tags">
                  {task.tags.map((tag, index) => (
                    <span key={index} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
          </>
        )}
      </div>
      <div className="task-actions">
        {/* Toggle Complete Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task.id)}
          title="Toggle Completion"
          aria-label={`Mark task "${task.title}" as ${
            task.completed ? "pending" : "completed"
          }`}
        />
        {isEditing ? (
          // Save button in edit mode
          <button
            onClick={handleEditSave}
            className="save-button"
            aria-label="Save changes"
          >
            Save
          </button>
        ) : (
          // Edit button in display mode
          <button
            onClick={() => setIsEditing(true)}
            className="edit-button"
            aria-label="Edit task"
          >
            Edit
          </button>
        )}
        {/* Delete button */}
        <button
          onClick={() => deleteTask(task.id)} // confirmation is handled in TaskDashboard for consistency
          className="delete-button"
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
