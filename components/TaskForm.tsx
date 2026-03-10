"use client";

import { useState, FormEvent } from "react";

const MAX_TITLE = 100;
const MAX_DESC = 500;

interface TaskFormProps {
  onAdd: (title: string, description: string) => void;
  onClose: () => void;
}

export default function TaskForm({ onAdd, onClose }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const titleLen = title.length;
  const descLen = description.length;
  const titleTrimmed = title.trim();
  const isTitleEmpty = !titleTrimmed;
  const isTitleOver = titleLen > MAX_TITLE;
  const isDescOver = descLen > MAX_DESC;
  const isDisabled = isTitleEmpty || isTitleOver || isDescOver;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    if (isTitleEmpty || isTitleOver || isDescOver) return;

    onAdd(title, description);
    onClose();
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    if (submitted) {
      // re-validate on type
    }
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              type="text"
              className={`form-input ${(submitted && isTitleEmpty) || isTitleOver ? "error" : ""}`}
              placeholder="What needs to be done?"
              value={title}
              onChange={handleTitleChange}
              autoFocus
            />
            <div className="form-footer">
              {submitted && isTitleEmpty ? (
                <span className="form-error">Title is required</span>
              ) : (
                <span />
              )}
              <span className={`char-counter ${isTitleOver ? "over" : ""}`}>
                {titleLen}/{MAX_TITLE}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">
              Description
            </label>
            <textarea
              id="task-desc"
              className={`form-textarea ${isDescOver ? "error" : ""}`}
              placeholder="Add some details... (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="form-footer">
              <span />
              <span className={`char-counter ${isDescOver ? "over" : ""}`}>
                {descLen}/{MAX_DESC}
              </span>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isDisabled}>
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
