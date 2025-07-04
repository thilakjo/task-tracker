import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import TaskFilter from "./TaskFilter";
import { getTasks, saveTasks } from "../utils/localStorage"; // We will create this utility
import "./../styles/TaskDashboard.css"; // Create this CSS file

const TaskDashboard = ({ currentUser, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All"); // 'All', 'Completed', 'Pending'

  useEffect(() => {
    // Load tasks from localStorage when the component mounts
    setTasks(getTasks());
  }, []);

  useEffect(() => {
    // Save tasks to localStorage whenever tasks state changes
    saveTasks(tasks);
  }, [tasks]);

  // Add Task
  const addTask = (title, description) => {
    const newTask = {
      id: Date.now(), // Unique ID
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  // Edit Task
  const editTask = (id, updatedTitle, updatedDescription) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, title: updatedTitle, description: updatedDescription }
          : task
      )
    );
  };

  // Delete Task
  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // Toggle Complete
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Filtered Tasks
  const getFilteredTasks = () => {
    switch (filter) {
      case "Completed":
        return tasks.filter((task) => task.completed);
      case "Pending":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="task-dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {currentUser}!</h1>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </header>

      <TaskForm addTask={addTask} />

      <TaskFilter
        currentFilter={filter}
        setFilter={setFilter}
        allCount={tasks.length}
        completedCount={tasks.filter((task) => task.completed).length}
        pendingCount={tasks.filter((task) => !task.completed).length}
      />

      <TaskList
        tasks={filteredTasks}
        editTask={editTask}
        deleteTask={deleteTask}
        toggleComplete={toggleComplete}
      />
    </div>
  );
};

export default TaskDashboard;
