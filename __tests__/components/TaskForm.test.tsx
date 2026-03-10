import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskForm from "../../components/TaskForm";

describe("TaskForm component", () => {
  const mockOnAdd = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form with title and description fields", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    expect(screen.getByText("Add New Task")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What needs to be done?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add some details... (optional)")).toBeInTheDocument();
  });

  it("should have disabled submit button when title is empty", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    const submitBtn = screen.getByRole("button", { name: "Add Task" });
    expect(submitBtn).toBeDisabled();
  });

  it("should enable submit button when title is filled", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(titleInput, { target: { value: "New task" } });

    const submitBtn = screen.getByRole("button", { name: "Add Task" });
    expect(submitBtn).not.toBeDisabled();
  });

  it("should show error when submitting with empty title", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    const form = screen.getByRole("button", { name: "Add Task" }).closest("form")!;
    fireEvent.submit(form);

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it("should show error when title is only whitespace", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(titleInput, { target: { value: "   " } });

    const form = screen.getByRole("button", { name: "Add Task" }).closest("form")!;
    fireEvent.submit(form);

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it("should call onAdd and onClose on successful submit", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const descInput = screen.getByPlaceholderText("Add some details... (optional)");

    fireEvent.change(titleInput, { target: { value: "My Task" } });
    fireEvent.change(descInput, { target: { value: "Some details" } });

    const form = screen.getByRole("button", { name: "Add Task" }).closest("form")!;
    fireEvent.submit(form);

    expect(mockOnAdd).toHaveBeenCalledWith("My Task", "Some details");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should show character counter for title", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    expect(screen.getByText("0/100")).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(titleInput, { target: { value: "Hello" } });

    expect(screen.getByText("5/100")).toBeInTheDocument();
  });

  it("should show character counter for description", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    expect(screen.getByText("0/500")).toBeInTheDocument();
  });

  it("should disable submit when title exceeds 100 chars", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const longTitle = "a".repeat(101);
    fireEvent.change(titleInput, { target: { value: longTitle } });

    const submitBtn = screen.getByRole("button", { name: "Add Task" });
    expect(submitBtn).toBeDisabled();
  });

  it("should disable submit when description exceeds 500 chars", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(titleInput, { target: { value: "Valid Title" } });

    const descInput = screen.getByPlaceholderText("Add some details... (optional)");
    const longDesc = "a".repeat(501);
    fireEvent.change(descInput, { target: { value: longDesc } });

    const submitBtn = screen.getByRole("button", { name: "Add Task" });
    expect(submitBtn).toBeDisabled();
  });

  it("should call onClose when Cancel button is clicked", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should call onClose when close (x) button is clicked", () => {
    render(<TaskForm onAdd={mockOnAdd} onClose={mockOnClose} />);

    const closeBtn = screen.getByText("\u00d7");
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
