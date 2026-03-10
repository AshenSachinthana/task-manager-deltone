import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Pagination from "../../components/Pagination";

describe("Pagination component", () => {
  const mockSetPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when totalItems is 0", () => {
    const { container } = render(
      <Pagination page={1} setPage={mockSetPage} totalPages={1} startItem={1} endItem={0} totalItems={0} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("should show 'Showing X-Y of Z tasks' info", () => {
    render(
      <Pagination page={1} setPage={mockSetPage} totalPages={3} startItem={1} endItem={5} totalItems={12} />
    );

    expect(screen.getByText(/Showing 1/)).toBeInTheDocument();
    expect(screen.getByText(/of 12 tasks/)).toBeInTheDocument();
  });

  it("should not show page controls when only 1 page", () => {
    const { container } = render(
      <Pagination page={1} setPage={mockSetPage} totalPages={1} startItem={1} endItem={3} totalItems={3} />
    );

    expect(container.querySelector(".pagination-controls")).not.toBeInTheDocument();
  });

  it("should render page buttons when multiple pages", () => {
    render(
      <Pagination page={1} setPage={mockSetPage} totalPages={3} startItem={1} endItem={5} totalItems={12} />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should highlight the current page", () => {
    render(
      <Pagination page={2} setPage={mockSetPage} totalPages={3} startItem={6} endItem={10} totalItems={12} />
    );

    const page2Btn = screen.getByText("2");
    expect(page2Btn).toHaveClass("active");
  });

  it("should disable Prev button on first page", () => {
    render(
      <Pagination page={1} setPage={mockSetPage} totalPages={3} startItem={1} endItem={5} totalItems={12} />
    );

    const prevBtn = screen.getByText(/Prev/);
    expect(prevBtn).toBeDisabled();
  });

  it("should disable Next button on last page", () => {
    render(
      <Pagination page={3} setPage={mockSetPage} totalPages={3} startItem={11} endItem={12} totalItems={12} />
    );

    const nextBtn = screen.getByText(/Next/);
    expect(nextBtn).toBeDisabled();
  });

  it("should call setPage when page button is clicked", () => {
    render(
      <Pagination page={1} setPage={mockSetPage} totalPages={3} startItem={1} endItem={5} totalItems={12} />
    );

    fireEvent.click(screen.getByText("2"));
    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("should call setPage with next page when Next is clicked", () => {
    render(
      <Pagination page={1} setPage={mockSetPage} totalPages={3} startItem={1} endItem={5} totalItems={12} />
    );

    fireEvent.click(screen.getByText(/Next/));
    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("should call setPage with prev page when Prev is clicked", () => {
    render(
      <Pagination page={2} setPage={mockSetPage} totalPages={3} startItem={6} endItem={10} totalItems={12} />
    );

    fireEvent.click(screen.getByText(/Prev/));
    expect(mockSetPage).toHaveBeenCalledWith(1);
  });
});
