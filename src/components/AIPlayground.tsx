import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, Copy, Check, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
import { ToneType } from "../types";
import { getApiUrl } from "../apiConfig";

export default function AIPlayground() {
  const [rawMessage, setRawMessage] = useState("");
  const [tone, setTone] = useState<ToneType>("Empático y Cercano");
  const [optimizedMessage, setOptimizedMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSimulation, setIsSimulation] = useState(false);

  // Ready-to-use rough ideas for teachers to quickly populate and try
  const examples = [
    {
      label: "Colación saludable",
      text: "hola papis mañana acuerdense k toca colacion saludable sin azucar plss xq varios tan hiperactivos"
    },
    {
      label: "Reunión de Apoderados",
      text: "reunion de apoderados mañana a las 19 hrs en la sala. vayan todos q hblaremos del retiro del paseo fin de año obligacion ir"
    },
    {
      label: "Fiebre o resfrío común",
      text: "hay un virus fuerte de gripe, si su hijo estornuda o tiene temperatura superior de 37.5 no lo manden para no contagiar a los demas"
    }
  ];

  const handleExampleSelect = (text: string) => {
    setRawMessage(text);
    setError("");
  };

  const optimizeMessage = async () => {
    if (!rawMessage.trim()) {
      setError("Por favor escribe o selecciona un borrador de mensaje primero.");
      return;
    }

    setIsLoading(true);
    setError("");
    setOptimizedMessage("");
    setIsSimulation(false);

    try {
      const response = await fetch(getApiUrl("/api/ai-assisted-communication"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawMessage, tone }),
      });

      if (!response.ok) {
        throw new Error("Ocurrió un error en el servidor. Inténtalo de nuevo.");
      }

      const data = await response.json();
      setOptimizedMessage(data.optimizedMessage);
      setIsSimulation(data.isSimulation || false);
    } catch (err: any) {
      setError(err.message || "Error al conectar con la Inteligencia Artificial.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!optimizedMessage) return;
    navigator.clipboard.writeText(optimizedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="ai-playground" className="py-20 bg-slate-50 border-b border-rose-100/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Interactive Demo</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Prueba de Comunicación Asistida con IA
          </h2>
          <p className="text-lg text-slate-600">
            Experimenta en tiempo real cómo nuestra IA integrada transforma borradores crudos o informales en comunicados cálidos, asertivos y profesionales que incrementan el engagement familiar.
          </p>
        </div>

        {/* Demo Playground Layout */}
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100 overflow-hidden">
          <div className="md:grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* Input Section */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-coral-500 uppercase tracking-widest">Paso 1: Tu Borrador Crudo</span>
                <h3 className="text-lg font-bold text-slate-900">Escribe o selecciona una plantilla</h3>
              </div>

              {/* Sample Selector */}
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sugerencias rápidas:</span>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example) => (
                    <button
                      key={example.label}
                      onClick={() => handleExampleSelect(example.text)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:border-coral-300 hover:bg-coral-50/20 text-slate-600 hover:text-coral-600 transition cursor-pointer"
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input area */}
              <div className="space-y-1.5 pt-1">
                <label htmlFor="rawMessage" className="block text-xs font-bold text-slate-600">
                  Mensaje del Docente o Coordinador:
                </label>
                <textarea
                  id="rawMessage"
                  rows={4}
                  value={rawMessage}
                  onChange={(e) => {
                    setRawMessage(e.target.value);
                    setError("");
                  }}
                  placeholder="Ej: acuérdense q mañana no hay clases x consejo de profesores se retiran a las 12..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-850 placeholder:text-slate-400 focus:outline-hidden focus:border-coral-400 focus:bg-white focus:ring-1 focus:ring-coral-400 transition"
                />
              </div>

              {/* Tone selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-600">
                  Alineación del Tono (Powered by Gemini):
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["Empático y Cercano", "Formal e Institucional", "Directo y Claro"] as ToneType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`text-xs font-semibold px-2 py-3 rounded-xl border transition cursor-pointer ${
                        tone === t
                          ? "border-coral-500 bg-coral-50/40 text-coral-600 shadow-sm"
                          : "border-slate-200 text-slate-550 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action trigger button */}
              <button
                onClick={optimizeMessage}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-coral-500 py-3 text-sm font-bold text-white hover:bg-coral-600 shadow-md shadow-coral-500/10 transition disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Optimizando Mensaje con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Optimizar Mensaje con EduPlop IA
                  </>
                )}
              </button>

              {/* Input error warning */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-xs text-red-600 bg-red-50/50 p-3 rounded-xl border border-red-100"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Output Section */}
            <div className="p-6 sm:p-8 bg-slate-50/20 flex flex-col justify-between min-h-[380px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-mint-500 uppercase tracking-widest">Paso 2: Mensaje Publicado</span>
                    <h3 className="text-lg font-bold text-slate-900">Vista del Comunicado para Apoderados</h3>
                  </div>
                  {isSimulation && (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase">
                      Modo Simulación
                    </span>
                  )}
                </div>

                {/* Displaying AI Response Output */}
                <div className="relative min-h-[160px] rounded-2xl border border-dashed border-slate-200 bg-white p-5 flex flex-col justify-between">
                  {isLoading ? (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 rounded-2xl">
                      <div className="flex space-x-1.5 h-6 items-center">
                        <span className="h-2 w-2 bg-coral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-coral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-coral-500 rounded-full animate-bounce"></span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 font-mono">Generando tono {tone}...</span>
                    </div>
                  ) : null}

                  {optimizedMessage ? (
                    <div className="space-y-4">
                      {/* Interactive App notification header mimicking actual interface */}
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 bg-slate-50/50 -mx-5 -mt-5 p-3.5 rounded-t-2xl">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-coral-500 to-amber-400 flex items-center justify-center text-white font-bold text-xs">
                          Ep
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Colegio Sol y Luna</p>
                          <p className="text-[10px] text-slate-400">Canal de Comunicación • EduPlop</p>
                        </div>
                      </div>

                      <p className="text-sm text-slate-705 leading-relaxed italic whitespace-pre-line pt-1">
                        {optimizedMessage}
                      </p>
                    </div>
                  ) : (
                    <div className="my-auto text-center space-y-2 p-4">
                      <Send className="h-8 w-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-450 font-medium">
                        Tu mensaje optimizado aparecerá aquí en el formato móvil en que lo recibirán las familias. Escribe un borrador a la izquierda y presiona en "Optimizar Mensaje".
                      </p>
                    </div>
                  )}

                  {/* Copy toolbar */}
                  {optimizedMessage && (
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 bg-slate-50/30 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
                      <span className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1">
                        <Check className="h-3 w-3 text-mint-500" /> Tono aplicado ✓
                      </span>
                      <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-coral-500 transition hover:border-coral-200 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-mint-500" /> Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copiar Comunicado
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Informative advice */}
              <div className="mt-4 p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex items-start gap-2.5 text-xs text-slate-600">
                <Sparkles className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Tip de Educación:</strong> Un tono empático y positivo incrementa la participación y confianza familiar en más de un <strong>42%</strong>, generando una comunidad escolar unida y comprometida.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
