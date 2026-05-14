import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

export function Quiz() {
  const [perguntas, setPerguntas] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [resultado, setResultado] = useState(null);

  useEffect(() => { api.get("/quiz/list").then(({ data }) => setPerguntas(data)); }, []);

  function answer(id, resposta) {
    setRespostas((old) => [...old.filter((item) => item.id !== id), { id, resposta }]);
  }

  async function submit() {
    const { data } = await api.post("/quiz/submit", { respostas });
    setResultado(data);
  }

  if (resultado) {
    return (
      <Card className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black text-blue-950">Pontuacao final: {resultado.pontuacao}/{resultado.total}</h1>
        <p className="mt-2 text-xl font-bold text-blue-800">Nivel: {resultado.nivel}</p>
        <div className="mt-6 grid gap-3">
          {resultado.detalhes.map((item) => (
            <div key={item.id} className={`rounded-lg p-4 ${item.correta ? "bg-emerald-50" : "bg-red-50"}`}>
              <strong>{item.pergunta}</strong>
              <p className="mt-1">{item.explicacao}</p>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-3xl font-black text-blue-950">Teste Anti-Golpe</h1>
      {perguntas.map((item, index) => (
        <Card key={item.id}>
          <p className="font-bold text-blue-800">Pergunta {index + 1}</p>
          <h2 className="mt-2 text-2xl font-black text-blue-950">{item.pergunta}</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {["confiavel", "golpe"].map((option) => (
              <Button key={option} variant={respostas.find((r) => r.id === item.id)?.resposta === option ? "primary" : "secondary"} onClick={() => answer(item.id, option)}>
                {option}
              </Button>
            ))}
          </div>
        </Card>
      ))}
      <Button disabled={respostas.length !== perguntas.length} onClick={submit}>Finalizar teste</Button>
    </div>
  );
}
