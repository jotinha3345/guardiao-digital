import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Toast } from "../components/Toast";

export function Admin() {
  const [auth, setAuth] = useState(Boolean(localStorage.getItem("guardiao_admin_token")));
  const [login, setLogin] = useState({ email: "admin@guardiao.digital", senha: "admin123" });
  const [message, setMessage] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [denuncias, setDenuncias] = useState([]);

  async function enter(event) {
    event.preventDefault();
    try {
      const { data } = await api.post("/admin/login", login);
      localStorage.setItem("guardiao_admin_token", data.token);
      setAuth(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Erro no login admin.");
    }
  }

  async function load() {
    const [dash, list] = await Promise.all([api.get("/admin/dashboard"), api.get("/admin/denuncias")]);
    setDashboard(dash.data);
    setDenuncias(list.data);
  }

  async function changeStatus(id, action) {
    await api.post(`/admin/${action}`, { id });
    await load();
  }

  useEffect(() => { if (auth) load(); }, [auth]);

  if (!auth) {
    return (
      <Card className="mx-auto max-w-md">
        <h1 className="text-3xl font-black text-blue-950">Login admin</h1>
        <form onSubmit={enter} className="mt-6 grid gap-4">
          <Input label="E-mail admin" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
          <Input label="Senha" type="password" value={login.senha} onChange={(e) => setLogin({ ...login, senha: e.target.value })} />
          <Toast message={message} type="error" />
          <Button>Entrar no painel</Button>
        </form>
      </Card>
    );
  }

  return (
    <div className="grid gap-5">
      <h1 className="text-3xl font-black text-blue-950">Painel administrativo</h1>
      <section className="grid gap-4 md:grid-cols-4">
        <Card><span className="font-bold text-slate-500">Total</span><strong className="block text-3xl text-blue-950">{dashboard?.total}</strong></Card>
        <Card><span className="font-bold text-slate-500">Pendentes</span><strong className="block text-3xl text-amber-600">{dashboard?.pendentes}</strong></Card>
        <Card><span className="font-bold text-slate-500">Aprovadas</span><strong className="block text-3xl text-emerald-700">{dashboard?.aprovadas}</strong></Card>
        <Card><span className="font-bold text-slate-500">Cidades afetadas</span><strong className="block text-3xl text-blue-950">{dashboard?.cidadesAfetadas}</strong></Card>
      </section>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3">Tipo</th>
              <th className="p-3">Cidade</th>
              <th className="p-3">Status</th>
              <th className="p-3">Descricao</th>
              <th className="p-3">Print</th>
              <th className="p-3">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {denuncias.map((item) => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="p-3 font-bold">{item.tipoGolpe}</td>
                <td className="p-3">{item.cidade}</td>
                <td className="p-3">{item.status}</td>
                <td className="p-3">{item.descricao.slice(0, 90)}...</td>
                <td className="p-3">{item.imagem ? <a className="font-bold text-blue-800" href={`http://localhost:3333${item.imagem}`} target="_blank">Ver</a> : "-"}</td>
                <td className="flex gap-2 p-3">
                  <Button variant="success" onClick={() => changeStatus(item.id, "aprovar")}>Aprovar</Button>
                  <Button variant="danger" onClick={() => changeStatus(item.id, "rejeitar")}>Rejeitar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
