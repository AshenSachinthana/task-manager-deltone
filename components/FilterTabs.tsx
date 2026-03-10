"use client";

import { TaskCounts } from "../hooks/useTasks";

type FilterKey = "all" | "active" | "completed";

interface FilterTabsProps {
  activeFilter: FilterKey;
  setActiveFilter: (filter: FilterKey) => void;
  counts: TaskCounts;
}

const TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export default function FilterTabs({ activeFilter, setActiveFilter, counts }: FilterTabsProps) {
  return (
    <div className="filter-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`filter-tab ${activeFilter === tab.key ? "active" : ""}`}
          onClick={() => setActiveFilter(tab.key)}
        >
          {tab.label}
          <span className="filter-tab-count">({counts[tab.key]})</span>
        </button>
      ))}
    </div>
  );
}
