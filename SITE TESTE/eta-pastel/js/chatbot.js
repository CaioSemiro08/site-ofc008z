const FALLBACK_FAQ = [
  {
    keywords: ["sabor", "sabores", "cardapio", "pastel", "pasteis", "menu", "recheio"],
    resposta: "Temos pastéis gigantes de 30cm de **Carne Especial, Frango com Catupiry, Queijo Duplo, Bauru Supremo e Palmito**, além dos doces e porções de **Mini Pastéis**!"
  },
  {
    keywords: ["preco", "valor", "quanto", "custa", "tamanho", "30cm"],
    resposta: "Nossos pastéis gigantes têm **30 cm reais** e custam entre **R$ 18,50 e R$ 24,90**."
  },
  {
    keywords: ["suco", "sucos", "bebida", "bebidas", "refrigerante", "caldo", "cana"],
    resposta: "Temos **Sucos Naturais (500 ml)** feitos na hora, **Caldo de Cana (1L)** e refrigerantes em lata."
  },
  {
    keywords: ["horario", "hora", "aberto", "abre", "fecha", "funcionamento"],
    resposta: "Funcionamos de **Terça a Domingo, das 16h00 às 23h30**."
  },
  {
    keywords: ["entrega", "delivery", "ifood", "99", "pedir", "pedido", "whatsapp"],
    resposta: "Monte seu carrinho aqui no site e envie direto para o nosso **WhatsApp (19) 99909-2169**, ou peça pelo **iFood** e **99 Food**."
  },
  {
    keywords: ["onde", "endereco", "local", "rua", "bairro", "loja"],
    resposta: "**Loja 1 (Matriz):** Rua Adão Soares da Silva, 347 - Jd. Monte Cristo. **Loja 2 (Delivery):** Av. Amílton Alves de Souza, 400 - Jd. Nossa Sra. de Lourdes."
  }
];

document.addEventListener("DOMContentLoaded", async () => {
  const botaoChat = document.getElementById("chat-toggle");
  const janelaChat = document.getElementById("chat-box");
  const fecharChat = document.getElementById("chat-close");
  const mensagensDiv = document.getElementById("chat-messages");
  const inputMsg = document.getElementById("chat-input");
  const botaoEnviar = document.getElementById("chat-send");

  let baseDeDados = [];

  try {
    const res = await fetch("data/faq.json");
    if (!res.ok) throw new Error("Falha ao carregar faq.json");
    baseDeDados = await res.json();
  } catch (erro) {
    baseDeDados = FALLBACK_FAQ;
  }

  adicionarMensagem("Olá! 🥟 Bem-vindo à **Êta Pastel**! Pergunte sobre **sabores**, **preços**, **sucos**, **horário** ou **delivery**.", "bot");

  botaoChat.addEventListener("click", () => janelaChat.classList.toggle("oculto"));
  fecharChat.addEventListener("click", () => janelaChat.classList.add("oculto"));
  botaoEnviar.addEventListener("click", processarEnvio);
  inputMsg.addEventListener("keypress", (e) => {
    if (e.key === "Enter") processarEnvio();
  });

  function processarEnvio() {
    const textoUsuario = inputMsg.value.trim();
    if (!textoUsuario) return;

    adicionarMensagem(textoUsuario, "usuario");
    inputMsg.value = "";

    setTimeout(() => {
      const resposta = buscarResposta(textoUsuario);
      adicionarMensagem(resposta, "bot");
    }, 300);
  }

  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function buscarResposta(perguntaUsuario) {
    const textoLimpo = normalizar(perguntaUsuario);

    if (["oi", "ola", "bom dia", "boa tarde", "boa noite", "eai"].includes(textoLimpo)) {
      return "Oi! Tudo bem? Como posso ajudar com seu pedido de pastel hoje? 🥟";
    }

    let melhorItem = null;
    let maiorPontuacao = 0;

    baseDeDados.forEach((item) => {
      let pontos = 0;
      item.keywords.forEach((palavra) => {
        if (textoLimpo.includes(normalizar(palavra))) pontos++;
      });

      if (pontos > maiorPontuacao) {
        maiorPontuacao = pontos;
        melhorItem = item;
      }
    });

    if (melhorItem) return melhorItem.resposta;

    return "Humm, não entendi muito bem! 😅 Tente perguntar sobre **sabores**, **preços**, **sucos**, **horário**, **endereço** ou **delivery**.";
  }

  function adicionarMensagem(texto, remetente) {
    const div = document.createElement("div");
    div.classList.add("msg", remetente);
    div.innerHTML = texto.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    mensagensDiv.appendChild(div);
    mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
  }
});