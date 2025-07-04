// src/components/TaskDashboard.js
import React, { useState, useEffect, useRef } from "react";
import TaskForm from "./TaskForm"; // For adding new tasks
import TaskList from "./TaskList"; // For displaying tasks
import TaskFilter from "./TaskFilter"; // For filtering tasks
import ConfirmationModal from "./ConfirmationModal"; // Import the new modal
import { getTasks, saveTasks } from "../utils/localStorage"; // For data persistence
import "./../styles/TaskDashboard.css"; // Component-specific styling

const TaskDashboard = ({ currentUser, onLogout, darkMode, toggleDarkMode }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const isFirstLoad = useRef(true);

  // State for the confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);

  // State for date picker
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);

  // Effect to load tasks when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setTasks(getTasks(currentUser));
    }
    isFirstLoad.current = true;
  }, [currentUser]);

  // Effect to save tasks when they or currentUser change
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (currentUser) {
      saveTasks(currentUser, tasks);
    }
  }, [tasks, currentUser]);

  // Add Task function
  const addTask = (title, description, priority, dueDate, tags) => {
    const newTask = {
      id: Date.now(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
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

  // Function to open delete confirmation modal
  const handleDeleteClick = (id) => {
    setTaskIdToDelete(id);
    setIsModalOpen(true);
  };

  // Function to confirm deletion
  const confirmDelete = () => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskIdToDelete)
    );
    setIsModalOpen(false); // Close modal
    setTaskIdToDelete(null); // Clear ID
  };

  // Function to cancel deletion
  const cancelDelete = () => {
    setIsModalOpen(false); // Close modal
    setTaskIdToDelete(null); // Clear ID
  };

  // Toggle Complete function
  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getFilteredAndSearchedTasks = () => {
    let currentTasks = tasks;

    switch (filter) {
      case "Completed":
        currentTasks = currentTasks.filter((task) => task.completed);
        break;
      case "Pending":
        currentTasks = currentTasks.filter((task) => !task.completed);
        break;
      default:
        break;
    }

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
        {/* Added a space after currentUser */}
        <h1>Welcome, {currentUser}! </h1>
        <div className="header-actions">
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={onLogout} className="logout-button danger-button">
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
      <TaskForm
        addTask={addTask}
        onDatePickerActiveChange={setIsDatePickerActive}
      />
      <div className={isDatePickerActive ? "z-index-minus" : ""}>
        <TaskFilter
          currentFilter={filter}
          setFilter={setFilter}
          allCount={tasks.length}
          completedCount={tasks.filter((task) => task.completed).length}
          pendingCount={tasks.filter((task) => !task.completed).length}
        />
      </div>
      <div className={isDatePickerActive ? "z-index-minus" : ""}>
        <TaskList
          tasks={filteredAndSearchedTasks}
          editTask={editTask}
          deleteTask={handleDeleteClick}
          toggleComplete={toggleComplete}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default TaskDashboard;
