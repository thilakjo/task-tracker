// src/components/TaskForm.js
import React, { useState } from "react";
import "./../styles/TaskForm.css"; // Component-specific styling

const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState(""); // State for task title
  const [description, setDescription] = useState(""); // State for task description
  const [priority, setPriority] = useState("Medium"); // State for task priority
  const [dueDate, setDueDate] = useState(""); // State for due date
  const [tags, setTags] = useState(""); // State for comma-separated tags
  const [error, setError] = useState(""); // State for displaying form error

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required!"); // Set error message if title is empty
      return;
    }

    setError(""); // Clear any previous error

    // Split tags string into an array, clean, and filter empty strings
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    // Call addTask from props, passing all new fields
    addTask(trimmedTitle, description.trim(), priority, dueDate, tagsArray);

    // Reset form fields after submission
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setTags("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task Title (required)"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError(""); // Clear error when user types
        }}
        required // HTML5 required attribute
        aria-label="Task Title"
        aria-describedby={error ? "task-title-error" : undefined}
      />
      {error && (
        <p id="task-title-error" className="error-message" role="alert">
          {error}
        </p>
      )}
      <textarea
        placeholder="Task Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-label="Task Description"
      ></textarea>
      {/* Priority selection */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        aria-label="Task Priority"
      >
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>
      {/* Due Date input */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        title="Due Date (optional)"
        aria-label="Due Date"
      />
      {/* Tags input */}
      <input
        type="text"
        placeholder="Tags (comma-separated, e.g., work, personal)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        aria-label="Task Tags"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
