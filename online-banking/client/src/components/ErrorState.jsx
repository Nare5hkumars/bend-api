export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="error-state">
      <span className="error-icon">⚠️</span>
      <h3>Error</h3>
      <p>{message}</p>
      {onRetry && <button className="btn btn-primary" onClick={onRetry}>Try Again</button>}
    </div>
  );
}
