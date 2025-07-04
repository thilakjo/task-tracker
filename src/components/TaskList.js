import React from "react";
import TaskItem from "./TaskItem"; // Displays individual tasks
import "./../styles/TaskList.css"; // Component-specific styling

const TaskList = ({ tasks, editTask, deleteTask, toggleComplete }) => {
  // Message if no tasks found for the current filter
  if (tasks.length === 0) {
    return (
      <p className="no-tasks-message">
        No tasks found for this filter or search term.
      </p>
    );
  }
  return (
    <div className="task-list" role="list">
      {" "}
      {/* ARIA role for accessibility */}
      {tasks.map((task) => (
        <TaskItem
          key={task.id} // Unique key for list rendering
          task={task} // Pass task object as prop
          editTask={editTask}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
        />
      ))}
    </div>
  );
};

export default TaskList;
