// src/components/TaskFilter.js
import React from "react";
import "./../styles/TaskFilter.css"; // Component-specific styling

const TaskFilter = ({
  currentFilter,
  setFilter,
  allCount,
  completedCount,
  pendingCount,
}) => {
  return (
    <div className="task-filter-container" role="tablist">
      <button
        className={`filter-button ${currentFilter === "All" ? "active" : ""}`}
        onClick={() => setFilter("All")}
        aria-selected={currentFilter === "All"}
        role="tab"
      >
        All ({allCount})
      </button>
      <button
        className={`filter-button ${
          currentFilter === "Completed" ? "active" : ""
        }`}
        onClick={() => setFilter("Completed")}
        aria-selected={currentFilter === "Completed"}
        role="tab"
      >
        Completed ({completedCount})
      </button>
      <button
        className={`filter-button ${
          currentFilter === "Pending" ? "active" : ""
        }`}
        onClick={() => setFilter("Pending")}
        aria-selected={currentFilter === "Pending"}
        role="tab"
      >
        Pending ({pendingCount})
      </button>
    </div>
  );
};

export default TaskFilter;
