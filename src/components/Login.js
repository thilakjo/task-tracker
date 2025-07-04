import React, { useState, useEffect } from "react";
import "./../styles/Login.css"; // Create this CSS file

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem("taskTrackerUsername", username.trim());
      onLoginSuccess(username.trim());
    } else {
      alert("Please enter a username.");
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
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
