import Link from "next/link";

import { ArticleShell, CodeBlock, type ArticleFaq } from "@/components/articles/article-shell";
import type { BlogPost } from "@/lib/blog-posts";
import { OPUSCLIP_COMPARISON_HREF } from "@/lib/marketing-links";
import { GITHUB_URL } from "@/lib/site";

const docs = (path: string) => `${GITHUB_URL}/blob/main/${path}`;

const faqs: ArticleFaq[] = [
  {
    question: "O Kortes auto-hospedado é gratuito?",
    answer:
      "O código é gratuito sob a AGPL-3.0, e o modo auto-hospedado não tem limite de gerações nem cobrança. Você ainda paga o seu hardware ou servidor e qualquer uso de transcrição ou LLM na nuvem que configurar. Uma configuração com Whisper + Ollama evita taxas de IA por requisição, mas precisa de capacidade de processamento local suficiente.",
  },
  {
    question: "O Kortes funciona sem nenhum serviço de IA na nuvem?",
    answer:
      "Sim, para a análise dos clipes. Defina TRANSCRIPTION_PROVIDER=whisper para transcrever localmente e LLM=ollama:<modelo> para escolher os clipes com um modelo local. Baixar links do YouTube ainda exige internet; arquivos enviados, não. O B-roll opcional usa a API do Pexels.",
  },
  {
    question: "Preciso de GPU?",
    answer:
      "Não. O modelo .env.example define BACKEND_CPU_ONLY=true, que instala o PyTorch só para CPU. A transcrição com Whisper em CPU é mais lenta que uma API na nuvem, então vídeos longos demoram mais em hardware modesto.",
  },
  {
    question: "Funciona em Apple Silicon?",
    answer:
      "Sim, com uma ressalva: as imagens do backend e do worker rodam como linux/amd64 em emulação. BACKEND_CPU_ONLY=true evita os downloads da NVIDIA, mas não ativa a aceleração da GPU da Apple.",
  },
  {
    question: "Como deixo a minha instância privada?",
    answer:
      "Crie a sua conta, depois defina DISABLE_SIGN_UP=true e recrie o container do frontend. O Compose liga todas as portas a 127.0.0.1, então nada fica público até você adicionar um proxy reverso.",
  },
];

const toc: Array<[string, string]> = [
  ["stack", "O que você roda"],
  ["requirements", "Requisitos"],
  ["install", "Instalação"],
  ["local", "IA 100% local"],
  ["verify", "Verificação"],
  ["production", "Checklist de produção"],
  ["upgrade", "Atualizações e backups"],
  ["faq", "Perguntas frequentes"],
];

export function SelfHostingGuideArticle({ post }: { post: BlogPost }) {
  return (
    <ArticleShell post={post} breadcrumb="Hospedar o Kortes" toc={toc} faqs={faqs}>
      <p>
        O Kortes é um cortador de vídeo com IA de código aberto. O repositório traz uma configuração de Docker Compose
        que você pode rodar num notebook, num servidor em casa ou numa VPS. Este guia segue essa configuração
        exatamente como ela está no <a href={GITHUB_URL}>repositório</a>. Quando um passo depende do seu provedor ou
        hardware, dizemos isso em vez de adivinhar.
      </p>
      <p>
        Prefere não cuidar de infraestrutura? O <Link href="/sign-up">app hospedado</Link> roda o mesmo processo. Ainda
        escolhendo entre ferramentas? Leia antes a nossa <Link href={OPUSCLIP_COMPARISON_HREF}>comparação entre Kortes e OpusClip</Link>.
      </p>

      <h2 id="stack">O que você está rodando</h2>
      <p>
        <code>docker compose up</code> inicia estes containers, todos definidos no <a href={docs("docker-compose.yml")}>docker-compose.yml</a>:
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[520px] text-left text-sm leading-6">
          <caption className="sr-only">Serviços do Docker Compose do Kortes</caption>
          <thead className="bg-muted"><tr><th scope="col" className="p-3">Serviço</th><th scope="col" className="p-3">Função</th><th scope="col" className="p-3">Porta no host</th></tr></thead>
          <tbody>
            {[
              ["frontend", "App web em Next.js, autenticação e proxy da API", "FRONTEND_PORT (3107 no .env.example; 3001 se não definida)"],
              ["backend", "API em FastAPI; documentação em /docs", "8000"],
              ["worker", "Worker ARQ: baixa, transcreve, analisa e renderiza", "nenhuma"],
              ["postgres", "PostgreSQL 15: usuários, tarefas e clipes", "nenhuma"],
              ["redis", "Redis 7: fila de trabalhos e progresso ao vivo", "6379"],
              ["mcp", "Servidor MCP para clientes de IA (opcional)", "9100"],
            ].map(([service, role, port]) => (
              <tr key={service} className="border-t"><th scope="row" className="p-3 align-top font-mono text-xs">{service}</th><td className="p-3 align-top text-muted-foreground">{role}</td><td className="p-3 align-top text-muted-foreground">{port}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Todas as portas publicadas ficam ligadas a <code>127.0.0.1</code>, então uma instalação nova só é acessível pela
        própria máquina. Clipes gerados, envios, Postgres e Redis ficam em volumes nomeados do Docker e sobrevivem a reinícios dos containers.
        Se você não usa o MCP, pare esse container com <code>docker compose stop mcp</code>.
      </p>

      <h2 id="requirements">Requisitos</h2>
      <ul>
        <li><strong>Docker</strong> com Compose v2 (<code>docker compose</code>) ou o <code>docker-compose</code> avulso, além do Git.</li>
        <li>
          <strong>Uma fonte de transcrição</strong>, definida em <code>TRANSCRIPTION_PROVIDER</code>:
          <code>assemblyai</code> (padrão, precisa de <code>ASSEMBLY_AI_API_KEY</code>), <code>whisper</code> (local, sem chave)
          ou <code>youtube_captions</code> (só para links do YouTube).
        </li>
        <li>
          <strong>Um LLM para escolher os clipes</strong>, definido em <code>LLM=provedor:modelo</code>: OpenAI, Google, Anthropic,
          OpenRouter (cada um precisa da sua chave de API) ou um modelo local <code>ollama:</code>.
        </li>
        <li><strong>Opcional:</strong> <code>PEXELS_API_KEY</code> para sobreposições de B-roll.</li>
      </ul>
      <p>
        O primeiro build das imagens baixa as dependências de Python e Node. O <a href={docs("QUICKSTART.md")}>guia rápido</a> estima
        de 5 a 10 minutos; varia com a sua conexão e CPU.
      </p>

      <h2 id="install">Instalação com Docker Compose</h2>
      <h3>1. Clone o repositório e crie o arquivo de ambiente</h3>
      <CodeBlock label="terminal">{`
git clone ${GITHUB_URL}.git
cd supoclip
cp .env.example .env
`}</CodeBlock>
      <h3>2. Escolha os provedores no <code>.env</code></h3>
      <p>
        O modelo usa <code>LLM=openrouter:anthropic/claude-sonnet-5.5</code> por padrão. O processamento falha a menos que você defina{" "}
        <code>OPENROUTER_API_KEY</code> ou aponte <code>LLM</code> para um provedor do qual tenha a chave. Uma configuração mínima na nuvem fica assim:
      </p>
      <CodeBlock label=".env">{`
TRANSCRIPTION_PROVIDER=assemblyai
ASSEMBLY_AI_API_KEY=sua_chave_assemblyai

LLM=google-gla:gemini-3-flash-preview
GOOGLE_API_KEY=sua_chave_google

# Troque todos os segredos de exemplo, mesmo para uso local
BETTER_AUTH_SECRET=gere_com_openssl_rand_base64_32
BACKEND_AUTH_SECRET=gere_outro
APP_SETTINGS_ENCRYPTION_KEY=e_mais_outro
`}</CodeBlock>
      <p>
        Gere cada segredo com <code>openssl rand -base64 32</code>. <code>SELF_HOST=true</code> (o padrão) desliga a cobrança e
        remove os limites de geração por conta.
      </p>
      <h3>3. Construa e inicie</h3>
      <CodeBlock label="terminal">{`
docker compose up -d --build
# ou: ./start.sh  (confere o .env e o Docker antes e depois faz o mesmo)
`}</CodeBlock>
      <p>
        Abra <code>http://localhost:3107</code>, crie uma conta e cole um link do YouTube ou envie um arquivo.
        A documentação da API fica em <code>http://localhost:8000/docs</code>.
      </p>

      <h2 id="local">Opção: transcrição e seleção de clipes 100% locais</h2>
      <p>
        Para manter as transcrições e a análise no seu próprio hardware, combine o Whisper local com um modelo do Ollama:
      </p>
      <CodeBlock label=".env">{`
TRANSCRIPTION_PROVIDER=whisper
WHISPER_MODEL_SIZE=medium        # tiny | base | small | medium | large | large-v3

LLM=ollama:gpt-oss:20b
# Vazio = http://host.docker.internal:11434/v1 dentro dos containers.
# Se você definir, mantenha o sufixo /v1.
OLLAMA_BASE_URL=
`}</CodeBlock>
      <p>
        O worker faz as chamadas ao Ollama de dentro do seu container, então o Ollama precisa ser acessível de lá, não só
        do seu terminal. Como chegar lá depende de onde o Ollama roda:
      </p>
      <h3>Ollama no host, com Docker Desktop (macOS, Windows)</h3>
      <p>
        Nenhuma configuração extra. O Docker Desktop encaminha <code>host.docker.internal</code> para o host, então deixe{" "}
        <code>OLLAMA_BASE_URL</code> vazio e baixe o modelo com <code>ollama pull gpt-oss:20b</code>.
      </p>
      <h3>Ollama no host, com Docker Engine (Linux)</h3>
      <p>
        O Compose aponta <code>host.docker.internal</code> para o gateway da bridge do Docker, mas por padrão o Ollama só escuta em{" "}
        <code>127.0.0.1</code>, então a conexão do worker é recusada. Faça o Ollama escutar em todas as interfaces:
      </p>
      <CodeBlock label="terminal">{`
sudo systemctl edit ollama
#   [Service]
#   Environment="OLLAMA_HOST=0.0.0.0:11434"
sudo systemctl restart ollama
ollama pull gpt-oss:20b
`}</CodeBlock>
      <p>
        Isso também expõe a porta 11434 nas suas interfaces de rede. O Ollama não tem autenticação, então bloqueie essa porta
        para fora da máquina no firewall. Se o seu firewall filtra o tráfego das redes do Docker, libere também o acesso
        dos containers.
      </p>
      <h3>Ollama no próprio container</h3>
      <p>
        Adicione-o à configuração com um arquivo de override e aponte o Kortes para o nome do serviço em vez do host:
      </p>
      <CodeBlock label="docker-compose.override.yml (junte com qualquer override que você já tenha)">{`
services:
  ollama:
    image: ollama/ollama
    volumes:
      - ollama_models:/root/.ollama
    restart: unless-stopped

volumes:
  ollama_models:
`}</CodeBlock>
      <CodeBlock label=".env e terminal">{`
OLLAMA_BASE_URL=http://ollama:11434/v1

docker compose up -d ollama
docker compose exec ollama ollama pull gpt-oss:20b
docker compose up -d backend worker   # aplica o novo valor do .env
`}</CodeBlock>
      <p>
        Seja qual for a configuração, teste de dentro do worker antes de enviar um vídeo. A verificação procura{" "}
        <code>gpt-oss:20b</code> porque esse é o modelo do exemplo de <code>LLM</code>. Se você escolheu outro modelo,
        troque pelo nome exato que vem depois de <code>ollama:</code> na sua configuração de <code>LLM</code>. O Ollama lista um modelo
        baixado sem tag como <code>nome:latest</code>, então use esse formato na verificação.
      </p>
      <CodeBlock label="terminal">{`
# Ollama no host:
docker compose exec worker curl -s http://host.docker.internal:11434/api/tags | grep -q '"gpt-oss:20b"' && echo "model ready"
# Ollama em container:
docker compose exec worker curl -s http://ollama:11434/api/tags | grep -q '"gpt-oss:20b"' && echo "model ready"
`}</CodeBlock>
      <p>
        <code>model ready</code> significa que o worker alcança o Ollama e que o modelo procurado está instalado. Nenhuma
        saída significa que a conexão falhou ou que o modelo não existe; rode o comando de novo sem o{" "}
        <code>grep</code> para ver qual dos dois. Modelos menores do Whisper trocam precisão por velocidade,
        e a qualidade dos clipes depende do LLM. Compare um modelo local com um hospedado numa gravação que você conhece antes
        de mudar todo o seu acervo.
      </p>

      <h2 id="verify">Verifique a instalação</h2>
      <CodeBlock label="terminal">{`
docker compose ps                       # todos os serviços devem estar "healthy"
curl -f http://localhost:8000/health/db # o backend alcança o Postgres
docker compose logs -f worker           # acompanhe um trabalho passando pelo processo
`}</CodeBlock>
      <ol>
        <li>Crie uma conta e envie primeiro um vídeo curto, para que um erro de configuração apareça rápido.</li>
        <li>Confira se a página da tarefa mostra o progresso. Se ficar na fila, veja os logs do worker.</li>
        <li>Reproduza e baixe um clipe finalizado.</li>
      </ol>
      <p>
        Tarefas travadas costumam ser uma chave de provedor faltando ou um worker que não alcança o Redis. O{" "}
        <a href={docs("docs/troubleshooting.md")}>guia de solução de problemas</a> cobre os casos mais comuns.
      </p>

      <h2 id="production">Checklist de produção</h2>
      <p>O arquivo do Compose vem ajustado para começar. Antes de colocá-lo num domínio público:</p>
      <ul>
        <li>
          <strong>Construa o frontend de produção.</strong> O Compose usa por padrão o alvo <code>development</code>, com recarregamento automático,
          e monta <code>frontend/src</code> dentro do container. Defina <code>FRONTEND_BUILD_TARGET=runner</code> e{" "}
          <code>NODE_ENV=production</code> no <code>.env</code> e remova as montagens do código com o override abaixo.
        </li>
        <li>
          <strong>Termine o HTTPS num proxy reverso</strong> (Caddy, nginx, Traefik) na frente da porta do frontend.
        </li>
        <li>
          <strong>Exponha o backend para os envios.</strong> Com <code>BACKEND_AUTH_SECRET</code> definido, os navegadores enviam os vídeos
          direto para <code>NEXT_PUBLIC_API_URL</code>. Aponte essa variável para uma URL pública HTTPS do backend e adicione a origem do frontend em{" "}
          <code>CORS_ORIGINS</code>.
        </li>
        <li>
          <strong>Defina a sua origem pública em todo lugar:</strong> <code>NEXT_PUBLIC_APP_URL</code>, <code>BETTER_AUTH_URL</code> e{" "}
          <code>CORS_ORIGINS</code>. Os valores <code>NEXT_PUBLIC_*</code> entram no build, então reconstrua o frontend depois de mudá-los.
        </li>
        <li>
          <strong>Troque a senha do banco.</strong> O <code>docker-compose.yml</code> fixa <code>supoclip_password</code> em
          quatro lugares: <code>POSTGRES_PASSWORD</code> no serviço <code>postgres</code> e <code>DATABASE_URL</code> nos serviços{" "}
          <code>frontend</code>, <code>backend</code> e <code>worker</code>. Mudar só o <code>POSTGRES_PASSWORD</code> no{" "}
          <code>.env</code> não altera nenhum deles. Sobrescreva os quatro, como mostrado abaixo.
        </li>
        <li><strong>Defina <code>REDIS_PASSWORD</code></strong>; o container do Redis ativa a autenticação quando ela não está vazia.</li>
        <li><strong>Feche os cadastros</strong> com <code>DISABLE_SIGN_UP=true</code> se a instância for só para a sua equipe.</li>
        <li>
          <strong>Revise os limites:</strong> <code>MAX_VIDEO_DURATION</code> (padrão de 5400 s, 90 minutos) e{" "}
          <code>MAX_VIDEO_UPLOAD_BYTES</code> (cerca de 12 GB).
        </li>
      </ul>
      <CodeBlock label="docker-compose.override.yml (Compose v2.24+)">{`
services:
  frontend:
    volumes: !reset []   # a imagem runner já contém o build
`}</CodeBlock>
      <p>
        Para a senha do banco, coloque um novo valor em <code>POSTGRES_PASSWORD</code> no <code>.env</code>. Gere-o com{" "}
        <code>openssl rand -hex 24</code>, porque o formato hexadecimal não precisa de escape numa URL. Depois aponte as quatro configurações para ele no
        mesmo arquivo de override:
      </p>
      <CodeBlock label="docker-compose.override.yml (junte com qualquer override que você já tenha)">{`
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
  frontend:
    environment:
      DATABASE_URL: postgresql://supoclip:\${POSTGRES_PASSWORD}@postgres:5432/supoclip
  backend:
    environment:
      DATABASE_URL: postgresql+asyncpg://supoclip:\${POSTGRES_PASSWORD}@postgres:5432/supoclip
  worker:
    environment:
      DATABASE_URL: postgresql+asyncpg://supoclip:\${POSTGRES_PASSWORD}@postgres:5432/supoclip
`}</CodeBlock>
      <p>
        O Postgres só lê <code>POSTGRES_PASSWORD</code> quando inicializa um volume de dados vazio. Numa instalação que já
        tem banco, mudar essa variável não muda a senha de verdade. Troque-a primeiro dentro do Postgres, usando
        o mesmo valor do <code>.env</code>. Depois recrie os serviços para que usem as novas URLs:
      </p>
      <CodeBlock label="terminal (banco existente)">{`
docker compose exec -T postgres psql -U supoclip -d supoclip \\
  -c "ALTER USER supoclip PASSWORD 'sua_nova_senha'"
docker compose up -d
`}</CodeBlock>
      <p>
        O <a href={docs("docs/configuration.md")}>docs/configuration.md</a> lista todas as variáveis, e o{" "}
        <a href={docs("docs/setup.md")}>docs/setup.md</a> explica portas personalizadas e URLs públicas.
      </p>

      <h2 id="upgrade">Atualizações e backups</h2>
      <p>
        O <code>init.sql</code> cria o esquema só quando o volume do Postgres é inicializado pela primeira vez. Depois disso, nada
        atualiza o esquema automaticamente. Se uma nova versão adicionar arquivos em <code>frontend/prisma/migrations</code> ou{" "}
        <code>backend/migrations</code>, aplique-os você mesmo antes de reiniciar o app. Código novo rodando com o esquema
        antigo falha por colunas e tabelas inexistentes. Faça backup antes e pare os serviços do app para que não carreguem o código
        novo antes da hora. O frontend de desenvolvimento recarrega o código montado automaticamente.
      </p>
      <CodeBlock label="terminal">{`
docker compose exec -T postgres pg_dump -U supoclip supoclip > supoclip-$(date +%F).sql
docker compose stop frontend backend worker
old=$(git rev-parse HEAD)
git pull
git diff --name-only --diff-filter=A "$old" HEAD -- \\
  'backend/migrations/*.sql' 'frontend/prisma/migrations/*/migration.sql'
`}</CodeBlock>
      <p>
        Leia cada arquivo listado e aplique-o numa única transação. Aplique as migrações do Prisma em ordem de data e as do
        backend em ordem numérica:
      </p>
      <CodeBlock label="terminal">{`
docker compose exec -T postgres psql -U supoclip -d supoclip -v ON_ERROR_STOP=1 -1 \\
  < frontend/prisma/migrations/<nova_migracao>/migration.sql
docker compose up -d --build
`}</CodeBlock>
      <p>
        Um banco criado pelo <code>init.sql</code> não tem histórico de migrações do Prisma. Não rode{" "}
        <code>prisma migrate deploy</code> nele: o Prisma tentaria reaplicar todas as migrações desde a primeira e falharia em
        tabelas que já existem. Se quiser que o Prisma gerencie as migrações daqui em diante, primeiro marque a base com{" "}
        <code>prisma migrate resolve --applied &lt;migração&gt;</code>, mas só para migrações cujas mudanças já estão no
        seu esquema. O Prisma ignora para sempre qualquer migração marcada como aplicada, mesmo que as mudanças estejam faltando.
      </p>
      <p>
        Faça backup também dos volumes <code>clips</code> e <code>uploads</code> se precisar guardar os vídeos renderizados. Nunca rode{" "}
        <code>docker compose down -v</code> numa instância importante: isso apaga todos os volumes, inclusive o banco.
      </p>
      <p>
        Quer personalizar o resultado? Coloque fontes <code>.ttf</code> em <code>backend/fonts/</code> e transições <code>.mp4</code>{" "}
        em <code>backend/transitions/</code>. Elas aparecem no app automaticamente. Para automação, crie uma
        chave de API em Configurações e use a <a href={docs("docs/api-reference.md")}>API REST</a> ou o servidor MCP incluído.
      </p>
    </ArticleShell>
  );
}
