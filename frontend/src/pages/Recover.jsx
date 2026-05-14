import { useState } from "react";
import { api } from "../api/client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Toast } from "../components/Toast";

export function Recover() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    const { data } = await api.post("/auth/recover", { email });
    setMessage(data.message);
  }

  return (
    <Card className="mx-auto max-w-md">
      <h1 className="text-3xl font-black text-blue-950">Recuperar senha</h1>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <Input label="E-mail cadastrado" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button>Enviar instrucoes</Button>
        <Toast message={message} />
      </form>
    </Card>
  );
}
