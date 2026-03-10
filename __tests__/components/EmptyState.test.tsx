import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmptyState from "../../components/EmptyState";

describe("EmptyState component", () => {
  it("should show default empty message when type is 'empty'", () => {
    render(<EmptyState type="empty" />);

    expect(screen.getByText("No tasks yet")).toBeInTheDocument();
    expect(screen.getByText("Click '+ Add Task' to get started!")).toBeInTheDocument();
  });

  it("should show search empty message when type is 'search'", () => {
    render(<EmptyState type="search" />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
    expect(screen.getByText("No tasks match your search.")).toBeInTheDocument();
  });

  it("should show active empty message when type is 'active'", () => {
    render(<EmptyState type="active" />);

    expect(screen.getByText("All caught up!")).toBeInTheDocument();
    expect(screen.getByText("No active tasks.")).toBeInTheDocument();
  });

  it("should show completed empty message when type is 'completed'", () => {
    render(<EmptyState type="completed" />);

    expect(screen.getByText("Nothing completed yet")).toBeInTheDocument();
    expect(screen.getByText("No completed tasks.")).toBeInTheDocument();
  });
});
