import { useState } from "react";
import { Search } from "lucide-react";
import { api } from "../api/client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";

export function Consulta() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function search(event) {
    event.preventDefault();
    setLoading(true);
    const { data } = await api.get("/denuncias/search", { params: { q } });
    setResult(data);
    setLoading(false);
  }

  const badge = result?.nivelRisco === "alto risco" ? "bg-red-100 text-red-800" : result?.nivelRisco === "atencao" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800";

  return (
    <div className="grid gap-5">
      <Card>
        <h1 className="text-3xl font-black text-blue-950">Consulta publica</h1>
        <form onSubmit={search} className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <Input label="Pesquise por numero, link ou palavra-chave" value={q} onChange={(e) => setQ(e.target.value)} required />
          <Button className="self-end"><Search size={20} /> {loading ? "Buscando..." : "Pesquisar"}</Button>
        </form>
      </Card>
      {result && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-blue-950">"{result.query}" foi citado em {result.total} denuncia(s)</h2>
            <span className={`rounded-full px-4 py-2 text-sm font-black uppercase ${badge}`}>{result.nivelRisco}</span>
          </div>
          <div className="mt-4 grid gap-3">
            {result.resultados.map((item) => (
              <article key={item.id} className="rounded-lg border border-slate-200 p-4">
                <strong className="text-blue-950">{item.tipoGolpe}</strong>
                <p className="mt-1 text-slate-600">{item.descricao.slice(0, 180)}...</p>
              </article>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
