import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, MessageSquare, X, ShieldAlert, Sparkles, SendHorizontal } from "lucide-react";
import { getApiUrl } from "../apiConfig";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Custom Animated Robot SVG Face Component based on the user's uploaded image
function PlopyAvatar({ state }: { state: "idle" | "thinking" | "talking" }) {
  const isThinking = state === "thinking";
  const isTalking = state === "talking";

  return (
    <div className="relative w-20 h-20 mx-auto select-none">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(99,102,241,0.2)]"
      >
        <defs>
          {/* Glowing Filters for neon cyan eyes & chest lightning */}
          <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="chestScreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* 1. Accoridon Metallic Neck Joints */}
        <g id="neck">
          <rect x="42" y="58" width="16" height="4" rx="2" fill="#64748b" />
          <rect x="40" y="62" width="20" height="4" rx="2" fill="#475569" />
          <rect x="42" y="66" width="16" height="4" rx="2" fill="#334155" />
        </g>

        {/* 2. Sleek White Robotic Torso (Chest Piece) */}
        <path
          d="M 24,70 Q 24,68 28,68 L 72,68 Q 76,68 76,70 L 82,100 L 18,100 Z"
          fill="url(#bodyGrad)"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />

        {/* 3. Shoulder Joints (White tubes on the sides) */}
        <circle cx="18" cy="76" r="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="82" cy="76" r="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />

        {/* 4. Display on Chest (Blue screen with cyan lightning and red dot) */}
        <rect x="36" y="74" width="28" height="15" rx="4" fill="url(#chestScreen)" stroke="#2563eb" strokeWidth="1" />
        {/* Glowing cyan lightning line */}
        <path
          d="M 50,77 L 46,82 L 50,82 L 48,87 Z"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#eyeGlow)"
          className={isThinking ? "animate-pulse" : ""}
        />
        {/* Red power indicator DOT */}
        <circle
          cx="60"
          cy="78"
          r="1.5"
          fill="#ff0000"
          className="animate-ping"
          style={{ animationDuration: isThinking ? "0.6s" : "2s" }}
        />
        <circle cx="60" cy="78" r="1.5" fill="#ef4444" />

        {/* 5. Sleek White Helmet Head */}
        <rect
          x="20"
          y="8"
          width="60"
          height="52"
          rx="18"
          fill="url(#bodyGrad)"
          stroke="#94a3b8"
          strokeWidth="2"
        />

        {/* 6. Ears/Headsets plates on left & right sides */}
        <rect x="14" y="24" width="6" height="20" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <rect x="80" y="24" width="6" height="20" rx="3" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />

        {/* Small top head light */}
        <rect x="46" y="5" width="8" height="3" rx="1.5" fill="#38bdf8" />

        {/* 7. Visor Screen Panel (Dark monitor) */}
        <rect
          x="26"
          y="16"
          width="48"
          height="34"
          rx="10"
          fill="url(#visorGrad)"
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* 8. Glowing Circular Neon Blue Eyes with spirals/dashes */}
        <g id="eyes" filter="url(#eyeGlow)">
          {/* Left Eye */}
          <circle cx="39" cy="31" r="9" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3,1" />
          <circle cx="39" cy="31" r="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="37.5" cy="29.5" r="2" fill="#ffffff" /> {/* Pupil Highlight */}

          {/* Right Eye */}
          <circle cx="61" cy="31" r="9" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3,1" />
          <circle cx="61" cy="31" r="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="59.5" cy="29.5" r="2" fill="#ffffff" /> {/* Pupil Highlight */}
        </g>

        {/* 9. Adorable curved Smile Line below screen */}
        <path
          d="M 38,54 Q 50,59 62,54"
          fill="none"
          stroke="#1e293b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Gentle Floating Motion Elements when idle or talking */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        animate={isThinking ? {
          y: [-2, 2, -2],
          scale: [1, 1.02, 1]
        } : isTalking ? {
          y: [-1, 3, -1],
          rotate: [-1, 1, -1]
        } : {
          y: [0, -3, 0]
        }}
        transition={{
          duration: isThinking ? 1.5 : isTalking ? 0.6 : 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

export default function SmartBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: "¡Hola! Soy **Plopy**, tu robot de asesoramiento escolar inteligente de **EduPlop** 🤖. Estoy aquí para resolver tus dudas sobre seguridad de salidas, IA empática, preventa o de la Ley de Privacidad. ¿En qué te asesoro hoy?",
      timestamp: new Date()
    }
  ]);
  const [botState, setBotState] = useState<"idle" | "thinking" | "talking">("idle");
  const [hasNewMessage, setHasNewMessage] = useState(true); // Blinks state for the badge to get attention

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested direct action question chips
  const suggestions = [
    { text: "¿Cómo funciona el Retiro Seguro?", icon: "🔐" },
    { text: "¿Qué es el sistema Offline-First?", icon: "📶" },
    { text: "¿Cómo ayuda la IA en los comunicados?", icon: "✨" },
    { text: "¿Cómo protegen la privacidad de los menores?", icon: "🛡️" },
    { text: "¿Tienen algún descuento de Preventa?", icon: "🚀" }
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getSimulatedChatReply = (latestUserMessage: string): string => {
    const textLower = latestUserMessage.toLowerCase();

    if (textLower.includes("segur") || textLower.includes("cripto") || textLower.includes("firma") || textLower.includes("ed25519") || textLower.includes("identidad") || textLower.includes("valid") || textLower.includes("laser") || textLower.includes("retiro") || textLower.includes("alumn") || textLower.includes("porton") || textLower.includes("portón") || textLower.includes("pase") || textLower.includes("qr")) {
      return "🔐 En EduPlop, la **seguridad es lo primero**. Los retiros de alumnos se gestionan por pases digitales con QR dinámicos autorizados. El personal del colegio los escanea para corroborar al instante la autenticidad con firmas criptográficas avanzadas (ED25519). ¡Sin impostores, ni planillas desactualizadas!";
    } else if (textLower.includes("privaci") || textLower.includes("dato") || textLower.includes("menor") || textLower.includes("coppa") || textLower.includes("gdpr") || textLower.includes("ley") || textLower.includes("cifrado") || textLower.includes("guardar") || textLower.includes("encript") || textLower.includes("salud")) {
      return "🛡️ **Privacidad Absoluta**: Toda información (tanto de familias como de alumnos) se almacena cifrada con algoritmo AES-256 en reposo y TLS 1.3 en tránsito. Cumplimos con las regulaciones internacionales más rigurosas de privacidad estudiantil (como COPPA/GDPR) y normativas locales de resguardo de menores. ¡Jamás vendemos ni compartimos datos!";
    } else if (textLower.includes("integr") || textLower.includes("conectar") || textLower.includes("sincro") || textLower.includes("sistema") || textLower.includes("sis") || textLower.includes("base") || textLower.includes("api") || textLower.includes("secretar") || textLower.includes("gesti")) {
      return "🔌 **Integración Transparente**: EduPlop se acopla a tu infraestructura actual. Ofrecemos adaptadores API estándar para importar alumnos, cursos y apoderados desde tu base de datos escolar tradicional, eliminando doble entrada manual de datos de secretaría.";
    } else if (textLower.includes("offline") || textLower.includes("internet") || textLower.includes("corte") || textLower.includes("señal") || textLower.includes("celular") || textLower.includes("red") || textLower.includes("desconec")) {
      return "📶 **Diseño Offline-First**: No te preocupes por la conexión deficiente en el portón escolar. Nuestra tecnología habilita que los profesores firmen y confirmen la identidad del apoderado localmente mediante firmas criptográficas empotradas. Al volver el internet, la base central se sincroniza automáticamente.";
    } else if (textLower.includes("ia") || textLower.includes("inteligencia") || textLower.includes("gemini") || textLower.includes("comunic") || textLower.includes("empat") || textLower.includes("redac") || textLower.includes("tono")) {
      return "✨ Nuestra **IA Empática** (desarrollada con Gemini) asiste a directores y docentes en momentos críticos de estrés. Permite redactar mensajes diarios, notificaciones y comunicados con un tono optimizado, claro e institucional para que las familias sientan contención en lugar de angustia.";
    } else if (textLower.includes("descuento") || textLower.includes("preventa") || textLower.includes("precio") || textLower.includes("comprar") || textLower.includes("contra") || textLower.includes("promo") || textLower.includes("cupon") || textLower.includes("cupón") || textLower.includes("costo") || textLower.includes("pago") || textLower.includes("comercial") || textLower.includes("vender") || textLower.includes("suscrip")) {
      return "🚀 ¡Estamos en campaña de preventa exclusiva! Si te pre-inscribes hoy mismo utilizando el formulario de la página principal, obtendrás un **50% de descuento de por vida** aplicando el cupón **EDUPLOP50PREVENTA** para tu establecimiento.";
    } else if (textLower.includes("mural") || textLower.includes("foro") || textLower.includes("red social") || textLower.includes("comentar") || textLower.includes("foto") || textLower.includes("imagen") || textLower.includes("familia") || textLower.includes("social")) {
      return "📸 **Mural Familiar Protegido**: El Mural de EduPlop es una red social privada de la escuela para que los docentes compartan los progresos y trabajos de clase. Las familias reaccionan únicamente con emojis o palabras de aliento preseleccionadas en un entorno moderado y blindado.";
    } else if (textLower.includes("repositorio") || textLower.includes("archivo") || textLower.includes("boletin") || textLower.includes("boletín") || textLower.includes("informe") || textLower.includes("documento") || textLower.includes("excur") || textLower.includes("médic") || textLower.includes("medic") || textLower.includes("circula")) {
      return "📁 **Repositorio Digital Seguro**: EduPlop cuenta con un espacio protegido para guardar boletines oficiales, informes pedagógicos y autorizaciones médicas para excursiones, accesibles de manera 100% confidencial por las familias acreditadas.";
    } else if (textLower.includes("quien") || textLower.includes("que es") || textLower.includes("plop") || textLower.includes("robot") || textLower.includes("plopy") || textLower.includes("hola") || textLower.includes("buen") || textLower.includes("saludo") || textLower.includes("present")) {
      return "🤖 ¡Hola! Soy **Plopy**, tu simpático robot de servicio interactivo escolar de **EduPlop**. Estoy aquí para aclarar tus dudas técnicas y operativas sobre nuestra plataforma de retiro seguro y comunicación empática sustentados en la información de la página. ¿Qué te gustaría saber hoy?";
    } else if (textLower.includes("gracia") || textLower.includes("adios") || textLower.includes("chau") || textLower.includes("excelente") || textLower.includes("entendido")) {
      return "✨ ¡Es un placer enorme acompañarte! Si deseas experimentar EduPlop o congelar el 50% de descuento para tu colegio, pre-inscríbete completando el formulario. ¡Un gran saludo!";
    } else {
      return "🤖 Disculpa, como asistente oficial de **EduPlop** mi conocimiento está limitado estrictamente a la información institucional de producto contenida en esta página web (como el Retiro Seguro QR, la IA Empática, Privacidad de Datos, Integración SIS, Mural Familiar, Repositorio Seguro y la pre-venta del 50%). No dispongo de información específica sobre tu consulta externa.\n\n✍️ ¡Te invito cordialmente a **dejar tus datos en el formulario de pre-inscripción** al final de la página! De esta forma, un asesor comercial se comunicará contigo de inmediato para brindarte asesoría detallada y exclusiva.";
    }
  };

  const handleSendMessage = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;

    const userMsg: Message = {
      id: "user_" + Date.now().toString(36),
      role: "user",
      content: userPrompt,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setBotState("thinking");

    try {
      // Build chronological list of conversation history up to last 10 messages for safety & token limit context
      const chatHistory = messages.concat(userMsg).slice(-10).map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch(getApiUrl("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!res.ok) {
        throw new Error("Sincronización de asistente fallida con servidores.");
      }

      const data = await res.json();
      
      setBotState("talking");
      setMessages((prev) => [
        ...prev,
        {
          id: "bot_" + Date.now().toString(36),
          role: "assistant",
          content: data.reply || "He experimentado una breve fluctuación de antena. ¿Podrías volver a preguntarme?",
          timestamp: new Date()
        }
      ]);

      // Talk for 3 seconds, then return to idle state
      setTimeout(() => setBotState("idle"), 3000);

    } catch (err) {
      console.warn("⚠️ Servidor o red no disponible para chat. Iniciando fallback instantáneo con Plopy local:", err);
      
      try {
        const simulatedReply = getSimulatedChatReply(userPrompt);
        setBotState("talking");
        setMessages((prev) => [
          ...prev,
          {
            id: "bot_fb_" + Date.now().toString(36),
            role: "assistant",
            content: simulatedReply,
            timestamp: new Date()
          }
        ]);
        
        // Talk active animations for 3 seconds
        setTimeout(() => setBotState("idle"), 3000);
      } catch (fallbackErr) {
        console.error("❌ El fallback del chatbot también falló:", fallbackErr);
        setBotState("idle");
        setMessages((prev) => [
          ...prev,
          {
            id: "err_" + Date.now().toString(36),
            role: "assistant",
            content: "❌ Disculpa, perdí contacto momentáneo con mis sensores de red central. Intenta nuevamente por favor. Recuerda que puedes pre-inscribirte para recibir asesoría telefónica directa en el formulario.",
            timestamp: new Date()
          }
        ]);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Helper function to safely parse basic markdown highlights
  const renderMessageContent = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <strong key={index} className="font-extrabold text-indigo-950 bg-indigo-50 border-b border-indigo-100 px-0.5 rounded-xs">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* 1. Large Circular Toggle button dressed as Plopy Head */}
      {!isOpen && (
        <motion.button
          onClick={() => {
            setIsOpen(true);
            setHasNewMessage(false);
          }}
          className="cursor-pointer group relative flex flex-col items-center focus:outline-hidden"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          {/* Action Callout bubble */}
          <div className="absolute bottom-full mb-3.5 right-0 bg-slate-900 text-white text-[10px] font-bold px-3.5 py-2 rounded-2xl whitespace-nowrap shadow-xl border border-slate-700/80 tracking-wide pointer-events-none opacity-0 group-hover:opacity-100 transition duration-250 transform translate-y-2 group-hover:translate-y-0">
            💬 ¿Dudas? Asesoría Plopy IA
            {/* Tiny arrow */}
            <div className="absolute top-full right-6 transform -translate-y-0.5 border-4 border-transparent border-t-slate-900" />
          </div>

          {/* Attention dynamic pink circle border around robot */}
          {hasNewMessage && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 font-sans text-[8px] font-extrabold text-white items-center justify-center">1</span>
            </span>
          )}

          {/* Interactive animated robot visual */}
          <div className="bg-white border-2 border-slate-200 hover:border-indigo-300 p-2 rounded-full shadow-2xl transition duration-200">
            <PlopyAvatar state={botState} />
          </div>
        </motion.button>
      )}

      {/* 2. Full Embedded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-[350px] sm:w-[410px] h-[580px] max-h-[85vh] flex flex-col overflow-hidden relative"
          >
            {/* Upper Decorative Light element */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl -z-10" />

            {/* Header of Chat panel */}
            <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                {/* Robot visual avatar shrunk */}
                <div className="h-10 w-10 shrink-0 bg-slate-800 rounded-full border border-slate-700/80 p-0.5 overflow-hidden flex items-center justify-center">
                  <PlopyAvatar state={botState} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold leading-none tracking-tight">Plopy Asistente</span>
                    <span className="text-[8px] tracking-widest font-extrabold uppercase bg-indigo-500/30 text-indigo-300 border border-indigo-500/20 px-1 py-0.5 rounded-sm">IA</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Soporte en vivo sobre EduPlop</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chatbot Active warning banner regarding legal context */}
            <div className="bg-indigo-50/80 border-b border-indigo-100/50 px-4 py-2.5 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-indigo-950 font-medium leading-relaxed">
                Asesor oficial de **EduPlop**. Protegido conforme a normativas de seguridad de la información escolar y privacidad de datos de menores.
              </p>
            </div>

            {/* Scrollable Messages Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
              
              {messages.map((m) => {
                const isBot = m.role === "assistant";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${isBot ? "" : "flex-row-reverse"}`}
                  >
                    {/* Tiny visual badge */}
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs shrink-0 ${isBot ? "bg-slate-800 text-white" : "bg-indigo-600 text-white"}`}>
                      {isBot ? "🤖" : "👤"}
                    </div>

                    <div className={`max-w-[78%] rounded-2xl p-3.5 text-xs inline-block leading-relaxed ${
                      isBot 
                        ? "bg-white border border-slate-150 text-slate-800 shadow-3xs" 
                        : "bg-indigo-600 text-white shadow-3xs font-medium"
                    }`}>
                      <p className="whitespace-pre-line select-text">
                        {renderMessageContent(m.content)}
                      </p>
                      
                      <span className="block text-[8px] mt-1.5 opacity-60 text-right">
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loader animation for bot isThinking state */}
              {botState === "thinking" && (
                <div className="flex items-start gap-2.5">
                  <div className="h-6 w-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 animate-pulse">
                    🤖
                  </div>
                  <div className="bg-white border border-slate-150 rounded-2xl p-3 shadow-3xs text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                      <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                      <span className="text-[9px] text-slate-400 font-semibold ml-1">Plopy formulando...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested quick action FAQ chips */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-slate-100 bg-white space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Temas Sugeridos:</span>
                <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(s.text)}
                      className="cursor-pointer inline-flex items-center gap-1 bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 text-[10px] font-semibold text-slate-600 hover:text-indigo-800 px-2 py-1.5 rounded-xl transition duration-100"
                    >
                      <span>{s.icon}</span>
                      <span>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input field and trigger button */}
            <form onSubmit={handleFormSubmit} className="p-3 border-t border-slate-100 bg-white flex gap-2">
              <input
                type="text"
                required
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu consulta escolar..."
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all"
                disabled={botState === "thinking"}
              />
              <button
                type="submit"
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 flex items-center justify-center transition shrink-0 disabled:opacity-50"
                disabled={botState === "thinking" || !input.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
