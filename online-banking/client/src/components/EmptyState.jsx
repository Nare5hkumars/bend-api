export default function EmptyState({ title = 'No data found', message = 'There are no items to display.', icon = '📭' }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
