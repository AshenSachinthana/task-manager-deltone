import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FilterTabs from "../../components/FilterTabs";

describe("FilterTabs component", () => {
  const mockSetActiveFilter = jest.fn();
  const counts = { all: 10, active: 7, completed: 3 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all three tabs", () => {
    render(
      <FilterTabs activeFilter="all" setActiveFilter={mockSetActiveFilter} counts={counts} />
    );

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("should show counts on each tab", () => {
    render(
      <FilterTabs activeFilter="all" setActiveFilter={mockSetActiveFilter} counts={counts} />
    );

    expect(screen.getByText("(10)")).toBeInTheDocument();
    expect(screen.getByText("(7)")).toBeInTheDocument();
    expect(screen.getByText("(3)")).toBeInTheDocument();
  });

  it("should highlight the active tab", () => {
    const { container } = render(
      <FilterTabs activeFilter="active" setActiveFilter={mockSetActiveFilter} counts={counts} />
    );

    const buttons = container.querySelectorAll(".filter-tab");
    expect(buttons[1]).toHaveClass("active");
    expect(buttons[0]).not.toHaveClass("active");
    expect(buttons[2]).not.toHaveClass("active");
  });

  it("should call setActiveFilter when a tab is clicked", () => {
    render(
      <FilterTabs activeFilter="all" setActiveFilter={mockSetActiveFilter} counts={counts} />
    );

    fireEvent.click(screen.getByText("Completed"));
    expect(mockSetActiveFilter).toHaveBeenCalledWith("completed");

    fireEvent.click(screen.getByText("Active"));
    expect(mockSetActiveFilter).toHaveBeenCalledWith("active");
  });
});
