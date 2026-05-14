import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Toast } from "../components/Toast";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await login(form.email, form.senha);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Nao foi possivel entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-md gap-4">
      <Card>
        <h1 className="text-3xl font-black text-blue-950">Entrar</h1>
        <p className="mt-2 text-slate-600">Acesse para denunciar golpes e acompanhar sua comunidade.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Input label="E-mail" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Senha" type="password" required value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
          <Toast message={message} type="error" />
          <Button disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
        </form>
        <div className="mt-5 grid gap-2 text-sm">
          <Link className="font-bold text-blue-800" to="/cadastro">Criar cadastro</Link>
          <Link className="font-bold text-blue-800" to="/recuperar-senha">Esqueci minha senha</Link>
        </div>
      </Card>
    </div>
  );
}
