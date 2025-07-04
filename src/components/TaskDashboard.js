// src/components/TaskDashboard.js
import React, { useState, useEffect, useRef } from "react";
import TaskForm from "./TaskForm"; // For adding new tasks
import TaskList from "./TaskList"; // For displaying tasks
import TaskFilter from "./TaskFilter"; // For filtering tasks
import { getTasks, saveTasks } from "../utils/localStorage"; // For data persistence
import "./../styles/TaskDashboard.css"; // Component-specific styling

const TaskDashboard = ({ currentUser, onLogout, darkMode, toggleDarkMode }) => {
  const [tasks, setTasks] = useState([]); // State for all tasks
  const [filter, setFilter] = useState("All"); // State for current filter
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const isFirstLoad = useRef(true); // Ref to track if it's the first load

  // Effect to load tasks when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setTasks(getTasks(currentUser));
    }
    isFirstLoad.current = true; // Reset for new user session or initial load
  }, [currentUser]); // Reload tasks when user changes

  // Effect to save tasks when they or currentUser change
  useEffect(() => {
    // Only save if not the first load after user change or initial mount
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (currentUser) {
      saveTasks(currentUser, tasks);
    }
  }, [tasks, currentUser]); // Save tasks when they or user changes

  // Add Task function
  const addTask = (title, description, priority, dueDate, tags) => {
    const newTask = {
      id: Date.now(), // Unique ID for the task
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(), // ISO string for consistent date handling
      priority,
      dueDate,
      tags,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Edit Task function
  const editTask = (
    id,
    updatedTitle,
    updatedDescription,
    updatedPriority,
    updatedDueDate,
    updatedTags
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: updatedTitle,
              description: updatedDescription,
              priority: updatedPriority,
              dueDate: updatedDueDate,
              tags: updatedTags,
            }
          : task
      )
    );
  };

  // Delete Task function
  const deleteTask = (id) => {
    // Use window.confirm for a quick confirmation. Could be replaced with a custom modal for better UX.
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }
  };

  // Toggle Complete function
  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Filter and Search Logic - Memoized for performance if needed, but fine as-is for small lists
  const getFilteredAndSearchedTasks = () => {
    let currentTasks = tasks;

    // Apply filter
    switch (filter) {
      case "Completed":
        currentTasks = currentTasks.filter((task) => task.completed);
        break;
      case "Pending":
        currentTasks = currentTasks.filter((task) => !task.completed);
        break;
      default:
        // "All" tasks - no filtering needed
        break;
    }

    // Apply search term if present
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentTasks = currentTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          task.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          (task.tags && // Check if tags exist before attempting to search
            task.tags.some((tag) =>
              tag.toLowerCase().includes(lowerCaseSearchTerm)
            ))
      );
    }
    return currentTasks;
  };

  const filteredAndSearchedTasks = getFilteredAndSearchedTasks();

  return (
    <div className="task-dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {currentUser}!</h1>
        <div className="header-actions">
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search tasks by title, description or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search tasks"
        />
      </div>
      <TaskForm addTask={addTask} />
      <TaskFilter
        currentFilter={filter}
        setFilter={setFilter}
        allCount={tasks.length}
        completedCount={tasks.filter((task) => task.completed).length}
        pendingCount={tasks.filter((task) => !task.completed).length}
      />
      <TaskList
        tasks={filteredAndSearchedTasks}
        editTask={editTask}
        deleteTask={deleteTask}
        toggleComplete={toggleComplete}
      />
    </div>
  );
};

export default TaskDashboard;
