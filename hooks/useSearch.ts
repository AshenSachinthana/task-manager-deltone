"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Task } from "./useTasks";

export default function useSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const filterBySearch = useCallback(
    (tasks: Task[]): Task[] => {
      if (!debouncedQuery.trim()) return tasks;
      const q = debouncedQuery.toLowerCase().trim();
      return tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    },
    [debouncedQuery]
  );

  return { query, setQuery, debouncedQuery, filterBySearch };
}
