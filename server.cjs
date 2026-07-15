var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
};
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, systemInstruction } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Mensagem \xE9 obrigat\xF3ria." });
    }
    const ai = getGeminiClient();
    const config = {
      systemInstruction: systemInstruction || "Voc\xEA \xE9 um mentor de IA amig\xE1vel que ajuda iniciantes a aprender. Responda em portugu\xEAs, de forma concisa, direta, amig\xE1vel e empolgante. Diga se o prompt foi bom e d\xEA dicas pr\xE1ticas."
    };
    if (history && Array.isArray(history) && history.length > 0) {
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config
      });
      const contents = [
        ...history.map((h) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }]
        })),
        {
          role: "user",
          parts: [{ text: message }]
        }
      ];
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config
      });
      return res.json({ text: response.text });
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config
      });
      return res.json({ text: response.text });
    }
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return res.status(500).json({
      error: "Houve um erro ao processar sua requisi\xE7\xE3o na IA.",
      details: error.message
    });
  }
});
app.post("/api/evaluate-prompt", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "O prompt \xE9 obrigat\xF3rio." });
  }
  const promptLower = prompt.toLowerCase();
  const runOfflineEvaluation = () => {
    const hasPersona = /atue\s+como|seja|mentor|guia|especialista|professor|expert|persona|voc[eê]\s+é/i.test(promptLower);
    const hasTask = /rotina|estudo|estudar|cronograma|planejar|planeje|ia|artificial|aprendizado/i.test(promptLower);
    const hasFormat = /3\s+passos|tr[eê]s\s+passos|t[oó]picos|amig[aá]vel|curto|simples|instagram|post/i.test(promptLower);
    let score = 15;
    if (hasPersona) score += 30;
    if (hasTask) score += 40;
    if (hasFormat) score += 15;
    if (score > 100) score = 100;
    let feedback = "";
    if (score >= 80) {
      feedback = "Parab\xE9ns! Voc\xEA criou um prompt espetacular. Ele define perfeitamente o papel, a tarefa e as restri\xE7\xF5es de formato. Veja como a IA responde de forma precisa e amig\xE1vel!";
    } else {
      const missing = [];
      if (!hasPersona) missing.push("um Papel/Persona (ex: 'Atue como um mentor de produtividade')");
      if (!hasTask) missing.push("a Tarefa com clareza (ex: 'planejar uma rotina de estudos de IA')");
      if (!hasFormat) missing.push("as Restri\xE7\xF5es de formato (ex: 'em 3 passos simples com tom amig\xE1vel')");
      feedback = `Bom come\xE7o! Seu prompt obteve ${score} pontos. Para deix\xE1-lo perfeito, tente adicionar: ${missing.join(", ")}. Vamos tentar de novo?`;
    }
    const personaFeedback = hasPersona ? "Excelente! Voc\xEA definiu um papel claro para a IA agir." : "Falta definir um papel. Dizer \xE0 IA quem ela deve ser (ex: 'Atue como especialista') melhora muito os resultados.";
    const taskFeedback = hasTask ? "Muito bem! A tarefa de estudos de IA est\xE1 clara no seu comando." : "A tarefa principal de planejar a rotina de estudos de IA n\xE3o ficou totalmente clara.";
    const formatFeedback = hasFormat ? "\xD3timo! Voc\xEA especificou restri\xE7\xF5es de formato como 3 passos." : "Especifique o formato final (ex: 'escreva em 3 passos simples') para guiar a IA.";
    let simulatedResponse = "";
    if (hasPersona && hasTask && hasFormat) {
      simulatedResponse = "Mentor de IA: Ol\xE1, estudante! Adoro ajudar com isso. Aqui est\xE3o seus 3 passos simples:\n1. Dedique 15 minutos para ler um conceito b\xE1sico di\xE1rio.\n2. Fa\xE7a um desafio pr\xE1tico de prompt no chat.\n3. Complete o quiz para testar seu conhecimento. Bons estudos! \u{1F680}";
    } else if (hasTask && hasFormat) {
      simulatedResponse = "IAs em Geral: Aqui est\xE1 sua rotina de estudos em 3 passos:\n1. Estude conceitos de redes neurais.\n2. Pratique programa\xE7\xE3o em Python.\n3. Resolva exerc\xEDcios de machine learning.";
    } else if (hasPersona && hasTask) {
      simulatedResponse = "Mentor de IA: Ol\xE1, querido aluno! Fico feliz em ajudar voc\xEA a estudar Intelig\xEAncia Artificial. H\xE1 muitos caminhos que voc\xEA pode seguir, dependendo se voc\xEA quer focar em machine learning, deep learning ou engenharia de prompt. Recomendo come\xE7ar pelas bases e ler artigos cient\xEDficos...";
    } else if (hasTask) {
      simulatedResponse = "Rob\xF4 Padr\xE3o: A Intelig\xEAncia Artificial (IA) \xE9 um campo amplo. Para estudar IA, voc\xEA precisa entender matem\xE1tica, \xE1lgebra linear, c\xE1lculo, estat\xEDstica e dominar programa\xE7\xE3o. Monte uma agenda de estudos cobrindo esses t\xF3picos.";
    } else {
      simulatedResponse = "Rob\xF4 Padr\xE3o: Desculpe, n\xE3o entendi muito bem o que voc\xEA deseja que eu fa\xE7a. Pode fornecer mais detalhes ou comandos claros?";
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
      contents: `Avalie o seguinte prompt de chatbot criado pelo usu\xE1rio para a tarefa 'Ajudar um estudante a planejar sua rotina de estudos de IA, dividindo-a em 3 passos simples com um tom amig\xE1vel'.

Prompt do usu\xE1rio: "${prompt}"

Retorne um objeto JSON que avalia o prompt de acordo com as seguintes regras:
1. "score": nota de 0 a 100 baseada em 3 crit\xE9rios:
   - Atribuiu um papel/persona \xE0 IA (ex: "Atue como mentor")? (Vale 30 pontos)
   - Explicou a tarefa clara de planejar a rotina de estudos de IA? (Vale 40 pontos)
   - Limitou a 3 passos simples ou especificou o tom amig\xE1vel? (Vale 30 pontos)
2. "feedback": mensagem instrutiva, super amig\xE1vel e construtiva em portugu\xEAs de at\xE9 3 frases. Diga o que ficou \xF3timo e o que pode ser melhorado se a nota for menor que 80.
3. "criteria": status de cada crit\xE9rio:
   - "persona": true/false
   - "personaFeedback": feedback de uma linha sobre o papel/persona
   - "task": true/false
   - "taskFeedback": feedback de uma linha sobre a tarefa
   - "format": true/false
   - "formatFeedback": feedback de uma linha sobre o formato/restri\xE7\xF5es
4. "simulatedResponse": simule de forma extremamente realista, curta e divertida (m\xE1ximo 4 linhas) como um chatbot real responderia ao prompt exato do usu\xE1rio, ilustrando se ele obedeceu ao tom amig\xE1vel e aos 3 passos, de acordo com o que o usu\xE1rio escreveu no prompt.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            score: { type: import_genai.Type.INTEGER },
            feedback: { type: import_genai.Type.STRING },
            criteria: {
              type: import_genai.Type.OBJECT,
              properties: {
                persona: { type: import_genai.Type.BOOLEAN },
                personaFeedback: { type: import_genai.Type.STRING },
                task: { type: import_genai.Type.BOOLEAN },
                taskFeedback: { type: import_genai.Type.STRING },
                format: { type: import_genai.Type.BOOLEAN },
                formatFeedback: { type: import_genai.Type.STRING }
              },
              required: ["persona", "personaFeedback", "task", "taskFeedback", "format", "formatFeedback"]
            },
            simulatedResponse: { type: import_genai.Type.STRING }
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
  } catch (error) {
    console.warn("Gemini API falhou no jogo, usando avalia\xE7\xE3o offline segura:", error.message);
    return res.json({ ...runOfflineEvaluation(), isRealGemini: false });
  }
});
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
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
//# sourceMappingURL=server.cjs.map
