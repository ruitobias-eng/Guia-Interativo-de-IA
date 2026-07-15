import { ModuleData } from "./types";

export const MODULES: ModuleData[] = [
  {
    id: 1,
    title: "Módulo 1: O que é IA?",
    objective: "Descobrir como a IA aprende sem jargões.",
    analogy: [
      "Pense na IA como uma criança.",
      "Ela aprende observando exemplos do mundo.",
      "Ela reconhece padrões ocultos em dados.",
      "Ela toma decisões inteligentes de forma autônoma."
    ],
    practicalChallenge: {
      instructions: [
        "Pense em um animal engraçado.",
        "Descreva-o com três palavras básicas.",
        "Copie o comando especial abaixo.",
        "Cole no Chat de Testes.",
        "Veja a IA reagindo instantaneamente."
      ],
      suggestedPrompt: "Adivinhe que animal eu sou: tenho bigodes, miaus e amo caixas. Responda em apenas uma palavra emocionante!"
    },
    quiz: {
      question: "Como a inteligência artificial aprende a identificar fotos de gatos?",
      options: {
        A: "Decorando linhas de código feitas por programadores.",
        B: "Analizando milhares de fotos de gatos reais.",
        C: "Usando câmeras especiais que enxergam pensamentos felinos."
      },
      correctAnswer: "B",
      explanation: "A IA descobre padrões visuais analisando muitos exemplos, não por regras fixas predefinidas."
    },
    achievementName: "Iniciado em IA 🧠"
  },
  {
    id: 2,
    title: "Módulo 2: IA no dia a dia",
    objective: "Criar comandos eficientes para aumentar sua produtividade.",
    analogy: [
      "Prompts são como receitas culinárias.",
      "Instruções claras geram excelentes resultados.",
      "Diga quem a IA deve fingir ser.",
      "Explique a sua tarefa com clareza.",
      "Defina o formato ideal para a resposta."
    ],
    practicalChallenge: {
      instructions: [
        "Melhore a sua rotina diária hoje.",
        "Copie o comando estruturado abaixo.",
        "Cole no Chat de Testes.",
        "Adapte com as suas tarefas reais.",
        "Organize seu dia em segundos."
      ],
      suggestedPrompt: "Atue como mentor de produtividade. Organize um cronograma de 3 passos simples para o meu dia focado em estudar IA. Responda em tópicos curtos."
    },
    quiz: {
      question: "Qual é o segredo de um prompt verdadeiramente excelente?",
      options: {
        A: "Usar palavras difíceis, técnicas e complexas.",
        B: "Dar contexto claro e definir o formato desejado.",
        C: "Ser o mais curto e vago possível."
      },
      correctAnswer: "B",
      explanation: "O contexto claro ajuda a IA a entender seu objetivo exato, gerando resultados muito melhores."
    },
    achievementName: "Mestre dos Prompts ⚡"
  },
  {
    id: 3,
    title: "Módulo 3: Futuro e Ética",
    objective: "Compreender o impacto profissional e ético da IA.",
    analogy: [
      "A IA não substituirá o talento humano.",
      "Profissionais que dominam IA se destacarão.",
      "IAs podem inventar dados por engano.",
      "Chame essas falhas curiosas de alucinações.",
      "Sempre verifique informações críticas com atenção."
    ],
    practicalChallenge: {
      instructions: [
        "Aprenda a identificar mentiras da IA.",
        "Copie o comando de checagem abaixo.",
        "Cole o texto no Chat.",
        "Descubra se a IA cita fontes.",
        "Avalie as referências fornecidas."
      ],
      suggestedPrompt: "Explique o que é a Teoria da Relatividade para uma criança de 8 anos, mas cite 1 fonte confiável para eu verificar."
    },
    quiz: {
      question: "O que significa dizer que uma IA 'alucinou'?",
      options: {
        A: "Ela desligou por cansaço extremo.",
        B: "Ela inventou uma informação falsa com confiança.",
        C: "Ela começou a enviar emojis estranhos."
      },
      correctAnswer: "B",
      explanation: "Alucinar é gerar fatos incorretos como se fossem verdades científicas. Sempre revise!"
    },
    achievementName: "Pensador Ético 🛡️"
  }
];
