import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import TaskDashboard from "./components/TaskDashboard";
import "./App.css"; // Global App styles

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const storedMode = localStorage.getItem("darkMode");
    return storedMode ? JSON.parse(storedMode) : false;
  });

  useEffect(() => {
    // Load username from localStorage on initial load
    const storedUsername = localStorage.getItem("taskTrackerUsername");
    if (storedUsername) {
      setCurrentUser(storedUsername);
    }
    // Apply dark mode class to body
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]); // Rerun when dark mode changes to apply class

  const handleLogin = (username) => {
    setCurrentUser(username); // Set current user state
  };

  const handleLogout = () => {
    localStorage.removeItem("taskTrackerUsername"); // Clear username from localStorage
    localStorage.removeItem("tasks"); // Clear tasks on logout for a clean slate
    setCurrentUser(null); // Reset user state
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode); // Toggle dark mode state
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      {currentUser ? (
        // If logged in, show TaskDashboard
        <TaskDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        // If not logged in, show Login form
        <Login onLoginSuccess={handleLogin} />
      )}
    </div>
  );
}

export default App;
