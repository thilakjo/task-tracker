// src/components/TaskList.test.js
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskList from "./TaskList";
import TaskItem from "./TaskItem"; // Import TaskItem to mock it

// Mock TaskItem component to avoid testing its internal logic here, focus on TaskList rendering
jest.mock("./TaskItem", () => {
  // eslint-disable-next-line react/prop-types
  return ({ task, editTask, deleteTask, toggleComplete }) => (
    <div data-testid="mock-task-item" key={task.id}>
      <span>{task.title}</span>
      <button onClick={() => editTask(task.id)}>Mock Edit</button>
      <button onClick={() => deleteTask(task.id)}>Mock Delete</button>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
      />
    </div>
  );
});

describe("TaskList Component", () => {
  const mockEditTask = jest.fn();
  const mockDeleteTask = jest.fn();
  const mockToggleComplete = jest.fn();

  const sampleTasks = [
    {
      id: 1,
      title: "Task 1",
      description: "",
      completed: false,
      createdAt: "2024-01-01T00:00:00Z",
      priority: "Medium",
      dueDate: "",
      tags: [],
    },
    {
      id: 2,
      title: "Task 2",
      description: "",
      completed: true,
      createdAt: "2024-01-02T00:00:00Z",
      priority: "Low",
      dueDate: "",
      tags: [],
    },
    {
      id: 3,
      title: "Task 3",
      description: "",
      completed: false,
      createdAt: "2024-01-03T00:00:00Z",
      priority: "High",
      dueDate: "",
      tags: [],
    },
  ];

  beforeEach(() => {
    cleanup(); // Unmount React trees
  });

  test('renders "No tasks found" message when tasks array is empty', () => {
    render(
      <TaskList
        tasks={[]}
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );
    expect(
      screen.getByText(/No tasks found for this filter or search term./i)
    ).toBeInTheDocument();
    expect(screen.queryByTestId("mock-task-item")).not.toBeInTheDocument();
  });

  test("renders a list of TaskItem components when tasks array is not empty", () => {
    render(
      <TaskList
        tasks={sampleTasks}
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );
    expect(screen.queryByText(/No tasks found/i)).not.toBeInTheDocument();
    const taskItems = screen.getAllByTestId("mock-task-item");
    expect(taskItems).toHaveLength(sampleTasks.length); // Renders correct number of items
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  test("passes correct props to TaskItem components", () => {
    render(
      <TaskList
        tasks={[sampleTasks[0]]} // Just render one task for simplicity
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );

    const taskItem = screen.getByTestId("mock-task-item");

    // Verify task title is passed (due to mock, we can just check content)
    expect(taskItem).toHaveTextContent("Task 1");

    // Verify that the mock functions are associated with the TaskItem
    fireEvent.click(screen.getByRole("button", { name: /Mock Edit/i }));
    expect(mockEditTask).toHaveBeenCalledWith(sampleTasks[0].id);

    fireEvent.click(screen.getByRole("button", { name: /Mock Delete/i }));
    expect(mockDeleteTask).toHaveBeenCalledWith(sampleTasks[0].id);

    fireEvent.click(screen.getByRole("checkbox"));
    expect(mockToggleComplete).toHaveBeenCalledWith(sampleTasks[0].id);
  });
});
