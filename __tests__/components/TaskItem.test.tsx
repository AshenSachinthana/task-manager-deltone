import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskItem from "../../components/TaskItem";
import { Task } from "../../hooks/useTasks";

const mockTask: Task = {
  id: "task-1",
  title: "Test Task",
  description: "Test description",
  completed: false,
  createdAt: "2025-01-15T10:00:00.000Z",
  updatedAt: "2025-01-15T10:00:00.000Z",
};

const mockHandlers = {
  onToggle: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe("TaskItem component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render task title and description", () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("should call onToggle when toggle button is clicked", () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    const toggleBtn = screen.getByRole("button", { name: "Mark complete" });
    fireEvent.click(toggleBtn);

    expect(mockHandlers.onToggle).toHaveBeenCalledWith("task-1");
  });

  it("should show 'Mark incomplete' label for completed tasks", () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskItem task={completedTask} {...mockHandlers} />);

    expect(screen.getByRole("button", { name: "Mark incomplete" })).toBeInTheDocument();
  });

  it("should apply completed class when task is completed", () => {
    const completedTask = { ...mockTask, completed: true };
    const { container } = render(<TaskItem task={completedTask} {...mockHandlers} />);

    expect(container.querySelector(".task-card")).toHaveClass("completed");
  });

  it("should show Completed badge for completed tasks", () => {
    const completedTask = { ...mockTask, completed: true };
    render(<TaskItem task={completedTask} {...mockHandlers} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("should not show Completed badge for active tasks", () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
  });

  it("should call onEdit when edit button is clicked", () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    const editBtn = screen.getByRole("button", { name: "Edit task" });
    fireEvent.click(editBtn);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask);
  });

  it("should show delete confirmation when delete button is clicked", () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    const deleteBtn = screen.getByRole("button", { name: "Delete task" });
    fireEvent.click(deleteBtn);

    expect(screen.getByText("Delete this task? This cannot be undone.")).toBeInTheDocument();
  });

  it("should call onDelete when confirm delete is clicked", () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    // Click delete button
    fireEvent.click(screen.getByRole("button", { name: "Delete task" }));

    // Click confirm
    fireEvent.click(screen.getByText("Delete"));

    expect(mockHandlers.onDelete).toHaveBeenCalledWith("task-1");
  });

  it("should hide confirmation when cancel is clicked", () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete task" }));
    expect(screen.getByText("Delete this task? This cannot be undone.")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Delete this task? This cannot be undone.")).not.toBeInTheDocument();
  });

  it("should show Edited badge when updatedAt differs from createdAt", () => {
    const editedTask = {
      ...mockTask,
      updatedAt: "2025-01-16T12:00:00.000Z",
    };
    render(<TaskItem task={editedTask} {...mockHandlers} />);

    expect(screen.getByText(/Edited/)).toBeInTheDocument();
  });

  it("should not show Edited badge when updatedAt equals createdAt", () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />);

    expect(screen.queryByText(/Edited/)).not.toBeInTheDocument();
  });

  it("should not render description when it is empty", () => {
    const noDescTask = { ...mockTask, description: "" };
    const { container } = render(<TaskItem task={noDescTask} {...mockHandlers} />);

    expect(container.querySelector(".task-description")).not.toBeInTheDocument();
  });
});
