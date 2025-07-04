// src/components/TaskForm.test.js
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskForm from "./TaskForm";

describe("TaskForm Component", () => {
  const mockAddTask = jest.fn();

  beforeEach(() => {
    mockAddTask.mockClear(); // Clear mock calls before each test
    cleanup(); // Unmounts React trees
  });

  test("renders task form with title, description, priority, due date, tags inputs and add button", () => {
    render(<TaskForm addTask={mockAddTask} />);
    expect(screen.getByPlaceholderText(/Task Title/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Task Description/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Task Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tags/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Task/i })
    ).toBeInTheDocument();
  });

  test("updates input fields on change", () => {
    render(<TaskForm addTask={mockAddTask} />);
    const titleInput = screen.getByPlaceholderText(/Task Title/i);
    const descriptionInput = screen.getByPlaceholderText(/Task Description/i);
    const prioritySelect = screen.getByLabelText(/Task Priority/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);
    const tagsInput = screen.getByPlaceholderText(/Tags/i);

    fireEvent.change(titleInput, { target: { value: "New Test Task" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Detailed description" },
    });
    fireEvent.change(prioritySelect, { target: { value: "High" } });
    fireEvent.change(dueDateInput, { target: { value: "2025-07-20" } });
    fireEvent.change(tagsInput, { target: { value: "work,urgent" } });

    expect(titleInput).toHaveValue("New Test Task");
    expect(descriptionInput).toHaveValue("Detailed description");
    expect(prioritySelect).toHaveValue("High");
    expect(dueDateInput).toHaveValue("2025-07-20");
    expect(tagsInput).toHaveValue("work,urgent");
  });

  test("calls addTask with correct values and clears inputs on valid submission", () => {
    render(<TaskForm addTask={mockAddTask} />);
    const titleInput = screen.getByPlaceholderText(/Task Title/i);
    const descriptionInput = screen.getByPlaceholderText(/Task Description/i);
    const prioritySelect = screen.getByLabelText(/Task Priority/i);
    const dueDateInput = screen.getByLabelText(/Due Date/i);
    const tagsInput = screen.getByPlaceholderText(/Tags/i);
    const addButton = screen.getByRole("button", { name: /Add Task/i });

    fireEvent.change(titleInput, { target: { value: "Another Task" } });
    fireEvent.change(descriptionInput, { target: { value: "Some details" } });
    fireEvent.change(prioritySelect, { target: { value: "Low" } });
    fireEvent.change(dueDateInput, { target: { value: "2025-08-01" } });
    fireEvent.change(tagsInput, { target: { value: "personal,home" } });
    fireEvent.click(addButton);

    expect(mockAddTask).toHaveBeenCalledTimes(1);
    expect(mockAddTask).toHaveBeenCalledWith(
      "Another Task",
      "Some details",
      "Low",
      "2025-08-01",
      ["personal", "home"]
    );
    // Check if inputs are cleared
    expect(titleInput).toHaveValue("");
    expect(descriptionInput).toHaveValue("");
    expect(prioritySelect).toHaveValue("Medium"); // Resets to default
    expect(dueDateInput).toHaveValue("");
    expect(tagsInput).toHaveValue("");
  });

  test("shows alert if title is empty on submission", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(<TaskForm addTask={mockAddTask} />);
    const addButton = screen.getByRole("button", { name: /Add Task/i });

    fireEvent.click(addButton); // Click without entering title

    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(alertMock).toHaveBeenCalledWith("Task title is required!");
    expect(mockAddTask).not.toHaveBeenCalled(); // addTask should not be called
    alertMock.mockRestore();
  });

  test("handles tags input with extra spaces and empty tags", () => {
    render(<TaskForm addTask={mockAddTask} />);
    const titleInput = screen.getByPlaceholderText(/Task Title/i);
    const tagsInput = screen.getByPlaceholderText(/Tags/i);
    const addButton = screen.getByRole("button", { name: /Add Task/i });

    fireEvent.change(titleInput, { target: { value: "Task with messy tags" } });
    fireEvent.change(tagsInput, { target: { value: " tag1,  tag2 , ,tag3 " } });
    fireEvent.click(addButton);

    expect(mockAddTask).toHaveBeenCalledTimes(1);
    // Expect tags to be trimmed and empty ones filtered out
    expect(mockAddTask).toHaveBeenCalledWith(
      "Task with messy tags",
      "",
      "Medium",
      "",
      ["tag1", "tag2", "tag3"]
    );
  });
});
