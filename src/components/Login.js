import React, { useState } from "react";
import "./../styles/Login.css"; // Component-specific styling

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState(""); // State for username input

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem("taskTrackerUsername", username.trim()); // Store username in localStorage
      onLoginSuccess(username.trim()); // Call success callback to redirect
    } else {
      alert("Please enter a username."); // Basic validation
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Task Tracker</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required // Username is required
          aria-label="Username"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
