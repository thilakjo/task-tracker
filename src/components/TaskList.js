import React from "react";
import TaskItem from "./TaskItem";
import "./../styles/TaskList.css"; // Create this CSS file

const TaskList = ({ tasks, editTask, deleteTask, toggleComplete }) => {
  if (tasks.length === 0) {
    return <p className="no-tasks-message">No tasks found for this filter.</p>;
  }
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          editTask={editTask}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
        />
      ))}
    </div>
  );
};

export default TaskList;
