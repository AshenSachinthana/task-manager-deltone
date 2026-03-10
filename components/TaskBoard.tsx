"use client";

import { useState, useEffect, useMemo } from "react";
import useTasks, { Task } from "../hooks/useTasks";
import useSearch from "../hooks/useSearch";
import usePagination from "../hooks/usePagination";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import TaskEditModal from "./TaskEditModal";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";

type FilterKey = "all" | "active" | "completed";

export default function TaskBoard() {
  const { tasks, loaded, addTask, editTask, deleteTask, toggleTask, counts } =
    useTasks();
  const { query, setQuery, filterBySearch } = useSearch();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Apply filter
  const filteredByStatus = useMemo(() => {
    switch (activeFilter) {
      case "active":
        return tasks.filter((t) => !t.completed);
      case "completed":
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, activeFilter]);

  // Apply search on top of filter
  const filteredTasks = useMemo(
    () => filterBySearch(filteredByStatus),
    [filteredByStatus, filterBySearch]
  );

  const {
    page,
    setPage,
    totalPages,
    resetPage,
    paginateItems,
    startItem,
    endItem,
  } = usePagination(filteredTasks.length);

  // Reset page when filter or search changes
  const filterSearchKey = `${activeFilter}-${query}`;
  useEffect(() => {
    resetPage();
  }, [filterSearchKey, resetPage]);

  const paginatedTasks = paginateItems(filteredTasks);

  // Determine empty state type
  function getEmptyType(): "empty" | "search" | "active" | "completed" {
    if (tasks.length === 0) return "empty";
    if (query.trim()) return "search";
    if (activeFilter === "active") return "active";
    if (activeFilter === "completed") return "completed";
    return "empty";
  }

  if (!loaded) return null;

  return (
    <>
      <Navbar taskCount={counts.all} />
      <main className="task-board">
        <div className="board-header">
          <div className="search-wrapper">
            <SearchBar query={query} setQuery={setQuery} />
          </div>
          <button className="btn-add-task" onClick={() => setShowAddModal(true)}>
            + Add Task
          </button>
        </div>

        <FilterTabs
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          counts={counts}
        />

        {paginatedTasks.length > 0 ? (
          <>
            <TaskList
              tasks={paginatedTasks}
              onToggle={toggleTask}
              onEdit={setEditingTask}
              onDelete={deleteTask}
            />
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              startItem={startItem}
              endItem={endItem}
              totalItems={filteredTasks.length}
            />
          </>
        ) : (
          <EmptyState type={getEmptyType()} />
        )}
      </main>

      {showAddModal && (
        <TaskForm
          onAdd={addTask}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={editTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  );
}
