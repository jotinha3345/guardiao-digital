export function Input({ label, error, ...props }) {
  return (
    <label className="grid gap-2 text-left text-sm font-semibold text-slate-700">
      {label}
      <input className="focus-ring min-h-12 rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900" {...props} />
      {error && <span className="text-sm font-medium text-red-600">{error}</span>}
    </label>
  );
}
