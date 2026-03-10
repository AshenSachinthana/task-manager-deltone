import { renderHook, act } from "@testing-library/react";
import usePagination from "../../hooks/usePagination";

describe("usePagination hook", () => {
  it("should initialize on page 1", () => {
    const { result } = renderHook(() => usePagination(10));
    expect(result.current.page).toBe(1);
  });

  it("should calculate total pages correctly", () => {
    const { result: r1 } = renderHook(() => usePagination(12));
    expect(r1.current.totalPages).toBe(3); // 12 / 5 = 2.4 -> 3

    const { result: r2 } = renderHook(() => usePagination(5));
    expect(r2.current.totalPages).toBe(1);

    const { result: r3 } = renderHook(() => usePagination(0));
    expect(r3.current.totalPages).toBe(1); // min 1
  });

  it("should paginate items correctly", () => {
    const items = Array.from({ length: 12 }, (_, i) => i + 1);
    const { result } = renderHook(() => usePagination(12));

    // Page 1: items 1-5
    const page1 = result.current.paginateItems(items);
    expect(page1).toEqual([1, 2, 3, 4, 5]);

    // Go to page 2
    act(() => {
      result.current.setPage(2);
    });

    const page2 = result.current.paginateItems(items);
    expect(page2).toEqual([6, 7, 8, 9, 10]);

    // Go to page 3
    act(() => {
      result.current.setPage(3);
    });

    const page3 = result.current.paginateItems(items);
    expect(page3).toEqual([11, 12]);
  });

  it("should show correct startItem and endItem", () => {
    const { result } = renderHook(() => usePagination(12));

    expect(result.current.startItem).toBe(1);
    expect(result.current.endItem).toBe(5);

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.startItem).toBe(6);
    expect(result.current.endItem).toBe(10);

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.startItem).toBe(11);
    expect(result.current.endItem).toBe(12);
  });

  it("should reset to page 1", () => {
    const { result } = renderHook(() => usePagination(20));

    act(() => {
      result.current.setPage(3);
    });

    expect(result.current.page).toBe(3);

    act(() => {
      result.current.resetPage();
    });

    expect(result.current.page).toBe(1);
  });

  it("should reset to page 1 when page exceeds totalPages", () => {
    const { result, rerender } = renderHook(
      ({ total }) => usePagination(total),
      { initialProps: { total: 20 } }
    );

    act(() => {
      result.current.setPage(4);
    });

    expect(result.current.page).toBe(4);

    // Reduce total items so page 4 no longer exists
    rerender({ total: 5 });

    expect(result.current.page).toBe(1);
  });

  it("should return itemsPerPage as 5", () => {
    const { result } = renderHook(() => usePagination(10));
    expect(result.current.itemsPerPage).toBe(5);
  });
});
