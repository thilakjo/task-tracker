import React from "react";
import "./../styles/TaskFilter.css"; // Create this CSS file

const TaskFilter = ({
  currentFilter,
  setFilter,
  allCount,
  completedCount,
  pendingCount,
}) => {
  return (
    <div className="task-filter-container">
      <button
        className={`filter-button ${currentFilter === "All" ? "active" : ""}`}
        onClick={() => setFilter("All")}
      >
        All ({allCount})
      </button>
      <button
        className={`filter-button ${
          currentFilter === "Completed" ? "active" : ""
        }`}
        onClick={() => setFilter("Completed")}
      >
        Completed ({completedCount})
      </button>
      <button
        className={`filter-button ${
          currentFilter === "Pending" ? "active" : ""
        }`}
        onClick={() => setFilter("Pending")}
      >
        Pending ({pendingCount})
      </button>
    </div>
  );
};

export default TaskFilter;
