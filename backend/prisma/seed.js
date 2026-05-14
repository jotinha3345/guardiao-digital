const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminSenha = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: { email: "admin@guardiao.digital" },
    update: {},
    create: { nome: "Administrador", email: "admin@guardiao.digital", senha: adminSenha },
  });

  const materiais = [
    ["golpes-whatsapp", "Golpes no WhatsApp", "Como identificar mensagens falsas e pedidos urgentes.", "Desconfie de mensagens com urgencia, premios, pedidos de dinheiro e codigos de verificacao. Confirme sempre por ligacao com a pessoa conhecida.", "Mensagens"],
    ["golpes-pix", "Golpes via PIX", "Proteja suas transferencias e confira chaves antes de pagar.", "Antes de enviar PIX, confira nome, banco, valor e motivo. Bancos nunca exigem PIX para desbloquear conta ou cancelar compra suspeita.", "Financeiro"],
    ["links-falsos", "Links falsos", "Aprenda a analisar enderecos antes de clicar.", "Links falsos imitam bancos, lojas e servicos publicos. Verifique o dominio, evite encurtadores desconhecidos e nunca informe senha apos clique suspeito.", "Navegacao"],
    ["phishing", "Phishing", "Entenda tentativas de roubo de dados.", "Phishing e uma tecnica para roubar dados por e-mail, SMS ou redes sociais. Sinais comuns: erros de escrita, pressa e promessas boas demais.", "Dados"],
    ["senhas-seguras", "Senhas seguras", "Crie senhas fortes e diferentes para cada servico.", "Use frases longas, gerenciador de senhas e nunca reaproveite a senha do e-mail em bancos ou redes sociais.", "Contas"],
    ["autenticacao-2fatores", "Autenticacao em 2 fatores", "Adicione uma camada extra de protecao.", "Ative verificacao em duas etapas em bancos, WhatsApp, e-mail e redes sociais. Prefira aplicativo autenticador quando possivel.", "Contas"],
    ["apos-golpe", "Como agir apos golpe", "Passos para reduzir danos rapidamente.", "Bloqueie cartoes, avise o banco, troque senhas, registre boletim de ocorrencia e guarde prints, numeros e comprovantes.", "Emergencia"],
  ];

  for (const [slug, titulo, resumo, conteudo, categoria] of materiais) {
    await prisma.materialEducativo.upsert({
      where: { slug },
      update: { titulo, resumo, conteudo, categoria },
      create: { slug, titulo, resumo, conteudo, categoria },
    });
  }

  const perguntas = [
    ["Seu banco enviou SMS pedindo clique imediato para evitar bloqueio.", "golpe", "Bancos nao pedem senha por SMS nem exigem clique urgente."],
    ["Um amigo pede dinheiro pelo WhatsApp, mas se recusa a atender ligacao.", "golpe", "Conta clonada costuma evitar chamada de voz ou video."],
    ["Voce acessa o app oficial do banco digitando o endereco conhecido.", "confiavel", "Usar app oficial ou endereco digitado reduz risco de link falso."],
    ["Uma loja desconhecida oferece produto caro por preco muito abaixo do mercado.", "golpe", "Preco irreal e pressa para pagamento sao sinais fortes de fraude."],
  ];

  for (const [pergunta, respostaCorreta, explicacao] of perguntas) {
    const exists = await prisma.quizPergunta.findFirst({ where: { pergunta } });
    if (!exists) {
      await prisma.quizPergunta.create({ data: { pergunta, respostaCorreta, explicacao } });
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
