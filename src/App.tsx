import React, { useState, useRef, useEffect, FormEvent } from "react";
import { 
  BookOpen, 
  Cpu, 
  Sparkles, 
  Lightbulb, 
  Play, 
  Check, 
  Copy, 
  Trophy, 
  Send, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MODULES } from "./data";
import { ChatMessage, UserProgress } from "./types";
import PromptGame from "./components/PromptGame";

// Dynamic stylistic configuration matching the 'Artistic Flair' guidelines for each module
const MODULE_STYLES = [
  {
    cardBg: "bg-white text-slate-950 border-2 border-slate-950 md:rotate-1 shadow-2xl",
    objBox: "bg-slate-100 border-l-4 border-slate-950 text-slate-950",
    objTag: "text-cyan-600",
    textMain: "text-slate-950",
    textSec: "text-slate-700",
    dot: "bg-cyan-500",
    stepNum: "bg-black text-white",
    descBox: "bg-cyan-50/80 border border-cyan-100 text-slate-950",
    quizBox: "border-slate-300 bg-slate-50 text-slate-950",
    btnPrimary: "bg-slate-950 hover:bg-slate-900 text-white font-black",
    tabActive: "bg-white text-slate-950 font-black border-2 border-slate-950 shadow-md",
  },
  {
    cardBg: "bg-cyan-400 text-slate-950 border-2 border-slate-950 md:-rotate-1 shadow-2xl",
    objBox: "bg-white/50 border-l-4 border-slate-950 text-slate-950",
    objTag: "text-slate-800",
    textMain: "text-slate-950",
    textSec: "text-slate-900",
    dot: "bg-black",
    stepNum: "bg-black text-white",
    descBox: "bg-white border border-white/60 text-slate-950",
    quizBox: "border-black/10 bg-white/40 text-slate-950",
    btnPrimary: "bg-slate-950 hover:bg-slate-900 text-cyan-400 font-black",
    tabActive: "bg-cyan-400 text-slate-950 font-black border-2 border-slate-950 shadow-md",
  },
  {
    cardBg: "bg-slate-800 text-white border-2 border-slate-700 md:rotate-2 shadow-2xl",
    objBox: "bg-slate-700 border-l-4 border-cyan-400 text-white",
    objTag: "text-cyan-400",
    textMain: "text-white",
    textSec: "text-slate-300",
    dot: "bg-cyan-400",
    stepNum: "bg-cyan-400 text-black font-bold",
    descBox: "bg-slate-900 border border-slate-800 text-white",
    quizBox: "border-slate-700 bg-slate-900/60 text-white",
    btnPrimary: "bg-cyan-400 hover:bg-cyan-300 text-black font-black",
    tabActive: "bg-slate-800 text-white font-black border-2 border-slate-700 shadow-md",
  }
];

export default function App() {
  // Navigation & progress states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C">>({});
  const [revealedQuiz, setRevealedQuiz] = useState<Record<number, boolean>>({});
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Chatbot states
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o seu mentor de IA. 🧠\n\nCopie um desafio prático ao lado e envie aqui para testarmos juntos!",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRealGemini, setIsRealGemini] = useState(true);

  // Refs for UX
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeModule = MODULES[currentIdx];
  const activeStyle = MODULE_STYLES[currentIdx];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle Copy Prompt
  const handleCopyPrompt = (prompt: string, moduleId: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(moduleId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick Action: Paste prompt directly to Chatbot input
  const handleSendToChat = (prompt: string) => {
    setChatInput(prompt);
    inputRef.current?.focus();
    // Soft bounce effect on chat input
    inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // Handle Quiz Answer Selection
  const handleAnswer = (option: "A" | "B" | "C") => {
    setAnswers(prev => ({ ...prev, [activeModule.id]: option }));
    setRevealedQuiz(prev => ({ ...prev, [activeModule.id]: true }));

    if (option === activeModule.quiz.correctAnswer) {
      if (!completedModules.includes(activeModule.id)) {
        setCompletedModules(prev => [...prev, activeModule.id]);
      }
    }
  };

  // Pre-programmed simulated answers for robust fallback offline or without API Key
  const getSimulatedResponse = (userMsg: string): string => {
    const text = userMsg.toLowerCase();
    if (text.includes("adivinhe que animal") || text.includes("bigodes") || text.includes("miaus")) {
      return "GATO! 🐱\n\nParabéns! Esse prompt foi curto, divertido e seguiu regras perfeitas. A IA adivinhou sem hesitar porque você deu as pistas certas!";
    }
    if (text.includes("cronograma") || text.includes("mentor de produtividade") || text.includes("estudar ia")) {
      return "Ótima escolha de comando! Como seu mentor de produtividade, organizei este plano de 3 passos:\n\n1. **Conceitos de IA** (30 min) - Leia sobre aprendizado de máquina.\n2. **Prática** (30 min) - Teste comandos criativos aqui no chat.\n3. **Ética** (15 min) - Estude sobre alucinações e cheque fontes.\n\nSiga firme!";
    }
    if (text.includes("relatividade") || text.includes("criança de 8 anos") || text.includes("relatividade geral")) {
      return "A Teoria da Relatividade diz que o espaço e o tempo são flexíveis! Pense no espaço como uma cama elástica: uma bola pesada cria uma curva, fazendo outras coisas menores deslizarem em direção a ela. Isso é a gravidade!\n\n**Fonte confiável:** NASA Space Place (spaceplace.nasa.gov).";
    }
    return "Excelente comando de teste! Você usou palavras bem diretas. Isso mostra que você está dominando a arte de estruturar prompts claros. Continue experimentando!";
  };

  // Send Message to Chatbot
  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userText = chatInput.trim();
    const newUserMessage: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setChatInput("");
    setIsLoading(true);

    // Prepare system instruction custom-tailored to our friendly Portuguese mentor persona
    const systemInstruction = 
      "Você é um mentor de IA extremamente amigável, direto ao ponto, dinâmico e empolgante. " +
      "Responda sempre em português. Use frases curtas (menos de 10 palavras por frase sempre que possível). " +
      "Use bullet points assertivos. Diga se o prompt digitado foi bom e dê uma dica rápida de melhoria.";

    try {
      // Reconstruct conversation history for Gemini context
      const chatHistory = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: chatHistory,
          systemInstruction
        })
      });

      if (!res.ok) {
        throw new Error("Falha na resposta do servidor");
      }

      const data = await res.json();
      
      const botMessage: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsRealGemini(true);
    } catch (err) {
      console.warn("API Error, falling back to simulated high-quality mentor response:", err);
      // Wait a moment to make the simulation feel natural
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const simulatedText = getSimulatedResponse(userText);
      const botMessage: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: simulatedText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsRealGemini(false); // Flag showing fallback is active
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate global progress
  const totalSteps = MODULES.length * 2; // Each module has content review + quiz completion
  const quizPoints = Object.entries(answers).reduce((acc, [modId, ans]) => {
    const mod = MODULES.find(m => m.id === Number(modId));
    return ans === mod?.quiz.correctAnswer ? acc + 1 : acc;
  }, 0);
  
  // Progress is computed as 50% for completed modules (read) and 50% for quizzes answered correctly
  const progressPercentage = Math.round(
    ((completedModules.length + quizPoints) / (MODULES.length * 2)) * 100
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans flex flex-col antialiased">
      
      {/* ARTISTIC FLAIR HEADER */}
      <header className="max-w-7xl w-full mx-auto px-4 md:px-6 pt-8 pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-2 text-left">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400 block">
            Learning Architecture
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic uppercase text-white">
            Guia de IA<br/>
            <span className="text-transparent" style={{ WebkitTextStroke: "1px #22d3ee" }}>
              para Iniciantes
            </span>
          </h1>
        </div>
        <div className="text-left md:text-right max-w-xs md:max-w-sm">
          <p className="text-sm text-slate-400 leading-tight italic">
            Transforme curiosidade em competência digital com este guia rápido de 3 passos interativos.
          </p>
        </div>
      </header>

      {/* PAINEL DE GAMIFICAÇÃO INTEGRADA (STYLING ARTISTIC FLAIR) */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 mt-6">
        <div className="flex flex-wrap items-center gap-4 md:gap-6 bg-slate-900 border border-slate-850 p-4 rounded-3xl justify-between">
          
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Progresso Geral</span>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-24 md:w-48 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="bg-cyan-400 h-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold font-mono text-cyan-400">{progressPercentage}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-800 text-amber-400 rounded-xl border border-slate-700">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Acertos</span>
                <span className="text-xs font-bold text-white">{quizPoints} de 3</span>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-800 text-cyan-400 rounded-xl border border-slate-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Leituras</span>
                <span className="text-xs font-bold text-white">
                  {completedModules.length} de 3
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* GRADE PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA: Módulos de Aprendizagem (7 colunas) */}
        <section className="lg:col-span-7 flex flex-col gap-6" id="learning-section">
          
          {/* Navegador de Abas Estilo 'Artistic Flair' */}
          <div className="flex border border-slate-800 bg-slate-900 p-1.5 rounded-3xl justify-between gap-1.5 shadow-xl">
            {MODULES.map((mod, index) => {
              const isSelected = index === currentIdx;
              const isFinished = completedModules.includes(mod.id);
              
              let tabStyle = "text-slate-400 hover:text-white hover:bg-slate-800";
              if (isSelected) {
                if (index === 0) tabStyle = "bg-white text-slate-950 font-black border border-slate-300 shadow-md";
                if (index === 1) tabStyle = "bg-cyan-400 text-slate-950 font-black border border-cyan-500 shadow-md";
                if (index === 2) tabStyle = "bg-slate-800 text-white font-black border border-slate-700 shadow-md";
              }

              return (
                <button
                  key={mod.id}
                  onClick={() => setCurrentIdx(index)}
                  className={`flex-1 py-3 px-2 rounded-2xl text-xs md:text-sm font-medium transition-all duration-200 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer ${tabStyle}`}
                  id={`module-tab-${mod.id}`}
                >
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black ${
                    isSelected ? "bg-slate-950 text-white" : "bg-slate-800 text-slate-300"
                  }`}>
                    {isFinished ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      "0" + (index + 1)
                    )}
                  </span>
                  <span className="hidden md:inline truncate">{mod.title.split(":")[1].trim()}</span>
                  <span className="md:hidden truncate">{mod.title.split(":")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Conteúdo Dinâmico do Módulo Ativo com a inclinação e cores do Tema 'Artistic Flair' */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={`rounded-4xl p-6 md:p-8 flex flex-col gap-6 transition-all duration-300 ${activeStyle.cardBg}`}
              id={`module-card-${activeModule.id}`}
            >
              
              {/* Título do Módulo */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold uppercase font-mono tracking-widest ${activeStyle.objTag}`}>
                    {activeModule.title.split(":")[0]}
                  </span>
                  <span className="text-[10px] bg-slate-950 text-white font-mono px-3 py-1 rounded-full font-bold uppercase">
                    Passo 0{activeModule.id}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight leading-none uppercase">
                  {activeModule.title.split(": ")[1]}
                </h2>
              </div>

              {/* 🎯 OBJETIVO DO ALUNO */}
              <div className={`rounded-2xl p-4 flex items-start gap-3 border ${activeStyle.objBox}`}>
                <div className="p-1.5 bg-black/10 rounded-lg shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider opacity-60 font-bold block">
                    Objetivo de Aprendizagem
                  </span>
                  <p className="text-sm font-bold leading-tight">
                    {activeModule.objective}
                  </p>
                </div>
              </div>

              {/* 💡 EXPLICAÇÃO RÁPIDA (Analogia simples, frases curtas) */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-black/10 pb-2">
                  <BookOpen className="w-4 h-4 opacity-75" />
                  <h3 className="text-xs font-black uppercase font-mono tracking-wider">
                    Explicação Rápida (Sem Jargão)
                  </h3>
                </div>
                <ul className="grid grid-cols-1 gap-2.5">
                  {activeModule.analogy.map((sentence, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex items-start gap-3 text-sm font-semibold leading-relaxed"
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${activeStyle.dot}`} />
                      <span>{sentence}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* ⚡ DESAFIO PRÁTICO (Chatbot Prompt playground) */}
              <div className={`rounded-2xl p-5 flex flex-col gap-4 ${activeStyle.descBox}`}>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⚡</span>
                    <h3 className="text-xs font-black uppercase font-mono tracking-wider">
                      ⚡ Desafio Prático (Atividade de 2 minutos)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-black text-white rounded-full font-bold">
                    FAÇA AGORA
                  </span>
                </div>

                {/* Lista de passos do desafio */}
                <ul className="grid grid-cols-1 gap-2 border-b border-black/10 pb-3.5">
                  {activeModule.practicalChallenge.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs font-medium">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center font-mono font-black text-[9px] ${activeStyle.stepNum}`}>
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>

                {/* Prompt Recomendado / Copiável */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono font-bold uppercase opacity-60">
                    Comando Especial (Pronto para copiar)
                  </span>
                  <div className="relative group rounded-xl border border-black/15 bg-white/70 p-4 font-mono text-xs leading-relaxed text-slate-900">
                    <p className="pr-16 whitespace-pre-line leading-relaxed text-left font-semibold">
                      {activeModule.practicalChallenge.suggestedPrompt}
                    </p>
                    
                    <div className="absolute right-2 top-2.5 flex items-center gap-1.5">
                      {/* Copy Action Button */}
                      <button
                        onClick={() => handleCopyPrompt(activeModule.practicalChallenge.suggestedPrompt, activeModule.id)}
                        className="p-1.5 bg-slate-950 text-white hover:bg-slate-800 border border-transparent rounded-lg cursor-pointer transition-colors"
                        title="Copiar Comando"
                      >
                        {copiedId === activeModule.id ? (
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Paste & Auto Send to Chat */}
                      <button
                        onClick={() => handleSendToChat(activeModule.practicalChallenge.suggestedPrompt)}
                        className="p-1.5 bg-cyan-400 hover:bg-cyan-300 border border-transparent text-slate-950 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                        title="Enviar para o Chatbot"
                      >
                        <Play className="w-3 h-3 fill-slate-950" />
                        <span className="text-[9px] font-mono font-black uppercase px-0.5 hidden sm:inline">Testar</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Mini-jogo de Prompt exclusivo para o Módulo 2 */}
              {activeModule.id === 2 && <PromptGame />}

              {/* ❓ QUIZ RÁPIDO (Interactive questions with answers) */}
              <div className={`rounded-2xl p-5 flex flex-col gap-4 border ${activeStyle.quizBox}`}>
                
                <div className="flex items-center gap-2 border-b border-black/10 pb-2">
                  <HelpCircle className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase font-mono tracking-wider">
                    ❓ Quiz Rápido (Valide seu aprendizado)
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-left">
                    {activeModule.quiz.question}
                  </h4>

                  {/* Opções de Resposta */}
                  <div className="grid grid-cols-1 gap-2">
                    {(Object.keys(activeModule.quiz.options) as Array<"A" | "B" | "C">).map((key) => {
                      const isChosen = answers[activeModule.id] === key;
                      const isCorrect = key === activeModule.quiz.correctAnswer;
                      const hasRevealed = revealedQuiz[activeModule.id];

                      let btnStyle = "border-slate-300 hover:bg-black/5 bg-white/40 text-slate-900";
                      // Adjust based on light/dark backgrounds
                      if (currentIdx === 2) {
                        btnStyle = "border-slate-700 hover:bg-white/5 bg-slate-900/40 text-white";
                      }

                      if (hasRevealed) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-900";
                          if (currentIdx === 2) btnStyle = "border-emerald-400 bg-emerald-500/25 text-emerald-200";
                        } else if (isChosen) {
                          btnStyle = "border-rose-500 bg-rose-500/20 text-rose-900";
                          if (currentIdx === 2) btnStyle = "border-rose-400 bg-rose-500/25 text-rose-200";
                        } else {
                          btnStyle = "opacity-40 border-transparent bg-transparent";
                        }
                      }

                      return (
                        <button
                          key={key}
                          disabled={hasRevealed && answers[activeModule.id] === activeModule.quiz.correctAnswer}
                          onClick={() => handleAnswer(key)}
                          className={`w-full py-3 px-4 rounded-xl border text-xs md:text-sm font-bold transition-all duration-200 text-left flex items-start gap-3 cursor-pointer ${btnStyle}`}
                          id={`quiz-option-${activeModule.id}-${key}`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                            isChosen
                              ? isCorrect
                                ? "bg-emerald-600 text-white"
                                : "bg-rose-600 text-white"
                              : "bg-slate-950 text-white"
                          }`}>
                            {key}
                          </span>
                          <span>{activeModule.quiz.options[key]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Resposta Oculta / Spoiler (Reveals upon selection) */}
                <AnimatePresence>
                  {revealedQuiz[activeModule.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-2 p-4 rounded-xl flex flex-col gap-2 border ${
                        currentIdx === 2 
                          ? "bg-slate-900/80 border-slate-700" 
                          : "bg-white/80 border-slate-300"
                      }`}>
                        <div className="flex items-center gap-2">
                          {answers[activeModule.id] === activeModule.quiz.correctAnswer ? (
                            <span className="text-xs font-black font-mono text-emerald-800 uppercase flex items-center gap-1 bg-emerald-300/30 px-2.5 py-0.5 rounded-full">
                              🎉 Correto!
                            </span>
                          ) : (
                            <span className="text-xs font-black font-mono text-rose-800 uppercase flex items-center gap-1 bg-rose-300/30 px-2.5 py-0.5 rounded-full">
                              ❌ Ops!
                            </span>
                          )}
                          <span className="text-xs font-black font-mono">
                            Gabarito: {activeModule.quiz.correctAnswer}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed font-bold">
                          Justificativa: <span className="font-medium opacity-90">{activeModule.quiz.explanation}</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Botões de Ação Inferiores (Avançar / Voltar) */}
              <div className="flex items-center justify-between border-t border-black/10 pt-5 mt-2">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer disabled:opacity-40 ${
                    currentIdx === 2 
                      ? "border-slate-700 text-slate-300 hover:bg-slate-700" 
                      : "border-black/20 text-slate-800 hover:bg-black/5"
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar
                </button>

                {currentIdx < MODULES.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs cursor-pointer ${activeStyle.btnPrimary}`}
                  >
                    Avançar Módulo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className={`text-xs font-bold font-mono px-3 py-1.5 rounded-full flex items-center gap-1 ${
                    currentIdx === 2 
                      ? "bg-cyan-400 text-slate-950" 
                      : "bg-slate-950 text-white"
                  }`}>
                    Conquista: {activeModule.achievementName}
                  </span>
                )}
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Card de Conclusão / Comemoração quando tudo estiver concluído */}
          {completedModules.length === MODULES.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border-2 border-cyan-400 text-white rounded-4xl p-6 md:p-8 flex flex-col items-center text-center gap-5 relative overflow-hidden shadow-2xl"
            >
              {/* Estrelas animadas decorativas */}
              <div className="absolute top-4 left-4 text-cyan-400 animate-bounce">⚡</div>
              <div className="absolute bottom-4 right-4 text-cyan-400 animate-pulse">✨</div>
              
              <div className="p-4 bg-slate-800 text-cyan-400 rounded-full border border-slate-700">
                <Trophy className="w-10 h-10" />
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl md:text-3xl font-black font-display tracking-tight text-white italic uppercase">
                  Parabéns, Arquiteto! 🎓
                </h3>
                <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto">
                  Você dominou com sucesso todos os módulos do Guia de IA para Iniciantes. Agora você entende o cérebro digital!
                </p>
              </div>

              {/* Insígnias */}
              <div className="flex flex-wrap justify-center gap-3 mt-1">
                {MODULES.map(m => (
                  <div key={m.id} className="bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-2xl flex items-center gap-1.5 text-xs text-cyan-400 font-mono font-bold">
                    <span>{m.achievementName}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setAnswers({});
                  setRevealedQuiz({});
                  setCompletedModules([]);
                  setCurrentIdx(0);
                }}
                className="mt-2 px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-2xl text-xs font-black cursor-pointer shadow-md transition-colors uppercase tracking-wider"
              >
                Reiniciar Jornada 🔄
              </button>
            </motion.div>
          )}

        </section>

        {/* COLUNA DIREITA: Chatbot Mentor de Prompts (5 colunas) */}
        <section className="lg:col-span-5 flex flex-col border border-slate-800 bg-slate-900 rounded-4xl shadow-2xl overflow-hidden min-h-[500px] lg:h-[calc(100vh-180px)]" id="chat-section">
          
          {/* Header do Chatbot */}
          <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-850">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="p-2.5 bg-cyan-400 rounded-xl text-slate-950 shadow-sm">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-black font-display tracking-tight text-white uppercase italic flex items-center gap-1.5">
                  MENTOR DE PROMPTS
                  <span className="text-[9px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded-full font-mono font-bold">
                    ONLINE
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Gemini 3.5 Flash Engine
                </p>
              </div>
            </div>

            {/* Indicator showing real vs simulated API responses */}
            <div className="flex items-center gap-1.5 text-[9px] font-mono px-2.5 py-1 bg-slate-800 rounded-full border border-slate-700">
              <span className={`w-2 h-2 rounded-full ${isRealGemini ? "bg-cyan-400" : "bg-amber-400"}`} />
              <span className="text-slate-300 font-bold">{isRealGemini ? "API Ativa" : "Backup"}</span>
            </div>
          </div>

          {/* Notificação informativa rápida */}
          <div className="bg-slate-950/60 border-b border-slate-850 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Envie o comando copiado do desafio para testar.
            </span>
          </div>

          {/* Área de Mensagens de Chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
            {messages.map((msg) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAssistant ? "justify-start" : "justify-end"} items-start gap-2.5`}
                >
                  {isAssistant && (
                    <div className="p-1.5 bg-slate-800 text-cyan-400 border border-slate-700 rounded-xl shrink-0 mt-1">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm leading-relaxed ${
                    isAssistant
                      ? "bg-slate-900 border border-slate-800 text-slate-200 text-left"
                      : "bg-cyan-400 text-slate-950 text-left font-bold"
                  }`}>
                    {/* Render message with line-breaks */}
                    <p className="whitespace-pre-line text-left break-words">
                      {msg.content}
                    </p>
                    
                    {/* Timestamp */}
                    <span className={`text-[9px] block mt-2 text-right font-mono ${
                      isAssistant ? "text-slate-500" : "text-slate-800"
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Chatbot Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start items-start gap-2.5">
                <div className="p-1.5 bg-slate-800 text-cyan-400 border border-slate-700 rounded-xl shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce delay-0" />
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce delay-150" />
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Área de Entrada do Chat (Input e botão enviar) */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-4 border-t border-slate-850 bg-slate-950 flex flex-col gap-2"
          >
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-2xl focus-within:ring-2 focus-within:ring-cyan-400/20 focus-within:border-cyan-400 transition-all p-1.5">
              
              <textarea
                ref={inputRef}
                rows={2}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Cole o desafio de prompt aqui..."
                className="flex-1 px-3 py-1.5 text-xs md:text-sm bg-transparent outline-none border-none resize-none text-white placeholder-slate-500 leading-normal"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />

              <button
                type="submit"
                disabled={!chatInput.trim() || isLoading}
                className="p-3 bg-cyan-400 hover:bg-cyan-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 rounded-xl cursor-pointer disabled:cursor-not-allowed transition-all shadow-md shrink-0 self-end font-bold"
                title="Enviar Mensagem"
              >
                <Send className="w-4 h-4 fill-current" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
              <span>Aperte [Enter] para enviar</span>
              <button
                type="button"
                onClick={() => {
                  setMessages([
                    {
                      id: "welcome",
                      role: "assistant",
                      content: "Chat reiniciado! Copie um dos desafios do guia ao lado e envie aqui para testar com o mentor.",
                      timestamp: new Date()
                    }
                  ]);
                }}
                className="text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
              >
                Limpar Conversa 🔄
              </button>
            </div>
          </form>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-8 border-t border-slate-800 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">CONECTADO</span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">MODO SEGURO</span>
            </div>
          </div>
          <p className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">
            ARQUITETURA DE APRENDIZAGEM v1.0 // 2026 // GUIA INTERATIVO DE IA
          </p>
        </div>
      </footer>

    </div>
  );
}

