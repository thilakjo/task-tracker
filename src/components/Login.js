// src/components/Login.js
import React, { useState } from "react";
import "./../styles/Login.css"; // Component-specific styling

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState(""); // State for username input
  const [error, setError] = useState(""); // State for displaying login error

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim(); // Trim whitespace from username

    if (!trimmedUsername) {
      setError("Username is required"); // Set error message if empty or whitespace
      return;
    }

    setError(""); // Clear any previous error
    localStorage.setItem("taskTrackerUsername", trimmedUsername); // Store username in localStorage
    onLoginSuccess(trimmedUsername); // Call success callback to redirect
  };

  return (
    <div className="login-container">
      <h2>Login to Task Tracker</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) setError(""); // Clear error message when user starts typing
          }}
          required // Username is required
          aria-label="Username"
          aria-describedby={error ? "username-error" : undefined} // Link to error message for accessibility
        />
        {error && (
          <p id="username-error" className="error-message" role="alert">
            {error}
          </p> // Display error message
        )}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
