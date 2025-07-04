// src/components/TaskForm.js
import React, { useState } from "react";
import DatePicker from "react-datepicker"; // Import DatePicker

// 1. Default DatePicker styles should come first
import "react-datepicker/dist/react-datepicker.css";

// 2. Then your component-specific styles and other related component styles
import "./../styles/TaskForm.css";
import "./../styles/TaskFilter.css";

// Removed the problematic import for App.css here, as it's typically imported globally in App.js or index.js
// If you truly need App.css specific styles here, the path should be '../../App.css'

// 3. YOUR CUSTOM DatePicker styling should be imported LAST to ensure overrides take precedence.
// The path for DatePickerCustom.css is correct:
import "./../styles/DatePickerCustom.css";

const TaskForm = ({ addTask, onDatePickerActiveChange }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(null);
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required!");
      return;
    }

    setError("");

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    addTask(
      trimmedTitle,
      description.trim(),
      priority,
      dueDate ? dueDate.toISOString() : null,
      tagsArray
    );

    // Reset form fields
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate(null);
    setTags("");
  };

  // Helper functions for Today/Tomorrow
  const setToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    setDueDate(today);
  };

  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Normalize to start of day
    setDueDate(tomorrow);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task Title (required)"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError("");
        }}
        required
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
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        aria-label="Task Priority"
      >
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>

      {/* New date selection options */}
      <div className="date-input-group">
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          placeholderText="Select Due Date (optional)"
          dateFormat="yyyy/MM/dd"
          isClearable
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={15}
          className="date-picker-input"
          aria-label="Due Date"
          onCalendarOpen={() =>
            onDatePickerActiveChange && onDatePickerActiveChange(true)
          }
          onCalendarClose={() =>
            onDatePickerActiveChange && onDatePickerActiveChange(false)
          }
        />
        <div className="quick-date-buttons">
          <button
            type="button"
            onClick={setToday}
            className="info-button small-button"
          >
            Today
          </button>
          <button
            type="button"
            onClick={setTomorrow}
            className="info-button small-button"
          >
            Tomorrow
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Tags (comma-separated, e.g., work, personal)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        aria-label="Task Tags"
      />
      <button type="submit" className="primary-button">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
