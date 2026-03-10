"use client";

import { useState, FormEvent } from "react";
import { Task } from "../hooks/useTasks";

const MAX_TITLE = 100;
const MAX_DESC = 500;

interface TaskEditModalProps {
  task: Task;
  onSave: (id: string, title: string, description: string) => void;
  onClose: () => void;
}

export default function TaskEditModal({ task, onSave, onClose }: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
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

    onSave(task.id, title, description);
    onClose();
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
        <h2 className="modal-title">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="edit-title">
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              className={`form-input ${(submitted && isTitleEmpty) || isTitleOver ? "error" : ""}`}
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <label className="form-label" htmlFor="edit-desc">
              Description
            </label>
            <textarea
              id="edit-desc"
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
