// src/components/TaskFilter.test.js
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskFilter from "./TaskFilter";

describe("TaskFilter Component", () => {
  const mockSetFilter = jest.fn();
  const allCount = 5;
  const completedCount = 2;
  const pendingCount = 3;

  beforeEach(() => {
    mockSetFilter.mockClear();
    cleanup(); // Unmount React trees
  });

  test("renders all filter buttons with correct counts", () => {
    render(
      <TaskFilter
        currentFilter="All"
        setFilter={mockSetFilter}
        allCount={allCount}
        completedCount={completedCount}
        pendingCount={pendingCount}
      />
    );

    expect(
      screen.getByRole("tab", { name: `All (${allCount})` })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: `Completed (${completedCount})` })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: `Pending (${pendingCount})` })
    ).toBeInTheDocument();
  });

  test("highlights the active filter button", () => {
    render(
      <TaskFilter
        currentFilter="All"
        setFilter={mockSetFilter}
        allCount={allCount}
        completedCount={completedCount}
        pendingCount={pendingCount}
      />
    );

    expect(screen.getByRole("tab", { name: `All (${allCount})` })).toHaveClass(
      "active"
    );
    expect(
      screen.getByRole("tab", { name: `Completed (${completedCount})` })
    ).not.toHaveClass("active");
    expect(
      screen.getByRole("tab", { name: `Pending (${pendingCount})` })
    ).not.toHaveClass("active");

    cleanup(); // Unmount previous render
    render(
      <TaskFilter
        currentFilter="Completed"
        setFilter={mockSetFilter}
        allCount={allCount}
        completedCount={completedCount}
        pendingCount={pendingCount}
      />
    );

    expect(
      screen.getByRole("tab", { name: `Completed (${completedCount})` })
    ).toHaveClass("active");
  });

  test("calls setFilter with correct filter when a button is clicked", () => {
    render(
      <TaskFilter
        currentFilter="All"
        setFilter={mockSetFilter}
        allCount={allCount}
        completedCount={completedCount}
        pendingCount={pendingCount}
      />
    );

    fireEvent.click(
      screen.getByRole("tab", { name: `Completed (${completedCount})` })
    );
    expect(mockSetFilter).toHaveBeenCalledTimes(1);
    expect(mockSetFilter).toHaveBeenCalledWith("Completed");

    fireEvent.click(
      screen.getByRole("tab", { name: `Pending (${pendingCount})` })
    );
    expect(mockSetFilter).toHaveBeenCalledTimes(2);
    expect(mockSetFilter).toHaveBeenCalledWith("Pending");
  });
});
