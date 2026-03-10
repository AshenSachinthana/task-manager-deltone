"use client";

interface NavbarProps {
  taskCount: number;
}

export default function Navbar({ taskCount }: NavbarProps) {
  return (
    <nav className="navbar">
      <span className="navbar-brand">Task Flow</span>
      <span className="navbar-summary">
        {taskCount} {taskCount === 1 ? "task" : "tasks"} today
      </span>
    </nav>
  );
}
