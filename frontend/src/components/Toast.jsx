export function Toast({ message, type = "info" }) {
  if (!message) return null;
  const color = type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-blue-200 bg-blue-50 text-blue-900";
  return <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${color}`}>{message}</div>;
}
