import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import TaskDashboard from "./components/TaskDashboard"; // We will create this

import "./styles/App.css"; // Basic app styling

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("taskTrackerUsername");
    if (storedUsername) {
      setCurrentUser(storedUsername);
    }
  }, []);

  const handleLogin = (username) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("taskTrackerUsername");
    setCurrentUser(null);
    localStorage.removeItem("tasks"); // Clear tasks on logout for a clean slate
  };

  return (
    <div className="App">
      {currentUser ? (
        <TaskDashboard currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLogin} />
      )}
    </div>
  );
}

export default App;
