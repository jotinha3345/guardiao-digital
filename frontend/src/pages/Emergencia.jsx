import { CreditCard, FileText, KeyRound, Lock, MessageCircle, Siren } from "lucide-react";
import { Card } from "../components/Card";

const steps = [
  [Siren, "O que fazer imediatamente", "Pare a conversa, nao envie mais dinheiro e guarde prints, links, numeros e comprovantes."],
  [CreditCard, "Bloquear banco/cartao", "Abra o app oficial ou ligue para o numero do verso do cartao. Solicite bloqueio e contestacao."],
  [FileText, "Registrar boletim", "Registre boletim de ocorrencia com todos os dados reunidos."],
  [MessageCircle, "Proteger WhatsApp", "Ative verificacao em duas etapas e avise contatos se houver invasao."],
  [KeyRound, "Alterar senhas", "Troque senhas de e-mail, banco e redes sociais. Use senhas diferentes."],
  [Lock, "Denunciar", "Envie a denuncia aqui no Guardiao Digital para alertar outras pessoas."],
];

export function Emergencia() {
  return (
    <div className="grid gap-5">
      <section className="rounded-lg bg-red-700 p-6 text-white">
        <h1 className="text-4xl font-black">Fui vitima de golpe</h1>
        <p className="mt-2 text-lg text-red-50">Aja rapido. Estas medidas reduzem danos e ajudam na investigacao.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map(([Icon, title, text]) => (
          <Card key={title}>
            <Icon className="text-blue-800" size={34} />
            <h2 className="mt-3 text-xl font-black text-blue-950">{title}</h2>
            <p className="mt-2 text-slate-600">{text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
