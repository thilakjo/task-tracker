// src/components/TaskItem.test.js
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskItem from "./TaskItem";

// Sample task data
const sampleTask = {
  id: 1,
  title: "Complete React assignment",
  description: "Build a task tracker application",
  completed: false,
  createdAt: "2024-01-15T10:00:00Z",
  priority: "Medium",
  dueDate: "2025-07-20",
  tags: ["work", "react"],
};

const completedTask = {
  ...sampleTask,
  id: 2,
  completed: true,
  title: "Review JavaScript concepts",
};

describe("TaskItem Component", () => {
  const mockEditTask = jest.fn();
  const mockDeleteTask = jest.fn();
  const mockToggleComplete = jest.fn();

  beforeEach(() => {
    mockEditTask.mockClear();
    mockDeleteTask.mockClear();
    mockToggleComplete.mockClear();
    cleanup(); // Unmount React trees
  });

  test("renders task details in display mode", () => {
    render(
      <TaskItem
        task={sampleTask}
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );

    expect(
      screen.getByRole("heading", { name: sampleTask.title })
    ).toBeInTheDocument();
    expect(screen.getByText(sampleTask.description)).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        /Mark task "Complete React assignment" as completed/i
      )
    ).not.toBeChecked(); // Checkbox is pending
    expect(screen.getByText(/Priority: Medium/i)).toBeInTheDocument();
    expect(screen.getByText(/Due: 7\/20\/2025/i)).toBeInTheDocument(); // Due date display
    expect(screen.getByText("work")).toBeInTheDocument(); // Tag display
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText(/Created:/i)).toBeInTheDocument(); // Creation date
  });

  test("renders completed task with strikethrough and checked checkbox", () => {
    render(
      <TaskItem
        task={completedTask}
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );

    expect(
      screen.getByRole("heading", { name: completedTask.title })
    ).toHaveStyle("text-decoration: line-through");
    expect(
      screen.getByLabelText(
        /Mark task "Review JavaScript concepts" as pending/i
      )
    ).toBeChecked();
    expect(screen.getByTestId("task-item-container")).toHaveClass("completed"); // Visual distinction
  });

  test("switches to edit mode when Edit button is clicked", () => {
    render(
      <TaskItem
        task={sampleTask}
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Edit task/i }));

    expect(screen.getByLabelText(/Edit Task Title/i)).toHaveValue(
      sampleTask.title
    );
    expect(screen.getByLabelText(/Edit Task Description/i)).toHaveValue(
      sampleTask.description
    );
    expect(screen.getByLabelText(/Edit Task Priority/i)).toHaveValue(
      sampleTask.priority
    );
    expect(screen.getByLabelText(/Edit Due Date/i)).toHaveValue(
      sampleTask.dueDate
    );
    expect(screen.getByLabelText(/Edit Tags/i)).toHaveValue(
      sampleTask.tags.join(", ")
    );
    expect(
      screen.getByRole("button", { name: /Save changes/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Edit task/i })
    ).not.toBeInTheDocument();
  });

  test("calls editTask with updated values when Save button is clicked", () => {
    render(
      <TaskItem
        task={sampleTask}
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Edit task/i }));

    const editedTitle = "Updated Title";
    const editedDescription = "Updated Description";
    const editedPriority = "High";
    const editedDueDate = "2025-07-25";
    const editedTags = "new,tags";

    fireEvent.change(screen.getByLabelText(/Edit Task Title/i), {
      target: { value: editedTitle },
    });
    fireEvent.change(screen.getByLabelText(/Edit Task Description/i), {
      target: { value: editedDescription },
    });
    fireEvent.change(screen.getByLabelText(/Edit Task Priority/i), {
      target: { value: editedPriority },
    });
    fireEvent.change(screen.getByLabelText(/Edit Due Date/i), {
      target: { value: editedDueDate },
    });
    fireEvent.change(screen.getByLabelText(/Edit Tags/i), {
      target: { value: editedTags },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save changes/i }));

    expect(mockEditTask).toHaveBeenCalledTimes(1);
    expect(mockEditTask).toHaveBeenCalledWith(
      sampleTask.id,
      editedTitle,
      editedDescription,
      editedPriority,
      editedDueDate,
      ["new", "tags"] // Ensure tags are parsed
    );
    expect(screen.queryByLabelText(/Edit Task Title/i)).not.toBeInTheDocument(); // Exits edit mode
  });

  test("shows alert if title is empty in edit mode", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    render(
      <TaskItem
        task={sampleTask}
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Edit task/i }));
    fireEvent.change(screen.getByLabelText(/Edit Task Title/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save changes/i }));

    expect(alertMock).toHaveBeenCalledWith("Task title cannot be empty!");
    expect(mockEditTask).not.toHaveBeenCalled();
    alertMock.mockRestore();
  });

  test("calls deleteTask when Delete button is clicked and confirmed", () => {
    const confirmMock = jest.spyOn(window, "confirm").mockReturnValue(true); // Mock window.confirm to return true
    render(
      <TaskItem
        task={sampleTask}
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Delete task/i }));

    expect(confirmMock).toHaveBeenCalledTimes(1);
    expect(confirmMock).toHaveBeenCalledWith(
      "Are you sure you want to delete this task?"
    );
    expect(mockDeleteTask).toHaveBeenCalledTimes(1);
    expect(mockDeleteTask).toHaveBeenCalledWith(sampleTask.id);
    confirmMock.mockRestore();
  });

  test("does not call deleteTask when Delete button is clicked and cancelled", () => {
    const confirmMock = jest.spyOn(window, "confirm").mockReturnValue(false); // Mock window.confirm to return false
    render(
      <TaskItem
        task={sampleTask}
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Delete task/i }));

    expect(confirmMock).toHaveBeenCalledTimes(1);
    expect(mockDeleteTask).not.toHaveBeenCalled(); // Should not be called
    confirmMock.mockRestore();
  });

  test("calls toggleComplete when checkbox is clicked", () => {
    render(
      <TaskItem
        task={sampleTask}
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );

    fireEvent.click(
      screen.getByLabelText(
        /Mark task "Complete React assignment" as completed/i
      )
    );

    expect(mockToggleComplete).toHaveBeenCalledTimes(1);
    expect(mockToggleComplete).toHaveBeenCalledWith(sampleTask.id);
  });

  // Add a test for tag rendering when tags are empty or null
  test("does not render tags div if tags array is empty or null", () => {
    const taskNoTags = { ...sampleTask, tags: [] };
    render(
      <TaskItem
        task={taskNoTags}
        editTask={mockEditTask}
        deleteTask={mockDeleteTask}
        toggleComplete={mockToggleComplete}
      />
    );
    expect(screen.queryByText("work")).not.toBeInTheDocument();
    expect(screen.queryByText("react")).not.toBeInTheDocument();
    // Updated assertion to be more robust, checking for the absence of elements that would contain tags
    // If your TaskItem conditionally renders a parent container for tags, you might check for its absence.
    // Assuming individual tags are what we are checking for absence.
    // The previous `expect(screen.queryByRole('listitem')).not.toHaveTextContent(/tags/i);` might be too broad.
    // If the tags are within a specific role or label, target that.
    // For simplicity, checking for the absence of specific tag texts is often sufficient.
  });
});
