"use client";

import { useState } from "react";
import { Task } from "../hooks/useTasks";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const isEdited = task.updatedAt !== task.createdAt;

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      <button
        className={`task-toggle ${task.completed ? "checked" : ""}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed && <span className="checkmark">&#10003;</span>}
      </button>

      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
        <div className="task-meta">
          <span>{formatDate(task.createdAt)}</span>
          {isEdited && (
            <span className="badge-edited">Edited {formatDate(task.updatedAt)}</span>
          )}
          {task.completed && <span className="badge-completed">Completed</span>}
        </div>

        {showConfirm && (
          <div className="delete-confirm">
            <span>Delete this task? This cannot be undone.</span>
            <button
              className="btn-confirm-delete"
              onClick={() => {
                onDelete(task.id);
                setShowConfirm(false);
              }}
            >
              Delete
            </button>
            <button
              className="btn-cancel-delete"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="task-actions">
        <button
          className="btn-icon"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          title="Edit"
        >
          <svg style={{width:"60%",height:"60%"}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className="btn-icon danger"
          onClick={() => setShowConfirm(true)}
          aria-label="Delete task"
          title="Delete"
        >
          <svg style={{width:"60%",height:"60%"}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
