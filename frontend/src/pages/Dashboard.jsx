import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, BookOpen, FileSearch, HeartHandshake, MessageSquareWarning, ShieldQuestion } from "lucide-react";
import { api } from "../api/client";
import { Card } from "../components/Card";

const actions = [
  ["Denunciar Golpe", "/denunciar", MessageSquareWarning],
  ["Consultar Denuncias", "/consultar", FileSearch],
  ["Aprender Seguranca", "/educacao", BookOpen],
  ["Teste Anti-Golpe", "/quiz", ShieldQuestion],
  ["Preciso de Ajuda", "/emergencia", HeartHandshake],
];

export function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/denuncias/stats").then(({ data }) => setStats(data)).catch(() => setStats({ total: 0, pendentes: 0, aprovadas: 0, recentes: [], tipos: [] }));
  }, []);

  return (
    <div className="grid gap-8">
      <section className="rounded-lg bg-blue-950 px-6 py-8 text-white">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-200">Sistema de Informacao e Sociedade</p>
          <h1 className="mt-2 text-4xl font-black leading-tight md:text-5xl">Protecao digital feita pela comunidade.</h1>
          <p className="mt-4 text-lg text-blue-100">Denuncie tentativas de golpe, consulte sinais de risco e aprenda a se proteger com linguagem simples e acessivel.</p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-5">
        {actions.map(([label, to, Icon]) => (
          <Link key={to} to={to} className="focus-ring flex min-h-32 flex-col justify-between rounded-lg border border-blue-100 bg-white p-4 text-blue-950 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <Icon size={34} />
            <strong className="text-lg">{label}</strong>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card><span className="text-sm font-bold text-slate-500">Total de denuncias</span><strong className="mt-2 block text-4xl text-blue-950">{stats?.total ?? "..."}</strong></Card>
        <Card><span className="text-sm font-bold text-slate-500">Alertas aprovados</span><strong className="mt-2 block text-4xl text-emerald-700">{stats?.aprovadas ?? "..."}</strong></Card>
        <Card><span className="text-sm font-bold text-slate-500">Em analise</span><strong className="mt-2 block text-4xl text-amber-600">{stats?.pendentes ?? "..."}</strong></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 text-2xl font-black text-blue-950"><AlertTriangle /> Alertas recentes</h2>
          <div className="mt-4 grid gap-3">
            {(stats?.recentes || []).map((item) => (
              <div key={item.id} className="rounded-lg bg-slate-50 p-4">
                <strong>{item.tipoGolpe}</strong>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.descricao}</p>
              </div>
            ))}
            {stats?.recentes?.length === 0 && <p className="text-slate-600">Nenhum alerta aprovado ainda.</p>}
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-black text-blue-950">Golpes mais denunciados</h2>
          <div className="mt-4 grid gap-3">
            {(stats?.tipos || []).map((item) => (
              <div key={item.tipoGolpe} className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                <span className="font-bold">{item.tipoGolpe}</span>
                <span className="rounded-full bg-blue-800 px-3 py-1 text-sm font-bold text-white">{item._count.tipoGolpe}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
