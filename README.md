# 🧠 Guia Interativo de IA (Iniciantes)

Bem-vindo ao **Guia Interativo de Aprendizagem sobre Inteligência Artificial**! Este projeto foi meticulosamente desenhado por Especialistas em Design Instrucional e Arquitetura de Aprendizagem para desvendar o universo da inteligência artificial para iniciantes absolutos.

O app combina conceitos didáticos profundos, analogias amigáveis (sem jargões técnicos), desafios práticos de 2 minutos integrados a uma **sandbox de testes do Gemini 3.5 Flash** e um **mini-jogo interativo de engenharia de prompts**.

---

## ✨ Características do Projeto

O projeto adota uma estética **"Artistic Flair"**, destacando-se por layouts rotacionados e visualmente arrojados, tipografia de alta performance (`Space Grotesk` para títulos, `JetBrains Mono` para dados técnicos e `Inter` para o texto principal) e um contraste impecável baseado em cores frias, elementos em preto puro e toques de ciano elétrico e verde esmeralda.

### 📚 Estrutura Curricular (3 Módulos Progressivos)
1. **O que é IA e como ela funciona:** Descubra o cérebro digital e como a IA aprende por meio de exemplos e análise de padrões, em vez de regras rígidas de programação.
2. **Como usar a IA no dia a dia:** Aumente sua produtividade diária aprendendo a dar instruções eficientes.
3. **O futuro da IA e Ética:** Entenda as alucinações (quando a IA inventa dados) e aprenda a checar fontes confiáveis antes de usar resultados em tarefas críticas.

### 🎮 Gamificação e Recursos Interativos
- **Desafios Práticos Rápidos:** Atividades de 2 minutos para cada etapa que podem ser copiadas e coladas diretamente no painel de testes com apenas um clique.
- **Painel de Quizzes Interativos:** Teste seus conhecimentos em cada módulo com feedback e justificativas pedagógicas detalhadas que aparecem de forma instantânea.
- **Chatbot de Testes Integrado (Playground):** Sandbox conversacional conectada ao **Gemini 3.5 Flash** onde você pode interagir com um Mentor de IA amigável configurado para instruir de forma produtiva, assertiva e encorajadora.
- **Painel de Progresso Geral:** Veja o seu nível de engajamento crescer em tempo real à medida que avança na leitura dos módulos e acerta as perguntas do quiz.

### 🏆 Mini-Jogo de Prompt Dourado (Exclusivo do Módulo 2)
No Módulo 2, você é desafiado no **Mini-Jogo de Prompts**. Sua missão é criar um comando de até 3 tentativas capaz de orientar a IA a planejar uma rotina de estudos. A IA do Gemini analisa seu comando de acordo com 3 critérios fundamentais:
1. **Papel/Persona:** Atribuir um papel à IA (ex: *"Atue como mentor de produtividade..."*).
2. **Tarefa Clara:** Explicar claramente o objetivo principal (ex: *"planejar minha rotina de estudos de IA..."*).
3. **Formato & Restrições:** Limitar a resposta a um formato (ex: *"em 3 passos simples com tom amigável"*).

O jogo retorna notas de **0 a 100**, avaliação detalhada de cada critério e uma simulação em tempo real sobre como um robô agiria com a instrução enviada!

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido em uma arquitetura robusta de ponta-a-ponta:
- **Frontend SPA:** React 19 + TypeScript rodando com o bundler ultrarrápido **Vite**.
- **Backend API:** Express Server proxyando requisições com segurança para a IA, evitando a exposição de chaves privadas no cliente.
- **Integração de IA:** SDK oficial `@google/genai` (Gemini 3.5 Flash).
- **Estilo:** Tailwind CSS com a nova engine v4.
- **Animações:** Framer Motion (`motion/react`) para transições suaves de abas e revelação de segredos e conquistas.
- **Iconografia:** Lucide-React.
- **CI/CD:** Github Actions integrado (`ci.yml`) que automatiza verificações de lint e garante builds perfeitamente estáveis.

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter instalado em sua máquina o **Node.js** (versão 18 ou superior) e o **npm**.

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/guia-interativo-ia.git
cd guia-interativo-ia
```

### 2. Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto (baseado em `.env.example`):
```env
# Seu token da API do Google AI Studio
GEMINI_API_KEY="SUA_CHAVE_AQUI"
APP_URL="http://localhost:3000"
```

### 3. Instalar as dependências
```bash
npm install
```

### 4. Rodar em ambiente de desenvolvimento (com servidor Express + Vite)
```bash
npm run dev
```
O servidor será inicializado no endereço: `http://localhost:3000`.

### 5. Compilar para Produção (Build)
Este projeto usa uma compilação automatizada com `esbuild` para o backend Express e `vite` para o frontend estático, gerando uma distribuição limpa e compactada em CommonJS (`.cjs`):
```bash
npm run build
```
Para inicializar o build de produção compilado:
```bash
npm run start
```

---

## 🔒 Segurança de Chaves
Por padrão, este projeto **nunca expõe chaves secretas para o navegador**. Todas as chamadas para as capacidades de Inteligência Artificial do Google Gemini passam por rotas proxy privadas no servidor Express (`/api/chat` e `/api/evaluate-prompt`), garantindo que sua chave esteja 100% segura.

---

## 🤖 Integração Contínua (GitHub Actions)
Este projeto possui um workflow configurado para GitHub Actions (`/.github/workflows/ci.yml`).
Sempre que houver um `push` ou `pull_request` na branch `main`, a esteira do GitHub Actions irá:
1. Clonar o código.
2. Instalar o Node.js v22.
3. Executar o validador TypeScript (`npm run lint`).
4. Executar o build estático e de backend (`npm run build`).

Isso garante que seu código nunca quebre ao ser integrado ou implantado na nuvem!
