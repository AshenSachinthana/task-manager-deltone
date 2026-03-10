interface EmptyStateProps {
  type: "empty" | "search" | "active" | "completed";
}

export default function EmptyState({ type }: EmptyStateProps) {
  let icon: string, title: string, text: string;

  switch (type) {
    case "search":
      icon = "\uD83D\uDD0D";
      title = "No results found";
      text = "No tasks match your search.";
      break;
    case "active":
      icon = "\u2705";
      title = "All caught up!";
      text = "No active tasks.";
      break;
    case "completed":
      icon = "\uD83D\uDCCB";
      title = "Nothing completed yet";
      text = "No completed tasks.";
      break;
    default:
      icon = "\uD83D\uDCDD";
      title = "No tasks yet";
      text = "Click '+ Add Task' to get started!";
      break;
  }

  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-text">{text}</div>
    </div>
  );
}
