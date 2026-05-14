import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Toast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

export function Register() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "", cidade: "", telefone: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await register(form);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Nao foi possivel cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-black text-blue-950">Cadastro comunitario</h1>
      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <Input label="Nome completo" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        <Input label="E-mail" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Senha" type="password" required minLength={6} value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
        <Input label="Cidade" required value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
        <Input label="Telefone opcional" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
        <div className="md:col-span-2"><Toast message={message} type="error" /></div>
        <Button className="md:col-span-2" disabled={loading}>{loading ? "Cadastrando..." : "Criar conta"}</Button>
      </form>
    </Card>
  );
}
