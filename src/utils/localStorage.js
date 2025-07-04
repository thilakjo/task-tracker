// src/utils/localStorage.js
const TASK_STORAGE_KEY = "tasks"; // Key for storing tasks

export const getTasks = () => {
  try {
    const tasksJson = localStorage.getItem(TASK_STORAGE_KEY);
    // Parse JSON or return empty array if null/error
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error("Error retrieving tasks from localStorage:", error);
    return []; // Return empty array on error to prevent app crash
  }
};

export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks)); // Store tasks as JSON string
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};
