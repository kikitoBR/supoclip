export interface SeoPageLink {
  href: string;
  label: string;
}

export interface SeoPageSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  /** Contextual internal links rendered under the section. */
  links?: SeoPageLink[];
}

export interface SeoPageFaq {
  question: string;
  answer: string;
}

export interface SeoPage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heading: string;
  summary: string;
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  tableCaption: string;
  tableHeaders: [string, string, string];
  tableRows: Array<[string, string, string]>;
  sections: SeoPageSection[];
  faqs: SeoPageFaq[];
}

export const seoPages: SeoPage[] = [
  {
    slug: "ai-video-clipper",
    metaTitle: "Cortador de vídeo com IA para Shorts, Reels e TikTok",
    metaDescription:
      "Use o Kortes para encontrar os melhores momentos de vídeos longos, pontuar os trechos mais promissores, criar cortes verticais que acompanham o rosto, adicionar legendas e exportar clipes prontos para as redes.",
    eyebrow: "Cortes com IA",
    heading: "Cortador de vídeo com IA para transformar vídeos longos em cortes melhores",
    summary:
      "O Kortes reúne transcrição, detecção de destaques com IA, pontuação de viralidade, reenquadramento que acompanha o rosto, legendas sincronizadas palavra a palavra e predefinições de exportação em um único fluxo de código aberto.",
    keywords: [
      "cortador de vídeo com IA",
      "gerador de clipes com IA",
      "vídeo longo para shorts",
      "cortes automáticos de vídeo",
      "gerador de shorts com IA",
    ],
    publishedAt: "2026-07-27",
    updatedAt: "2026-10-05",
    tableCaption: "O que o Kortes faz em cada etapa do corte com IA",
    tableHeaders: ["Etapa", "Do jeito manual", "Com o Kortes"],
    tableRows: [
      ["Encontrar momentos", "Assistir à gravação inteira", "Transcrever e pontuar os trechos candidatos"],
      ["Reenquadrar", "Cortar cada cena à mão", "Acompanhar rostos para o formato vertical 9:16"],
      ["Legendar", "Sincronizar legendas manualmente", "Gerar legendas animadas sincronizadas palavra a palavra"],
      ["Exportar", "Configurar cada plataforma separadamente", "Usar predefinições para Shorts, Reels e TikTok"],
    ],
    sections: [
      {
        heading: "O que um cortador de vídeo com IA deve automatizar",
        paragraphs: [
          "A parte demorada da produção de vídeos curtos não é uma edição isolada. É repetir a mesma revisão, reenquadramento, legendagem e exportação para cada vídeo original. Um bom cortador com IA reduz essa repetição e deixa o criador no controle do corte final.",
          "O Kortes parte da transcrição do vídeo, identifica trechos candidatos e os pontua por critérios como força do gancho, engajamento, valor e potencial de compartilhamento. A pontuação ajuda na revisão; não é uma promessa de que o clipe vai viralizar.",
        ],
        bullets: [
          "Links do YouTube e arquivos de vídeo enviados",
          "Seleção de candidatos com ajuda de IA",
          "Cortes verticais centralizados no rosto",
          "Estilos de legenda e formatos de exportação editáveis",
        ],
      },
      {
        heading: "Como funciona o fluxo do Kortes",
        paragraphs: [
          "Cole um link do YouTube ou envie um arquivo. O Kortes transcreve a gravação, sugere onde cada clipe começa e termina e apresenta os melhores candidatos para revisão. Os momentos escolhidos viram vídeos verticais e legendados para as plataformas de vídeos curtos.",
          "Como o Kortes é de código aberto, as equipes podem inspecionar o processo, escolher modelos de linguagem hospedados ou locais e adaptar o processamento à própria infraestrutura. Também há uma versão hospedada para quem não quer cuidar da instalação.",
        ],
        links: [
          { href: "/youtube-shorts-clipper", label: "Passo a passo: transforme um vídeo do YouTube em Shorts" },
          { href: "/blog/self-host-supoclip-docker", label: "Rode o processo você mesmo com Docker" },
        ],
      },
      {
        heading: "Para quem foi feito",
        paragraphs: [
          "O fluxo atende podcasters, educadores, empreendedores, agências e equipes de vídeo que já produzem gravações longas e precisam de um jeito repetível de publicar mais vídeos curtos.",
          "É especialmente útil quando a propriedade importa: quem hospeda o próprio Kortes mantém o controle da aplicação e pode modificar o código, em vez de depender totalmente de uma plataforma de edição fechada.",
        ],
        links: [
          { href: "/blog/supoclip-vs-opusclip", label: "Como o Kortes se compara ao OpusClip" },
          { href: "/open-source-video-clipper", label: "Por que equipes escolhem um cortador de código aberto" },
        ],
      },
    ],
    faqs: [
      {
        question: "O que é um cortador de vídeo com IA?",
        answer:
          "É uma ferramenta que analisa uma gravação longa e ajuda a encontrar trechos curtos, reenquadrá-los, adicionar legendas e preparar a exportação para as plataformas de vídeos curtos.",
      },
      {
        question: "O Kortes transforma vídeos do YouTube em Shorts?",
        answer:
          "Sim. O Kortes aceita links do YouTube, identifica os momentos candidatos e gera clipes verticais e legendados, próprios para o YouTube Shorts.",
      },
      {
        question: "O Kortes é de código aberto?",
        answer:
          "Sim. O código do Kortes está disponível sob a licença AGPL-3.0 e pode ser hospedado por você ou modificado.",
      },
    ],
  },
  {
    slug: "open-source-video-clipper",
    metaTitle: "Cortador de vídeo de código aberto para hospedar você mesmo",
    metaDescription:
      "O Kortes é um cortador de vídeo com IA de código aberto para detectar destaques, criar cortes verticais que acompanham o rosto, legendar e exportar vídeos curtos no seu próprio servidor.",
    eyebrow: "Código aberto e auto-hospedado",
    heading: "Cortador de vídeo de código aberto com controle total do fluxo",
    summary:
      "Rode os cortes com IA na sua própria infraestrutura, inspecione o código, escolha o provedor de modelos e personalize como os clipes são pontuados, legendados, enquadrados e exportados.",
    keywords: [
      "cortador de vídeo de código aberto",
      "editor de vídeo com IA auto-hospedado",
      "gerador de clipes com IA de código aberto",
      "cortes de vídeo auto-hospedados",
      "alternativa ao OpusClip de código aberto",
    ],
    publishedAt: "2026-07-27",
    updatedAt: "2026-10-05",
    tableCaption: "Ferramentas só hospedadas e fluxos de código aberto",
    tableHeaders: ["Decisão", "Ferramenta só hospedada", "Kortes auto-hospedado"],
    tableRows: [
      ["Acesso ao código", "Indisponível", "Repositório completo sob AGPL-3.0"],
      ["Infraestrutura", "Controlada pelo fornecedor", "Seu servidor ou ambiente local"],
      ["Escolha do modelo", "Definida pelo fornecedor", "Provedores hospedados compatíveis ou Ollama"],
      ["Personalização", "Configurações do produto", "Código da aplicação e do processamento"],
    ],
    sections: [
      {
        heading: "Por que hospedar o seu próprio processo de cortes",
        paragraphs: [
          "Hospedar por conta própria vale a pena quando a equipe precisa controlar a instalação, a escolha de provedores, os limites de processamento ou a personalização do produto. Em vez de depender de uma plataforma fechada para cada decisão, a aplicação roda junto com o restante da infraestrutura da equipe.",
          "O Kortes inclui um frontend em Next.js, um backend em FastAPI, workers em segundo plano, PostgreSQL e Redis. O repositório traz uma configuração de Docker Compose para instalar a aplicação completa de uma vez.",
        ],
      },
      {
        heading: "O que continua sendo responsabilidade sua",
        paragraphs: [
          "Código aberto não significa que todas as dependências são gratuitas. Quem hospeda fornece a própria capacidade de processamento, armazenamento, serviço de transcrição e configuração de modelos de linguagem. A troca é assumir a operação em troca de controle sobre o código.",
          "As equipes também devem ler a licença AGPL-3.0, proteger as variáveis de ambiente, manter as dependências atualizadas e monitorar o worker e o armazenamento em produção.",
        ],
        bullets: [
          "Providenciar processamento e armazenamento persistente",
          "Configurar os provedores de transcrição e de modelos",
          "Proteger segredos e rotas autenticadas",
          "Monitorar os trabalhos de processamento e as mídias geradas",
        ],
        links: [{ href: "/blog/self-host-supoclip-docker", label: "Checklist de produção no guia de auto-hospedagem" }],
      },
      {
        heading: "Comece com Docker e personalize quando precisar",
        paragraphs: [
          "O jeito mais rápido é clonar o repositório, copiar o modelo de variáveis de ambiente, adicionar as credenciais dos provedores e subir tudo com Docker Compose. Depois, os desenvolvedores podem mudar a lógica de pontuação, as predefinições de legenda, a interface ou o modelo de instalação conforme o fluxo evolui.",
          "Quem prefere não operar infraestrutura pode usar a versão hospedada do Kortes e manter o repositório de código aberto como caminho de migração.",
        ],
        links: [
          { href: "/blog/self-host-supoclip-docker", label: "Hospede o Kortes com Docker Compose" },
          { href: "/blog/supoclip-vs-opusclip", label: "Kortes auto-hospedado ou OpusClip hospedado" },
        ],
      },
    ],
    faqs: [
      {
        question: "É grátis hospedar o Kortes?",
        answer:
          "O código é gratuito sob a licença AGPL-3.0. Você continua responsável pela infraestrutura e por qualquer uso pago de transcrição ou de provedores de IA.",
      },
      {
        question: "O Kortes funciona com um modelo de linguagem local?",
        answer:
          "Sim. O Kortes aceita o Ollama para escolher os clipes, e TRANSCRIPTION_PROVIDER=whisper faz a transcrição localmente, sem chamar o AssemblyAI.",
      },
      {
        question: "O Kortes exige Docker?",
        answer:
          "O Docker Compose é o caminho documentado para a aplicação completa. Os desenvolvedores podem rodar o frontend em Next.js, a API em FastAPI, o worker, o PostgreSQL e o Redis separadamente quando o ambiente exigir.",
      },
    ],
  },
  {
    slug: "youtube-shorts-clipper",
    metaTitle: "Cortador de YouTube Shorts para vídeos longos",
    metaDescription:
      "Transforme vídeos longos do YouTube em Shorts verticais e legendados com detecção de destaques por IA, pontuação de viralidade e cortes 9:16 que acompanham o rosto.",
    eyebrow: "Do YouTube para o Shorts",
    heading: "Cortador de YouTube Shorts para reaproveitar vídeos longos",
    summary:
      "Cole um link do YouTube, revise os momentos escolhidos pela IA e crie clipes verticais legendados sem precisar assistir e reenquadrar a gravação inteira.",
    keywords: [
      "cortador de YouTube Shorts",
      "vídeo do YouTube para Shorts",
      "vídeo longo para clipes curtos",
      "gerador de cortes do YouTube com IA",
      "gerador de destaques do YouTube",
    ],
    publishedAt: "2026-07-27",
    updatedAt: "2026-10-05",
    tableCaption: "Do vídeo longo ao YouTube Shorts",
    tableHeaders: ["Etapa", "Entrada", "Resultado"],
    tableRows: [
      ["1. Importar", "Link do YouTube", "Metadados e vídeo original"],
      ["2. Analisar", "Transcrição", "Trechos candidatos e pontuações"],
      ["3. Formatar", "Momento escolhido", "Clipe 9:16 que acompanha o rosto"],
      ["4. Finalizar", "Legendas e configurações de exportação", "Vídeo curto pronto para a plataforma"],
    ],
    sections: [
      {
        heading: "Como transformar um vídeo do YouTube em Shorts",
        paragraphs: [
          "Comece com um vídeo seu ou que você tenha permissão para reaproveitar. Cole o link do YouTube no Kortes, escolha as opções de saída e de legenda e inicie o processamento. A aplicação transcreve o vídeo e sugere trechos curtos para revisão.",
          "Escolha momentos que façam sentido sem o resto do episódio. Bons Shorts costumam apresentar o contexto rápido, entregar uma ideia clara e terminar sem depender de partes que ficaram de fora do clipe.",
        ],
        bullets: [
          "Use um gancho falado e claro logo no começo",
          "Mantenha uma ideia por clipe",
          "Revise nomes, números e o tempo das legendas",
          "Confira se o enquadramento vertical acompanha quem está falando",
        ],
      },
      {
        heading: "Legendas e reenquadramento vertical",
        paragraphs: [
          "O Kortes usa o tempo de cada palavra para criar legendas sincronizadas e acompanha rostos ao converter vídeos horizontais para o formato vertical. Os modelos de legenda dão um ponto de partida consistente, e fonte, cor e configurações de saída podem ser ajustadas antes de renderizar.",
          "Os cortes automáticos ainda merecem uma revisão visual, principalmente quando aparecem várias pessoas, quando há compartilhamento de tela importante ou quando quem fala se move rápido pelo quadro.",
        ],
        links: [{ href: "/ai-video-clipper", label: "O que o cortador com IA automatiza, etapa por etapa" }],
      },
      {
        heading: "Monte um fluxo de reaproveitamento repetível",
        paragraphs: [
          "Trate cada vídeo longo como uma biblioteca de conteúdo, não como um envio único. Processe a gravação, agrupe os clipes por tema e ligue cada Short ao vídeo longo ou a uma página relevante.",
          "Acompanhe quais temas geram tempo de exibição e engajamento e use esses resultados para orientar as próximas gravações. As pontuações do Kortes ajudam a priorizar candidatos; os dados das publicações mostram o que o público realmente valoriza.",
        ],
        links: [{ href: "/blog/supoclip-vs-opusclip", label: "Como escolher entre o Kortes e o OpusClip" }],
      },
    ],
    faqs: [
      {
        question: "Posso colar um link do YouTube no Kortes?",
        answer:
          "Sim. O Kortes aceita links do YouTube como origem para transcrição, seleção de candidatos e geração de clipes.",
      },
      {
        question: "O Kortes adiciona legendas aos Shorts?",
        answer:
          "Sim. Ele gera legendas sincronizadas palavra a palavra e oferece modelos de legenda configuráveis para os clipes.",
      },
      {
        question: "Todo clipe escolhido pela IA vai bem?",
        answer:
          "Não. A pontuação da IA ajuda a priorizar candidatos, mas o criador deve revisar contexto, precisão, enquadramento e adequação ao público antes de publicar.",
      },
    ],
  },
];

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}
