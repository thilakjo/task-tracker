// src/components/TaskDashboard.test.js
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import * as localStorageUtils from "../utils/localStorage";

describe("TaskDashboard Component (Integration)", () => {
  const mockOnLogout = jest.fn();
  const mockToggleDarkMode = jest.fn();
  const currentUser = "testuser";

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    mockOnLogout.mockClear();
    mockToggleDarkMode.mockClear();
    cleanup(); // Unmounts React trees that were mounted with render
  });

  test("renders dashboard header and task form", () => {
    const TaskDashboard = require("./TaskDashboard").default;
    render(
      <TaskDashboard
        currentUser={currentUser}
        onLogout={mockOnLogout}
        darkMode={false}
        toggleDarkMode={mockToggleDarkMode}
      />
    );
    expect(
      screen.getByRole("heading", { name: `Welcome, ${currentUser}!` })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/No tasks found/i)).toBeInTheDocument(); // Initially no tasks
  });

  test("adds a new task and displays it", async () => {
    const TaskDashboard = require("./TaskDashboard").default;
    jest.spyOn(localStorageUtils, "saveTasks").mockImplementation(jest.fn());
    render(
      <TaskDashboard
        currentUser={currentUser}
        onLogout={mockOnLogout}
        darkMode={false}
        toggleDarkMode={mockToggleDarkMode}
      />
    );

    const titleInput = screen.getByPlaceholderText(/Task Title/i);
    const addButton = screen.getByRole("button", { name: /Add Task/i });

    fireEvent.change(titleInput, { target: { value: "New Task" } });
    fireEvent.click(addButton);

    await screen.findByText("New Task");
    expect(screen.queryByText(/No tasks found/i)).not.toBeInTheDocument();
    // Check that at least one call to setItem contains the new task
    expect(localStorageUtils.saveTasks).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: "New Task", completed: false }),
      ])
    );
  });

  test("edits an existing task", async () => {
    const TaskDashboard = require("./TaskDashboard").default;
    jest.spyOn(localStorageUtils, "getTasks").mockReturnValue([
      {
        id: 1,
        title: "Original Task",
        description: "Desc",
        completed: false,
        createdAt: new Date().toISOString(),
        priority: "Medium",
        dueDate: "",
        tags: [],
      },
    ]);
    jest.spyOn(localStorageUtils, "saveTasks").mockImplementation(jest.fn());

    render(
      <TaskDashboard
        currentUser={currentUser}
        onLogout={mockOnLogout}
        darkMode={false}
        toggleDarkMode={mockToggleDarkMode}
      />
    );

    // Wait for tasks to load
    await screen.findByText("Original Task");

    fireEvent.click(screen.getByRole("button", { name: /Edit task/i }));
    const editTitleInput = screen.getByLabelText(/Edit Task Title/i);
    fireEvent.change(editTitleInput, { target: { value: "Edited Task" } });
    fireEvent.click(screen.getByRole("button", { name: /Save changes/i }));

    await screen.findByText("Edited Task");
    expect(screen.queryByText("Original Task")).not.toBeInTheDocument();
    expect(localStorageUtils.saveTasks).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: "Edited Task" }),
      ])
    );
  });

  test("deletes a task", async () => {
    const TaskDashboard = require("./TaskDashboard").default;
    jest.spyOn(localStorageUtils, "getTasks").mockReturnValue([
      {
        id: 1,
        title: "Task to Delete",
        description: "",
        completed: false,
        createdAt: new Date().toISOString(),
        priority: "Medium",
        dueDate: "",
        tags: [],
      },
    ]);
    jest.spyOn(localStorageUtils, "saveTasks").mockImplementation(jest.fn());
    const confirmMock = jest.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <TaskDashboard
        currentUser={currentUser}
        onLogout={mockOnLogout}
        darkMode={false}
        toggleDarkMode={mockToggleDarkMode}
      />
    );

    await screen.findByText("Task to Delete");

    fireEvent.click(screen.getByRole("button", { name: /Delete task/i }));

    await waitFor(() =>
      expect(screen.queryByText("Task to Delete")).not.toBeInTheDocument()
    );
    confirmMock.mockRestore();

    expect(screen.getByText(/No tasks found/i)).toBeInTheDocument();
    expect(localStorageUtils.saveTasks).toHaveBeenCalledWith([]);
  });

  test("toggles task completion status", async () => {
    const TaskDashboard = require("./TaskDashboard").default;
    jest.spyOn(localStorageUtils, "getTasks").mockReturnValue([
      {
        id: 1,
        title: "Toggle Task",
        description: "",
        completed: false,
        createdAt: new Date().toISOString(),
        priority: "Medium",
        dueDate: "",
        tags: [],
      },
    ]);
    jest.spyOn(localStorageUtils, "saveTasks").mockImplementation(jest.fn());

    render(
      <TaskDashboard
        currentUser={currentUser}
        onLogout={mockOnLogout}
        darkMode={false}
        toggleDarkMode={mockToggleDarkMode}
      />
    );

    // Initial state assertions
    await screen.findByText("Toggle Task");
    const checkbox = screen.getByLabelText(
      /Mark task "Toggle Task" as completed/i
    );
    expect(checkbox).not.toBeChecked();

    // Toggle to completed
    fireEvent.click(checkbox);

    await screen.findByLabelText(/Mark task "Toggle Task" as pending/i);
    expect(
      screen.getByLabelText(/Mark task "Toggle Task" as pending/i)
    ).toBeChecked();

    // Toggle back to pending
    fireEvent.click(
      screen.getByLabelText(/Mark task "Toggle Task" as pending/i)
    );
    expect(
      screen.getByLabelText(/Mark task "Toggle Task" as completed/i)
    ).not.toBeChecked();

    expect(localStorageUtils.saveTasks).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: "Toggle Task", completed: true }),
      ])
    );
    expect(localStorageUtils.saveTasks).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ title: "Toggle Task", completed: false }),
      ])
    );
  });

  test("filters tasks correctly", async () => {
    const TaskDashboard = require("./TaskDashboard").default;
    jest.spyOn(localStorageUtils, "getTasks").mockReturnValue([
      {
        id: 1,
        title: "Task 1 (Completed)",
        description: "",
        completed: true,
        createdAt: "",
        priority: "",
        dueDate: "",
        tags: [],
      },
      {
        id: 2,
        title: "Task 2 (Pending)",
        description: "",
        completed: false,
        createdAt: "",
        priority: "",
        dueDate: "",
        tags: [],
      },
      {
        id: 3,
        title: "Task 3 (Completed)",
        description: "",
        completed: true,
        createdAt: "",
        priority: "",
        dueDate: "",
        tags: [],
      },
    ]);

    render(
      <TaskDashboard
        currentUser={currentUser}
        onLogout={mockOnLogout}
        darkMode={false}
        toggleDarkMode={mockToggleDarkMode}
      />
    );

    await screen.findByText("Task 1 (Completed)");
    await screen.findByText("Task 2 (Pending)");
    await screen.findByText("Task 3 (Completed)");

    // Filter Completed
    fireEvent.click(screen.getByRole("tab", { name: /Completed \(2\)/i }));
    await screen.findByText("Task 1 (Completed)");
    expect(screen.queryByText("Task 2 (Pending)")).not.toBeInTheDocument();
    expect(screen.getByText("Task 3 (Completed)")).toBeInTheDocument();

    // Filter Pending
    fireEvent.click(screen.getByRole("tab", { name: /Pending \(1\)/i }));
    expect(screen.queryByText("Task 1 (Completed)")).not.toBeInTheDocument();
    expect(screen.getByText("Task 2 (Pending)")).toBeInTheDocument();
    expect(screen.queryByText("Task 3 (Completed)")).not.toBeInTheDocument();

    // Filter All
    fireEvent.click(screen.getByRole("tab", { name: /All \(3\)/i }));
    expect(screen.getByText("Task 1 (Completed)")).toBeInTheDocument();
    expect(screen.getByText("Task 2 (Pending)")).toBeInTheDocument();
    expect(screen.getByText("Task 3 (Completed)")).toBeInTheDocument();
  });

  test("searches tasks by title and description", async () => {
    const TaskDashboard = require("./TaskDashboard").default;
    jest.spyOn(localStorageUtils, "getTasks").mockReturnValue([
      {
        id: 1,
        title: "Work Report",
        description: "Finish the monthly report",
        completed: false,
        createdAt: "",
        priority: "",
        dueDate: "",
        tags: ["work", "report"],
      },
      {
        id: 2,
        title: "Buy Groceries",
        description: "Milk, Bread, Eggs",
        completed: false,
        createdAt: "",
        priority: "",
        dueDate: "",
        tags: ["personal"],
      },
      {
        id: 3,
        title: "Study React",
        description: "Review hooks and context",
        completed: true,
        createdAt: "",
        priority: "",
        dueDate: "",
        tags: ["study", "react"],
      },
    ]);

    render(
      <TaskDashboard
        currentUser={currentUser}
        onLogout={mockOnLogout}
        darkMode={false}
        toggleDarkMode={mockToggleDarkMode}
      />
    );

    await screen.findByText("Work Report");
    await screen.findByText("Buy Groceries");
    await screen.findByText("Study React");

    const searchInput = screen.getByPlaceholderText(/Search tasks/i);

    // Search by title
    fireEvent.change(searchInput, { target: { value: "report" } });
    await screen.findByText("Work Report");
    expect(screen.queryByText("Buy Groceries")).not.toBeInTheDocument();
    expect(screen.queryByText("Study React")).not.toBeInTheDocument();

    // Search by description
    fireEvent.change(searchInput, { target: { value: "eggs" } });
    expect(screen.queryByText("Work Report")).not.toBeInTheDocument();
    expect(screen.getByText("Buy Groceries")).toBeInTheDocument();
    expect(screen.queryByText("Study React")).not.toBeInTheDocument();

    // Search by tags
    fireEvent.change(searchInput, { target: { value: "study" } });
    expect(screen.queryByText("Work Report")).not.toBeInTheDocument();
    expect(screen.queryByText("Buy Groceries")).not.toBeInTheDocument();
    expect(screen.getByText("Study React")).toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.getByText("Work Report")).toBeInTheDocument();
    expect(screen.getByText("Buy Groceries")).toBeInTheDocument();
    expect(screen.getByText("Study React")).toBeInTheDocument();
  });

  test("toggles dark mode", async () => {
    const TaskDashboard = require("./TaskDashboard").default;
    render(
      <TaskDashboard
        currentUser={currentUser}
        onLogout={mockOnLogout}
        darkMode={false}
        toggleDarkMode={mockToggleDarkMode}
      />
    );

    const toggleButton = screen.getByRole("button", { name: /Dark Mode/i });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);

    // You'd typically check for a class on the body or a root element in a real DOM test,
    // but here we just confirm the toggle function was called.
    // For a more comprehensive test, you'd test App.js which manages the class.
  });

  test("calls onLogout when logout button is clicked", () => {
    const TaskDashboard = require("./TaskDashboard").default;
    render(
      <TaskDashboard
        currentUser={currentUser}
        onLogout={mockOnLogout}
        darkMode={false}
        toggleDarkMode={mockToggleDarkMode}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });
});
