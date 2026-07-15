import React, { useState } from "react";
import { Sparkles, Trophy, RotateCcw, Check, X, Star, Award, Gamepad2, Play, ArrowRight, ClipboardCopy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EvaluationResult {
  score: number;
  feedback: string;
  criteria: {
    persona: boolean;
    personaFeedback: string;
    task: boolean;
    taskFeedback: string;
    format: boolean;
    formatFeedback: string;
  };
  simulatedResponse: string;
  isRealGemini?: boolean;
}

interface Attempt {
  prompt: string;
  score: number;
  feedback: string;
  criteria: {
    persona: boolean;
    personaFeedback: string;
    task: boolean;
    taskFeedback: string;
    format: boolean;
    formatFeedback: string;
  };
  simulatedResponse: string;
}

export default function PromptGame() {
  const [promptText, setPromptText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [history, setHistory] = useState<Attempt[]>([]);
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>(null);
  
  const gameWon = history.some(attempt => attempt.score >= 80);
  const gameLost = attemptsRemaining === 0 && !gameWon;

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() || isLoading || gameWon || gameLost) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/evaluate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });
      
      if (!response.ok) {
        throw new Error("Falha ao avaliar o prompt");
      }

      const data: EvaluationResult = await response.json();
      
      const newAttempt: Attempt = {
        prompt: promptText,
        score: data.score,
        feedback: data.feedback,
        criteria: data.criteria,
        simulatedResponse: data.simulatedResponse
      };

      setHistory(prev => [newAttempt, ...prev]);
      setCurrentResult(data);
      setAttemptsRemaining(prev => prev - 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setPromptText("");
    setAttemptsRemaining(3);
    setHistory([]);
    setCurrentResult(null);
  };

  const fillSuggestedPrompt = () => {
    setPromptText("Atue como um mentor de IA. Crie uma rotina de estudos de Inteligência Artificial para um estudante iniciante, dividindo o plano em 3 passos simples com um tom super amigável e motivador.");
  };

  // Helper for star display
  const renderStars = (score: number) => {
    const numStars = score >= 85 ? 3 : score >= 60 ? 2 : 1;
    return (
      <div className="flex gap-1 justify-center my-1">
        {[1, 2, 3].map((star) => (
          <Star 
            key={star} 
            className={`w-5 h-5 ${star <= numStars ? "fill-amber-400 text-amber-500 animate-pulse" : "text-slate-400"}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border-2 border-black rounded-3xl p-5 md:p-6 text-slate-100 flex flex-col gap-5 shadow-2xl mt-4" id="prompt-engineering-game">
      
      {/* HEADER DO JOGO */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-400 text-slate-950 rounded-xl">
            <Gamepad2 className="w-5 h-5 animate-bounce" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-black uppercase font-display tracking-tight text-white italic">
              🎮 MINI-JOGO DE PROMPTS
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Encontre a Fórmula do Comando Perfeito
            </p>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1 text-right">
          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Tentativas</span>
          <span className="text-xs font-black font-mono text-cyan-400">
            {attemptsRemaining} restantes
          </span>
        </div>
      </div>

      {/* REGRAS E MISSÃO DO JOGO */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase font-mono tracking-wider text-cyan-400">
            Sua Missão como Engenheiro de Prompt:
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          Crie um prompt para um chatbot de IA que atenda a estes <span className="text-white font-bold underline">3 requisitos dourados</span> para ajudar um aluno a planejar sua rotina de estudos de IA:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-[11px] font-mono">
          <li className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl flex items-start gap-2">
            <span className="text-cyan-400 font-bold shrink-0">1.</span>
            <div>
              <span className="text-slate-200 block font-bold">Persona/Papel</span>
              <span className="text-slate-400 text-[10px]">Ex: "Atue como mentor de IA..."</span>
            </div>
          </li>
          <li className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl flex items-start gap-2">
            <span className="text-cyan-400 font-bold shrink-0">2.</span>
            <div>
              <span className="text-slate-200 block font-bold">Tarefa Clara</span>
              <span className="text-slate-400 text-[10px]">Ex: "planejar rotina de estudos..."</span>
            </div>
          </li>
          <li className="bg-slate-900/80 border border-slate-800 p-2 rounded-xl flex items-start gap-2">
            <span className="text-cyan-400 font-bold shrink-0">3.</span>
            <div>
              <span className="text-slate-200 block font-bold">Formato & Tom</span>
              <span className="text-slate-400 text-[10px]">Ex: "3 passos simples, tom amigável"</span>
            </div>
          </li>
        </ul>
        <div className="text-[10px] text-cyan-400 font-bold flex items-center gap-1.5 pt-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Meta: Consiga 80 pontos ou mais para vencer e dominar a Engenharia de Prompts!</span>
        </div>
      </div>

      {/* ÁREA DE DIGITAÇÃO DO PROMPT */}
      {!gameWon && !gameLost ? (
        <form onSubmit={handleEvaluate} className="space-y-3.5">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Escreva seu prompt dourado aqui:
            </label>
            <div className="relative">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Ex: Atue como mentor de produtividade. Crie uma rotina de estudos de IA dividida em 3 passos simples para o meu dia, com um tom bem amigável..."
                rows={3}
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl p-3.5 text-xs font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors resize-none leading-relaxed"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={fillSuggestedPrompt}
                className="absolute right-3.5 bottom-3.5 text-[10px] font-mono font-bold uppercase text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-900/90 border border-slate-700 px-2 py-1 rounded-lg"
                title="Dica de mestre: preencher com uma base de prompt excelente"
              >
                <span>💡 Auto-Preencher</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={!promptText.trim() || isLoading}
              className="px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-2xl text-xs font-black cursor-pointer shadow-lg disabled:cursor-not-allowed transition-all uppercase tracking-wider flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Analisando Comando...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Avaliar meu Prompt</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : null}

      {/* FEEDBACK & RESULTADO DESTA TENTATIVA */}
      <AnimatePresence mode="wait">
        {currentResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-slate-800 bg-slate-950 rounded-2xl p-4 text-left space-y-4"
          >
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-900 pb-3 gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-full ${currentResult.score >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}>
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Pontuação Alcançada</span>
                  <span className={`text-2xl font-black font-mono ${currentResult.score >= 80 ? "text-emerald-400 animate-pulse" : "text-amber-400"}`}>
                    {currentResult.score} / 100 pontos
                  </span>
                </div>
              </div>
              <div>
                {renderStars(currentResult.score)}
              </div>
            </div>

            {/* CHECKLIST DE CRITÉRIOS DE PROMPTING */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Raio-X do seu Prompt:
              </span>
              <div className="grid grid-cols-1 gap-2">
                
                {/* 1. Persona */}
                <div className="flex items-start gap-2.5 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs">
                  <span className="shrink-0 mt-0.5">
                    {currentResult.criteria.persona ? (
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    ) : (
                      <X className="w-4 h-4 text-rose-400 stroke-[3]" />
                    )}
                  </span>
                  <div>
                    <span className={`font-mono font-bold block uppercase tracking-wide ${currentResult.criteria.persona ? "text-emerald-400" : "text-rose-400"}`}>
                      Papel/Persona (30 pts)
                    </span>
                    <span className="text-slate-300 font-medium">{currentResult.criteria.personaFeedback}</span>
                  </div>
                </div>

                {/* 2. Tarefa */}
                <div className="flex items-start gap-2.5 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs">
                  <span className="shrink-0 mt-0.5">
                    {currentResult.criteria.task ? (
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    ) : (
                      <X className="w-4 h-4 text-rose-400 stroke-[3]" />
                    )}
                  </span>
                  <div>
                    <span className={`font-mono font-bold block uppercase tracking-wide ${currentResult.criteria.task ? "text-emerald-400" : "text-rose-400"}`}>
                      Tarefa Clara (40 pts)
                    </span>
                    <span className="text-slate-300 font-medium">{currentResult.criteria.taskFeedback}</span>
                  </div>
                </div>

                {/* 3. Formato */}
                <div className="flex items-start gap-2.5 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-xs">
                  <span className="shrink-0 mt-0.5">
                    {currentResult.criteria.format ? (
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    ) : (
                      <X className="w-4 h-4 text-rose-400 stroke-[3]" />
                    )}
                  </span>
                  <div>
                    <span className={`font-mono font-bold block uppercase tracking-wide ${currentResult.criteria.format ? "text-emerald-400" : "text-rose-400"}`}>
                      Formato & Tom (30 pts)
                    </span>
                    <span className="text-slate-300 font-medium">{currentResult.criteria.formatFeedback}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* FEEDBACK INTRUCIONAL */}
            <div className="bg-slate-900 border-l-4 border-cyan-400 p-3.5 rounded-r-xl rounded-l-md text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                Dica do Arquiteto de Aprendizagem:
              </span>
              <p className="text-slate-200 mt-1 leading-relaxed font-semibold">
                "{currentResult.feedback}"
              </p>
            </div>

            {/* SIMULAÇÃO DE RESPOSTA REAL DA IA */}
            <div className="space-y-1.5 bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Simulação de Resposta de IA com seu Prompt:
                </span>
                <span className="text-[9px] font-mono bg-cyan-400 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase">
                  Impacto do seu comando
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-900 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-cyan-300 whitespace-pre-wrap text-left">
                {currentResult.simulatedResponse}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* VITÓRIA OU DERROTA - INTERTÍTULOS E AÇÕES */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-emerald-500/10 border-2 border-emerald-500 p-5 rounded-2xl text-center space-y-3"
          >
            <div className="inline-block p-3 bg-emerald-500 text-slate-950 rounded-full">
              <Trophy className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black uppercase text-emerald-400 italic">
              🏆 VOCÊ VENCEU! ENGENHEIRO DE PROMPT MASTER!
            </h4>
            <p className="text-xs text-slate-200 max-w-md mx-auto leading-relaxed">
              Incrível! Seu prompt dominou todos os critérios instrucionais de alta qualidade. Você aprendeu a guiar a inteligência artificial para obter exatamente o que deseja. Você conquistou o emblema <strong>Comando Dourado</strong>!
            </p>
            <div className="pt-2">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Jogar Novamente 🔄
              </button>
            </div>
          </motion.div>
        )}

        {gameLost && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-rose-500/10 border-2 border-rose-500 p-5 rounded-2xl text-center space-y-3"
          >
            <div className="inline-block p-3 bg-rose-500 text-slate-950 rounded-full">
              <X className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="text-lg font-black uppercase text-rose-400 italic">
              FIM DE JOGO! TENTATIVAS ESGOTADAS
            </h4>
            <p className="text-xs text-slate-200 max-w-md mx-auto leading-relaxed">
              Não desanime! A engenharia de prompts é uma arte iterativa baseada em tentativa e erro. Reinicie o desafio e tente misturar o papel de mentor com a rotina de 3 passos!
            </p>
            <div className="pt-2">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Desafio</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HISTÓRICO DE COMANDOS */}
      {history.length > 0 && (
        <div className="border-t border-slate-800 pt-4 text-left">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
            Histórico de Prompts Testados:
          </span>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {history.map((attempt, index) => (
              <div 
                key={index} 
                onClick={() => {
                  setPromptText(attempt.prompt);
                  setCurrentResult({
                    score: attempt.score,
                    feedback: attempt.feedback,
                    criteria: attempt.criteria,
                    simulatedResponse: attempt.simulatedResponse
                  });
                }}
                className="bg-slate-950/60 border border-slate-850 hover:border-slate-700 p-2.5 rounded-xl flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors"
              >
                <div className="truncate flex-1">
                  <span className="font-mono text-[10px] text-slate-500 block">Tentativa 0{history.length - index}</span>
                  <span className="text-slate-300 truncate block font-medium">"{attempt.prompt}"</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold text-xs ${attempt.score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>
                    {attempt.score} pts
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">🔍 Ver</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
