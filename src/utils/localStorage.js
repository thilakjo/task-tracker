const TASK_STORAGE_KEY = "tasks";

export const getTasks = () => {
  try {
    const tasksJson = localStorage.getItem(TASK_STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  } catch (error) {
    console.error("Error retrieving tasks from localStorage:", error);
    return [];
  }
};

export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};
