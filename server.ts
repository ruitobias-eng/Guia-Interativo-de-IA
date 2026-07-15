import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with custom User-Agent for telemetry
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API endpoint for chatbot prompt test
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, systemInstruction } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Mensagem é obrigatória." });
    }

    const ai = getGeminiClient();
    
    // Prepare the configuration with system instruction
    const config: any = {
      systemInstruction: systemInstruction || "Você é um mentor de IA amigável que ajuda iniciantes a aprender. Responda em português, de forma concisa, direta, amigável e empolgante. Diga se o prompt foi bom e dê dicas práticas."
    };

    // If we have history, we can reconstruct the chat or send full content.
    // For simplicity and compatibility, we can do a single generateContent call or chat.
    // We'll use chats.create to support a interactive flow if history is provided, or a direct generateContent if not.
    if (history && Array.isArray(history) && history.length > 0) {
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config,
      });
      
      // Load history into the chat state (excluding the current message)
      // Since ai.chats.create takes history directly in some forms or we can do it via contents:
      // Let's use the standard generateContent with a conversational contents list for ultimate reliability and simplicity:
      const contents = [
        ...history.map((h: any) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }],
        })),
        {
          role: "user",
          parts: [{ text: message }],
        }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config,
      });

      return res.json({ text: response.text });
    } else {
      // Single question
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config,
      });

      return res.json({ text: response.text });
    }
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    return res.status(500).json({ 
      error: "Houve um erro ao processar sua requisição na IA.", 
      details: error.message 
    });
  }
});

// API endpoint to evaluate user's prompt (Module 2 mini-game)
app.post("/api/evaluate-prompt", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "O prompt é obrigatório." });
  }

  const promptLower = prompt.toLowerCase();

  // 1. Offline Fallback Logic (Durable & Reliable)
  const runOfflineEvaluation = () => {
    const hasPersona = /atue\s+como|seja|mentor|guia|especialista|professor|expert|persona|voc[eê]\s+é/i.test(promptLower);
    const hasTask = /rotina|estudo|estudar|cronograma|planejar|planeje|ia|artificial|aprendizado/i.test(promptLower);
    const hasFormat = /3\s+passos|tr[eê]s\s+passos|t[oó]picos|amig[aá]vel|curto|simples|instagram|post/i.test(promptLower);

    let score = 15; // Base score
    if (hasPersona) score += 30;
    if (hasTask) score += 40;
    if (hasFormat) score += 15; // adjust formatting weight

    // Let's cap at 100
    if (score > 100) score = 100;

    let feedback = "";
    if (score >= 80) {
      feedback = "Parabéns! Você criou um prompt espetacular. Ele define perfeitamente o papel, a tarefa e as restrições de formato. Veja como a IA responde de forma precisa e amigável!";
    } else {
      const missing = [];
      if (!hasPersona) missing.push("um Papel/Persona (ex: 'Atue como um mentor de produtividade')");
      if (!hasTask) missing.push("a Tarefa com clareza (ex: 'planejar uma rotina de estudos de IA')");
      if (!hasFormat) missing.push("as Restrições de formato (ex: 'em 3 passos simples com tom amigável')");
      
      feedback = `Bom começo! Seu prompt obteve ${score} pontos. Para deixá-lo perfeito, tente adicionar: ${missing.join(", ")}. Vamos tentar de novo?`;
    }

    const personaFeedback = hasPersona 
      ? "Excelente! Você definiu um papel claro para a IA agir." 
      : "Falta definir um papel. Dizer à IA quem ela deve ser (ex: 'Atue como especialista') melhora muito os resultados.";

    const taskFeedback = hasTask 
      ? "Muito bem! A tarefa de estudos de IA está clara no seu comando." 
      : "A tarefa principal de planejar a rotina de estudos de IA não ficou totalmente clara.";

    const formatFeedback = hasFormat 
      ? "Ótimo! Você especificou restrições de formato como 3 passos." 
      : "Especifique o formato final (ex: 'escreva em 3 passos simples') para guiar a IA.";

    // Generate a fun simulated response that reflects how a chatbot would respond to their exact prompt structure!
    let simulatedResponse = "";
    if (hasPersona && hasTask && hasFormat) {
      simulatedResponse = "Mentor de IA: Olá, estudante! Adoro ajudar com isso. Aqui estão seus 3 passos simples:\n1. Dedique 15 minutos para ler um conceito básico diário.\n2. Faça um desafio prático de prompt no chat.\n3. Complete o quiz para testar seu conhecimento. Bons estudos! 🚀";
    } else if (hasTask && hasFormat) {
      simulatedResponse = "IAs em Geral: Aqui está sua rotina de estudos em 3 passos:\n1. Estude conceitos de redes neurais.\n2. Pratique programação em Python.\n3. Resolva exercícios de machine learning.";
    } else if (hasPersona && hasTask) {
      simulatedResponse = "Mentor de IA: Olá, querido aluno! Fico feliz em ajudar você a estudar Inteligência Artificial. Há muitos caminhos que você pode seguir, dependendo se você quer focar em machine learning, deep learning ou engenharia de prompt. Recomendo começar pelas bases e ler artigos científicos...";
    } else if (hasTask) {
      simulatedResponse = "Robô Padrão: A Inteligência Artificial (IA) é um campo amplo. Para estudar IA, você precisa entender matemática, álgebra linear, cálculo, estatística e dominar programação. Monte uma agenda de estudos cobrindo esses tópicos.";
    } else {
      simulatedResponse = "Robô Padrão: Desculpe, não entendi muito bem o que você deseja que eu faça. Pode fornecer mais detalhes ou comandos claros?";
    }

    return {
      score,
      feedback,
      criteria: {
        persona: hasPersona,
        personaFeedback,
        task: hasTask,
        taskFeedback,
        format: hasFormat,
        formatFeedback
      },
      simulatedResponse
    };
  };

  try {
    const ai = getGeminiClient();
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Avalie o seguinte prompt de chatbot criado pelo usuário para a tarefa 'Ajudar um estudante a planejar sua rotina de estudos de IA, dividindo-a em 3 passos simples com um tom amigável'.

Prompt do usuário: "${prompt}"

Retorne um objeto JSON que avalia o prompt de acordo com as seguintes regras:
1. "score": nota de 0 a 100 baseada em 3 critérios:
   - Atribuiu um papel/persona à IA (ex: "Atue como mentor")? (Vale 30 pontos)
   - Explicou a tarefa clara de planejar a rotina de estudos de IA? (Vale 40 pontos)
   - Limitou a 3 passos simples ou especificou o tom amigável? (Vale 30 pontos)
2. "feedback": mensagem instrutiva, super amigável e construtiva em português de até 3 frases. Diga o que ficou ótimo e o que pode ser melhorado se a nota for menor que 80.
3. "criteria": status de cada critério:
   - "persona": true/false
   - "personaFeedback": feedback de uma linha sobre o papel/persona
   - "task": true/false
   - "taskFeedback": feedback de uma linha sobre a tarefa
   - "format": true/false
   - "formatFeedback": feedback de uma linha sobre o formato/restrições
4. "simulatedResponse": simule de forma extremamente realista, curta e divertida (máximo 4 linhas) como um chatbot real responderia ao prompt exato do usuário, ilustrando se ele obedeceu ao tom amigável e aos 3 passos, de acordo com o que o usuário escreveu no prompt.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            criteria: {
              type: Type.OBJECT,
              properties: {
                persona: { type: Type.BOOLEAN },
                personaFeedback: { type: Type.STRING },
                task: { type: Type.BOOLEAN },
                taskFeedback: { type: Type.STRING },
                format: { type: Type.BOOLEAN },
                formatFeedback: { type: Type.STRING }
              },
              required: ["persona", "personaFeedback", "task", "taskFeedback", "format", "formatFeedback"]
            },
            simulatedResponse: { type: Type.STRING }
          },
          required: ["score", "feedback", "criteria", "simulatedResponse"]
        }
      }
    });

    if (response && response.text) {
      try {
        const result = JSON.parse(response.text.trim());
        return res.json({ ...result, isRealGemini: true });
      } catch (parseError) {
        console.error("Erro ao fazer o parse do JSON retornado pelo Gemini, usando offline:", parseError);
        return res.json({ ...runOfflineEvaluation(), isRealGemini: false });
      }
    } else {
      return res.json({ ...runOfflineEvaluation(), isRealGemini: false });
    }
  } catch (error: any) {
    console.warn("Gemini API falhou no jogo, usando avaliação offline segura:", error.message);
    return res.json({ ...runOfflineEvaluation(), isRealGemini: false });
  }
});

// Setup Vite or static files serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Vite setup failed:", err);
});
