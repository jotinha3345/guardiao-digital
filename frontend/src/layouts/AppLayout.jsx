import { Link, NavLink, Outlet } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AppLayout() {
  const { user, logout } = useAuth();
  const nav = [
    ["Inicio", "/"],
    ["Denunciar", "/denunciar"],
    ["Consultar", "/consultar"],
    ["Aprender", "/educacao"],
    ["Teste", "/quiz"],
    ["Ajuda", "/emergencia"],
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/" className="flex items-center gap-3 text-blue-950">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-800 text-white"><ShieldCheck size={28} /></span>
            <div>
              <strong className="block text-xl">Guardiao Digital</strong>
              <span className="text-sm text-slate-600">Comunidade contra golpes digitais</span>
            </div>
          </Link>
          <nav className="flex flex-wrap gap-2">
            {nav.map(([label, to]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `rounded-lg px-4 py-3 text-sm font-bold ${isActive ? "bg-blue-800 text-white" : "text-slate-700 hover:bg-blue-50"}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <button onClick={logout} className="focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-slate-700"><LogOut size={18} /> Sair</button>
            ) : (
              <Link to="/login" className="focus-ring rounded-lg bg-blue-800 px-5 py-3 font-bold text-white">Entrar</Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
