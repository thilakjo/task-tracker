import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm"; // For adding new tasks
import TaskList from "./TaskList"; // For displaying tasks
import TaskFilter from "./TaskFilter"; // For filtering tasks
import { getTasks, saveTasks } from "../utils/localStorage"; // For data persistence
import "./../styles/TaskDashboard.css"; // Component-specific styling

const TaskDashboard = ({ currentUser, onLogout, darkMode, toggleDarkMode }) => {
  const [tasks, setTasks] = useState([]); // State for all tasks
  const [filter, setFilter] = useState("All"); // State for current filter
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    // Load tasks from localStorage when the component mounts
    setTasks(getTasks());
  }, []); // Empty dependency array ensures it runs only once on mount

  useEffect(() => {
    // Save tasks to localStorage whenever tasks state changes
    saveTasks(tasks);
  }, [tasks]); // Dependency array includes 'tasks'

  // Add Task function
  const addTask = (title, description, priority, dueDate, tags) => {
    // Added priority, dueDate, tags
    const newTask = {
      id: Date.now(), // Unique ID based on timestamp
      title, // Required title
      description, // Optional description
      completed: false, // Default pending status
      createdAt: new Date().toISOString(), // Capture creation date/time
      priority, // Priority level
      dueDate, // Due date
      tags, // Array of tags
    };
    setTasks((prevTasks) => [...prevTasks, newTask]); // Add new task to state
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
    // Prompt confirmation before deletion
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

  // Filter and Search Logic
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
      default: // 'All'
      // No filter applied, use all tasks
    }

    // Apply search
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentTasks = currentTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          task.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          (task.tags &&
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

      {/* Search Functionality */}
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

      {/* Add Task Form */}
      <TaskForm addTask={addTask} />

      {/* Task Filtering */}
      <TaskFilter
        currentFilter={filter}
        setFilter={setFilter}
        allCount={tasks.length} // Total count
        completedCount={tasks.filter((task) => task.completed).length} // Completed count
        pendingCount={tasks.filter((task) => !task.completed).length} // Pending count
      />

      {/* Task List Display */}
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
