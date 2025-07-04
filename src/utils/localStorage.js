// src/utils/localStorage.js
console.log("[localStorage.js] Loaded localStorage utility");
const ALL_USERS_KEY = "taskTrackerUsers";

// Migrate old per-user or global tasks keys to the new structure
function migrateOldTasks() {
  let migrated = false;
  let usersObj = {};
  // Migrate per-user keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("tasks_")) {
      const username = key.slice(6);
      try {
        const tasks = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(tasks)) {
          usersObj[username] = tasks;
          migrated = true;
        }
      } catch {}
    }
  }
  // Migrate old global 'tasks' key if present
  if (localStorage.getItem("tasks")) {
    try {
      const tasks = JSON.parse(localStorage.getItem("tasks"));
      if (Array.isArray(tasks)) {
        const username =
          localStorage.getItem("taskTrackerUsername") || "default";
        usersObj[username] = tasks;
        migrated = true;
      }
    } catch {}
  }
  if (migrated) {
    console.log("[MIGRATION] Migrating old tasks to new structure:", usersObj);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(usersObj));
    for (const username in usersObj) {
      localStorage.removeItem(`tasks_${username}`);
    }
    localStorage.removeItem("tasks");
    console.log("[MIGRATION] After migration, localStorage:", {
      ...localStorage,
    });
  }
}

export const getTasks = (username) => {
  try {
    migrateOldTasks();
    const usersJson = localStorage.getItem(ALL_USERS_KEY);
    if (!usersJson) {
      console.log(
        `[getTasks] No users found in localStorage for key ${ALL_USERS_KEY}`
      );
      return [];
    }
    const usersObj = JSON.parse(usersJson);
    console.log(
      `[getTasks] Loaded tasks for user '${username}':`,
      usersObj[username] || []
    );
    return usersObj[username] || [];
  } catch (error) {
    console.error("Error retrieving tasks from localStorage:", error);
    return [];
  }
};

export const saveTasks = (username, tasks) => {
  try {
    migrateOldTasks();
    let usersObj = {};
    const usersJson = localStorage.getItem(ALL_USERS_KEY);
    if (usersJson) {
      usersObj = JSON.parse(usersJson);
    }
    usersObj[username] = tasks;
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(usersObj));
    console.log(`[saveTasks] Saved tasks for user '${username}':`, tasks);
    console.log(`[saveTasks] localStorage after save:`, { ...localStorage });
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

export const getAllUsers = () => {
  try {
    migrateOldTasks();
    const usersJson = localStorage.getItem(ALL_USERS_KEY);
    if (!usersJson) return [];
    return Object.keys(JSON.parse(usersJson));
  } catch {
    return [];
  }
};
