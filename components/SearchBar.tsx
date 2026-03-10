"use client";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <div className="search-container">
      <span className="search-icon">&#128269;</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search tasks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search tasks"
      />
    </div>
  );
}
