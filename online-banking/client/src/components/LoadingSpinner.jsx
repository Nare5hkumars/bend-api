export default function LoadingSpinner({ size = 40 }) {
  return (
    <div className="loading-spinner" style={{ width: size, height: size }}>
      <div className="spinner" />
    </div>
  );
}
