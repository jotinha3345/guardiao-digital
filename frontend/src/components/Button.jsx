export function Button({ children, className = "", variant = "primary", ...props }) {
  const styles = {
    primary: "bg-blue-800 text-white hover:bg-blue-900",
    secondary: "bg-white text-blue-900 border border-blue-200 hover:bg-blue-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
  };
  return (
    <button className={`focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-base font-semibold shadow-sm transition ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
