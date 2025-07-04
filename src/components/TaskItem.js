// src/components/TaskItem.js
import React, { useState } from "react";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Default DatePicker styles
import "./../styles/TaskItem.css"; // Component-specific styling

const TaskItem = ({ task, editTask, deleteTask, toggleComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState(
    task.priority || "Medium"
  );
  const [editedDueDate, setEditedDueDate] = useState(
    task.dueDate ? new Date(task.dueDate) : null
  );
  const [editedTags, setEditedTags] = useState(
    task.tags ? task.tags.join(", ") : ""
  );
  const [editError, setEditError] = useState("");

  const handleEditSave = () => {
    const trimmedEditedTitle = editedTitle.trim();
    if (!trimmedEditedTitle) {
      setEditError("Task title cannot be empty!");
      return;
    }

    setEditError("");

    const tagsArray = editedTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    editTask(
      task.id,
      trimmedEditedTitle,
      editedDescription.trim(),
      editedPriority,
      editedDueDate ? editedDueDate.toISOString() : null,
      tagsArray
    );
    setIsEditing(false);
  };

  const formatCreationDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const formatDisplayDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  // Helper functions for Today/Tomorrow (for edit mode)
  const setTodayEdit = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setEditedDueDate(today);
  };

  const setTomorrowEdit = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setEditedDueDate(tomorrow);
  };

  return (
    <div
      className={`task-item ${task.completed ? "completed" : ""} priority-${(
        task.priority || "medium"
      ).toLowerCase()}`}
      data-testid="task-item-container"
    >
      <div className="task-content">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => {
                setEditedTitle(e.target.value);
                if (editError) setEditError("");
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
            {/* DatePicker for edit mode */}
            <div className="date-input-group">
              {" "}
              {/* Wrap for styling */}
              <DatePicker
                selected={editedDueDate}
                onChange={(date) => setEditedDueDate(date)}
                placeholderText="Select Due Date (optional)"
                dateFormat="yyyy/MM/dd"
                isClearable
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={15}
                className="edit-input date-picker-input" // Add classes for styling
                aria-label="Edit Due Date"
              />
              <div className="quick-date-buttons">
                <button
                  type="button"
                  onClick={setTodayEdit}
                  className="info-button small-button"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={setTomorrowEdit}
                  className="info-button small-button"
                >
                  Tomorrow
                </button>
              </div>
            </div>
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
            {task.tags && task.tags.length > 0 && (
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
          <button
            onClick={handleEditSave}
            className="save-button primary-button"
            aria-label="Save changes"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="edit-button info-button"
            aria-label="Edit task"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => deleteTask(task.id)}
          className="delete-button danger-button"
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
