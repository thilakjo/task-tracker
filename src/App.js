// src/App.js
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import TaskDashboard from "./components/TaskDashboard";
import "./App.css"; // Global App styles

function App() {
  console.log("[App] Rendered");
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const storedMode = localStorage.getItem("darkMode");
    return storedMode ? JSON.parse(storedMode) : false;
  });

  useEffect(() => {
    // Load username from localStorage on initial load
    // This allows automatic re-login if the username is still stored
    const storedUsername = localStorage.getItem("taskTrackerUsername");
    if (storedUsername) {
      setCurrentUser(storedUsername);
    }
    // Apply dark mode class to body
    document.body.classList.toggle("dark-mode", darkMode);
    console.log("[App] useEffect: darkMode:", darkMode);
  }, [darkMode]); // Rerun when dark mode changes to apply class

  const handleLogin = (username) => {
    console.log("[App] handleLogin for username:", username);
    // When a user logs in, store their username in localStorage
    // This allows the app to remember the last logged-in user across sessions
    localStorage.setItem("taskTrackerUsername", username.trim());
    setCurrentUser(username); // Set current user state
  };

  const handleLogout = () => {
    console.log("[App] handleLogout for user:", currentUser);
    // Only remove the username from state; tasks are never deleted on logout.
    setCurrentUser(null); // Reset current user state to null, which displays the Login component
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
