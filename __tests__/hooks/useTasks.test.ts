import { renderHook, act } from "@testing-library/react";
import useTasks from "../../hooks/useTasks";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock crypto.randomUUID
Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: jest.fn(() => "test-uuid-" + Math.random().toString(36).slice(2)),
  },
});

describe("useTasks hook", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it("should initialize with empty tasks", () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toEqual([]);
    expect(result.current.loaded).toBe(true);
  });

  it("should add a new task", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Test Task", "Test Description");
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Test Task");
    expect(result.current.tasks[0].description).toBe("Test Description");
    expect(result.current.tasks[0].completed).toBe(false);
  });

  it("should trim title and description when adding", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("  Trimmed Title  ", "  Trimmed Desc  ");
    });

    expect(result.current.tasks[0].title).toBe("Trimmed Title");
    expect(result.current.tasks[0].description).toBe("Trimmed Desc");
  });

  it("should add new tasks at the top of the list", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("First", "");
    });
    act(() => {
      result.current.addTask("Second", "");
    });

    expect(result.current.tasks[0].title).toBe("Second");
    expect(result.current.tasks[1].title).toBe("First");
  });

  it("should edit a task", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Original", "Original Desc");
    });

    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.editTask(taskId, "Updated", "Updated Desc");
    });

    expect(result.current.tasks[0].title).toBe("Updated");
    expect(result.current.tasks[0].description).toBe("Updated Desc");
    expect(result.current.tasks[0].updatedAt).not.toBe(result.current.tasks[0].createdAt);
  });

  it("should delete a task", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("To Delete", "");
    });

    expect(result.current.tasks).toHaveLength(1);
    const taskId = result.current.tasks[0].id;

    act(() => {
      result.current.deleteTask(taskId);
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  it("should toggle task completion", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Toggle Me", "");
    });

    const taskId = result.current.tasks[0].id;
    expect(result.current.tasks[0].completed).toBe(false);

    act(() => {
      result.current.toggleTask(taskId);
    });

    expect(result.current.tasks[0].completed).toBe(true);

    act(() => {
      result.current.toggleTask(taskId);
    });

    expect(result.current.tasks[0].completed).toBe(false);
  });

  it("should return correct counts", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Task 1", "");
      result.current.addTask("Task 2", "");
      result.current.addTask("Task 3", "");
    });

    expect(result.current.counts).toEqual({ all: 3, active: 3, completed: 0 });

    const taskId = result.current.tasks[0].id;
    act(() => {
      result.current.toggleTask(taskId);
    });

    expect(result.current.counts).toEqual({ all: 3, active: 2, completed: 1 });
  });

  it("should persist tasks to localStorage", () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask("Persist Me", "");
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "taskmanager_tasks",
      expect.any(String)
    );

    const savedData = JSON.parse(
      localStorageMock.setItem.mock.calls[localStorageMock.setItem.mock.calls.length - 1][1]
    );
    expect(savedData[0].title).toBe("Persist Me");
  });

  it("should load tasks from localStorage", () => {
    const existingTasks = [
      {
        id: "existing-1",
        title: "Existing Task",
        description: "Already here",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingTasks));

    const { result } = renderHook(() => useTasks());

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe("Existing Task");
  });

  it("should handle corrupted localStorage gracefully", () => {
    localStorageMock.getItem.mockReturnValueOnce("invalid json{{{");

    const { result } = renderHook(() => useTasks());

    expect(result.current.tasks).toEqual([]);
    expect(result.current.loaded).toBe(true);
  });
});
