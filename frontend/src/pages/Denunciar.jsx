import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { api } from "../api/client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Toast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const tipos = ["WhatsApp", "PIX", "SMS falso", "Instagram hackeado", "Marketplace", "Banco falso", "Outro"];

export function Denunciar() {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ tipoGolpe: "WhatsApp", descricao: "", numeroSuspeito: "", linkSuspeito: "", nomeSuspeito: "", imagem: null });

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  async function submit() {
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => value && data.append(key, value));
    await api.post("/denuncias/create", data, { headers: { "Content-Type": "multipart/form-data" } });
    setMessage("Denuncia enviada com sucesso. Ela ficara pendente ate avaliacao.");
    setStep(5);
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <p className="font-bold text-blue-800">Etapa {step} de 5</p>
      <h1 className="mt-2 text-3xl font-black text-blue-950">Denunciar golpe</h1>
      <div className="mt-6">
        {step === 1 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {tipos.map((tipo) => (
              <button key={tipo} onClick={() => setForm({ ...form, tipoGolpe: tipo })} className={`focus-ring rounded-lg border p-5 text-left text-lg font-bold ${form.tipoGolpe === tipo ? "border-blue-800 bg-blue-800 text-white" : "border-slate-200 bg-white"}`}>
                {tipo}
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Descricao detalhada
            <textarea rows={7} className="focus-ring rounded-lg border border-slate-300 p-4 text-base" required value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          </label>
        )}
        {step === 3 && (
          <div className="grid gap-4">
            <Input label="Numero suspeito" value={form.numeroSuspeito} onChange={(e) => setForm({ ...form, numeroSuspeito: e.target.value })} />
            <Input label="Link suspeito" value={form.linkSuspeito} onChange={(e) => setForm({ ...form, linkSuspeito: e.target.value })} />
            <Input label="Nome utilizado" value={form.nomeSuspeito} onChange={(e) => setForm({ ...form, nomeSuspeito: e.target.value })} />
          </div>
        )}
        {step === 4 && (
          <label className="focus-ring grid cursor-pointer place-items-center gap-3 rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 p-10 text-center">
            <Upload size={40} className="text-blue-800" />
            <strong>{form.imagem ? form.imagem.name : "Enviar print ou imagem"}</strong>
            <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => setForm({ ...form, imagem: e.target.files[0] })} />
          </label>
        )}
        {step === 5 && (
          <div className="rounded-lg bg-emerald-50 p-6 text-emerald-900">
            <h2 className="text-2xl font-black">Confirmacao</h2>
            <p className="mt-2">Obrigado por fortalecer a seguranca da sua comunidade.</p>
            <Toast message={message} />
          </div>
        )}
      </div>
      {step < 5 && (
        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Button variant="secondary" disabled={step === 1} onClick={() => setStep(step - 1)}>Voltar</Button>
          {step < 4 ? <Button onClick={() => setStep(step + 1)}>Continuar</Button> : <Button onClick={submit}>Enviar denuncia</Button>}
        </div>
      )}
    </Card>
  );
}
