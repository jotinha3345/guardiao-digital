import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { api } from "../api/client";
import { Card } from "../components/Card";

export function Educacao() {
  const [materiais, setMateriais] = useState([]);
  useEffect(() => { api.get("/material/list").then(({ data }) => setMateriais(data)); }, []);
  return (
    <div className="grid gap-5">
      <h1 className="text-3xl font-black text-blue-950">Aprender seguranca</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {materiais.map((item) => (
          <Link key={item.id} to={`/educacao/${item.slug}`} className="focus-ring rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1">
            <BookOpen className="text-blue-800" size={34} />
            <h2 className="mt-4 text-xl font-black text-blue-950">{item.titulo}</h2>
            <p className="mt-2 text-slate-600">{item.resumo}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MaterialDetalhe() {
  const [material, setMaterial] = useState(null);
  const { slug } = useParams();
  useEffect(() => { api.get(`/material/${slug}`).then(({ data }) => setMaterial(data)); }, [slug]);
  if (!material) return <Card>Carregando...</Card>;
  return (
    <Card className="mx-auto max-w-3xl">
      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-800">{material.categoria}</span>
      <h1 className="mt-4 text-4xl font-black text-blue-950">{material.titulo}</h1>
      <p className="mt-4 text-lg leading-8 text-slate-700">{material.conteudo}</p>
    </Card>
  );
}
