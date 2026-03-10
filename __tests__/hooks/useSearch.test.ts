import { renderHook, act } from "@testing-library/react";
import useSearch from "../../hooks/useSearch";
import { Task } from "../../hooks/useTasks";

jest.useFakeTimers();

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "1",
    title: "Default Title",
    description: "Default Description",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("useSearch hook", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should initialize with empty query", () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.query).toBe("");
    expect(result.current.debouncedQuery).toBe("");
  });

  it("should update query immediately", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("test");
    });

    expect(result.current.query).toBe("test");
  });

  it("should debounce the query after 250ms", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("hello");
    });

    // Before debounce
    expect(result.current.debouncedQuery).toBe("");

    // After debounce
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(result.current.debouncedQuery).toBe("hello");
  });

  it("should filter tasks by title", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("shopping");
    });
    act(() => {
      jest.advanceTimersByTime(250);
    });

    const tasks = [
      createTask({ id: "1", title: "Go shopping", description: "" }),
      createTask({ id: "2", title: "Read book", description: "" }),
    ];

    const filtered = result.current.filterBySearch(tasks);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Go shopping");
  });

  it("should filter tasks by description", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("groceries");
    });
    act(() => {
      jest.advanceTimersByTime(250);
    });

    const tasks = [
      createTask({ id: "1", title: "Shopping", description: "Buy groceries" }),
      createTask({ id: "2", title: "Coding", description: "Fix bugs" }),
    ];

    const filtered = result.current.filterBySearch(tasks);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Shopping");
  });

  it("should be case insensitive", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("TASK");
    });
    act(() => {
      jest.advanceTimersByTime(250);
    });

    const tasks = [
      createTask({ id: "1", title: "My task" }),
      createTask({ id: "2", title: "Other thing" }),
    ];

    const filtered = result.current.filterBySearch(tasks);
    expect(filtered).toHaveLength(1);
  });

  it("should return all tasks when query is empty", () => {
    const { result } = renderHook(() => useSearch());

    const tasks = [
      createTask({ id: "1", title: "Task 1" }),
      createTask({ id: "2", title: "Task 2" }),
    ];

    const filtered = result.current.filterBySearch(tasks);
    expect(filtered).toHaveLength(2);
  });

  it("should return all tasks when query is only whitespace", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("   ");
    });
    act(() => {
      jest.advanceTimersByTime(250);
    });

    const tasks = [
      createTask({ id: "1", title: "Task 1" }),
      createTask({ id: "2", title: "Task 2" }),
    ];

    const filtered = result.current.filterBySearch(tasks);
    expect(filtered).toHaveLength(2);
  });
});
