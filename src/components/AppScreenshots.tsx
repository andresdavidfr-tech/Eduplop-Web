import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Smartphone, ShieldCheck, Mail, Calendar, Key, UserCheck, Eye, Sparkles, 
  Smile, Camera, Users, Clock, AlertCircle, Check, HelpCircle, Heart, Lock, 
  Send, ExternalLink 
} from "lucide-react";
import EduplopLogo from "./EduplopLogo";

interface ScreenDetailSpace {
  id: string;
  title: string;
  badge: string;
  shortDesc: string;
  benefitTitle: string;
  benefits: string[];
  legalHighlight?: string;
}

export default function AppScreenshots() {
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  // Custom data states for simulated screens to make them click-interactive!
  const [rsvpState, setRsvpState] = useState<"none" | "yes" | "maybe" | "no">("none");
  const [selectedChild, setSelectedChild] = useState("Mía Fernández · Sala Verde");
  const [selectedDelegate, setSelectedDelegate] = useState("Laura Fernández (Mamá)");
  const [authorizedRetiroList, setAuthorizedRetiroList] = useState<Array<{name: string, relation: string, date: string}>>([
    { name: "Laura Fernández", relation: "Madre", date: "Hoy" }
  ]);
  // Richer interactive Mural & Document states
  const [muralFeed, setMuralFeed] = useState([
    {
      id: "post-1",
      author: "Docente Pérez",
      role: "Sala Verde",
      time: "Hace 2 horas",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&facepad=2&w=80&h=80&q=80",
      caption: "¡Gran día en el jardín botánico de excursión! Descubrimos plantas aromáticas y bichitos nuevos. ¡Mía se divirtió mucho reconociendo las hojas!",
      images: [
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=200&h=280&q=80",
        "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=120&h=80&q=80",
        "https://images.unsplash.com/photo-1540479859555-17af45c78a90?auto=format&fit=crop&w=120&h=80&q=80"
      ],
      likes: 15,
      hasLiked: false,
      comments: [
        { author: "Carla (Mamá de Pedro)", text: "¡Qué bien la pasaron! Gracias por las fotos." }
      ]
    }
  ]);
  const [newCommentText, setNewCommentText] = useState("");
  const [customCaptionInput, setCustomCaptionInput] = useState("");
  const [showTeacherPanel, setShowTeacherPanel] = useState(false);
  const [docDownloads, setDocDownloads] = useState<Record<string, "descargar" | "descargando" | "completado">>({
    "boletin-1": "descargar",
    "autorizapaseo-1": "descargar",
    "fichamedica-1": "descargar"
  });

  const screens: ScreenDetailSpace[] = [
    {
      id: "login",
      title: "Acceso Seguro & Privacidad Familiar",
      badge: "Pilar 1: Seguridad & Acceso",
      shortDesc: "Punto de entrada unificado y cerrado para cada colegio. Nadie fuera de la comunidad escolar autorizada de forma explícita puede acceder a la información.",
      benefitTitle: "Paz mental desde el primer segundo:",
      benefits: [
        "Credenciales cerradas provistas por la dirección del establecimiento.",
        "Encriptación robusta de datos médicos, personales e identificadores.",
        "Separación total por salas y grados para evitar la visualización cruzada."
      ],
      legalHighlight: "Cumple con los estándares más estrictos de Protección de Datos Personales y privacidad estudiantil continental. Sin rastreadores comerciales de terceros."
    },
    {
      id: "messages",
      title: "Mensajería Directa & Eficiente",
      badge: "Pilar 2: Canales Fluidos",
      shortDesc: "Comunicación asertiva de dos vías que sustituye a los grupos caóticos de WhatsApp, centralizando las dudas de los padres de manera ordenada y respetuosa.",
      benefitTitle: "Interacciones enfocadas y optimizadas:",
      benefits: [
        "Estados claros de respuesta instantánea ('Respondido', 'Pendiente').",
        "Clasificación automatizada: por consultas de merienda, salud, o justificaciones.",
        "Asistente de Inteligencia Artificial que potencia el tono correcto, evitando fricciones."
      ],
      legalHighlight: "Respeta el derecho de desconexión docente fuera del horario escolar gracias al buzón programable."
    },
    {
      id: "agenda",
      title: "Agenda Escolar Colaborativa",
      badge: "Pilar 3: Calendario Activo",
      shortDesc: "Coordina reuniones de padres, talleres bimestrales, actos patrios y eventos con un clic para dar de alta confirmaciones de asistencia inmediatas.",
      benefitTitle: "Sincronización impecable de actividades:",
      benefits: [
        "Confirmación interactiva de asistencia ('Asistiré', 'Quizás', 'No puedo').",
        "Integración directa con Google Calendar, Microsoft Outlook y Apple iCal.",
        "Buzón de avisos preventivos para recordar qué llevar (ej: escarapela para el 9 de Julio)."
      ]
    },
    {
      id: "authorization",
      title: "Autorización de Retiro Instantánea",
      badge: "Pilar 4: Control de Puerta",
      shortDesc: "Los padres delegan el retiro de sus hijos con absoluta certeza. Genera un pase digital dinámico que se valida al instante con el personal de puerta.",
      benefitTitle: "Protocolo infalible de egreso:",
      benefits: [
        "Menú selector de niños autorizados por apoderado.",
        "Designa familiares de confianza de forma temporal o permanente.",
        "Añade observaciones como 'Salida anticipada' o 'Retiro por transporte escolar'."
      ],
      legalHighlight: "Garantiza el derecho a la privacidad familiar y la autonomía de tutoría del menor bajo estándares internacionales."
    },
    {
      id: "gatekeeper",
      title: "Panel de Puerta (Sincronizado)",
      badge: "Pilar 5: Escaneo de Seguridad",
      shortDesc: "Utilizado por inspectores y docentes en el portón del colegio. Escanea en tiempo real los pases de las familias mediante validaciones criptográficas firmadas.",
      benefitTitle: "Cero suplantación de identidad:",
      benefits: [
        "Sincronización instantánea de base de datos local respaldada en la nube.",
        "Criptografía Ed25519 para asegurar firmas digitales intransferibles.",
        "Elimina las planillas de papel, mitigando errores humanos en el egreso diario."
      ]
    },
    {
      id: "mural",
      title: "Mural de Actividades 'Sala Verde'",
      badge: "Pilar 6: Comunidad Escolar",
      shortDesc: "Un espacio interactivo diseñado exclusivamente para co-crear comunidad junto a padres y familias, en un ambiente libre de publicidad ni algoritmos externos. Los docentes cargan los trabajos y las familias interactúan.",
      benefitTitle: "Educación compartida y visible:",
      benefits: [
        "La educadora comparte de forma segura fotos del proceso y trabajos de los niños.",
        "Los padres reaccionan con emojis simpáticos o palabras de aliento preseleccionadas.",
        "Sección para simular la publicación docente directa: ¡Prueba a crear una publicación!"
      ],
      legalHighlight: "Garantía de consentimiento de imagen, protegiendo a los menores bajo estándares de privacidad familiar escolar."
    },
    {
      id: "documents",
      title: "Legajo Digital & Boletines",
      badge: "Pilar 7: Gestión Documental",
      shortDesc: "Accede de forma directa y privada a los boletines oficiales de notas de tus hijos, informes de orientación pedagógica y circulares con autorizaciones para descargar e imprimir.",
      benefitTitle: "Tu archivo escolar libre de papeles:",
      benefits: [
        "Boletines académicos cifrados asignados confidencialmente para cada familia.",
        "Descarga instantánea de autorizaciones para paseos, excursiones o fichas médicas.",
        "Acusa recibo digital directo reduciendo llamadas telefónicas e insistencias de secretaría."
      ],
      legalHighlight: "Consistente con los reglamentos de resguardo escolar digital de la Ley de Educación Nacional."
    }
  ];

  const handleAddCommentToPost = (postId: string, text: string, sender = "Tú (Apoderado)") => {
    if (!text.trim()) return;
    setMuralFeed(prevFeed => prevFeed.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { author: sender, text }]
        };
      }
      return post;
    }));
  };

  const handleLikePost = (postId: string) => {
    setMuralFeed(prevFeed => prevFeed.map(post => {
      if (post.id === postId) {
        const nextHasLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked: nextHasLiked,
          likes: nextHasLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const handleTeacherUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCaptionInput.trim()) return;
    const imagesArray = [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=200&h=280&q=80",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=200&h=280&q=80"
    ];
    // Pick image based on rotation or length
    const randomImage = imagesArray[muralFeed.length % imagesArray.length];

    const newPost = {
      id: `post-${Date.now()}`,
      author: "Tú (Docente)",
      role: "Sala Verde",
      time: "Ahora mismo",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&facepad=2&w=80&h=80&q=80",
      caption: `🎨 Trabajo de Arte: "${customCaptionInput}"`,
      images: [randomImage],
      likes: 1,
      hasLiked: true,
      comments: [
        { author: "Docente Pérez", text: "¡Publicado en la pizarra segura para familias!" }
      ]
    };
    setMuralFeed([newPost, ...muralFeed]);
    setCustomCaptionInput("");
    setShowTeacherPanel(false);
  };

  const startDocDownload = (docId: string) => {
    setDocDownloads(prev => ({ ...prev, [docId]: "descargando" }));
    setTimeout(() => {
      setDocDownloads(prev => ({ ...prev, [docId]: "completado" }));
    }, 1800);
  };

  return (
    <section id="app-tour" className="py-20 bg-slate-900 text-slate-100 overflow-hidden relative">
      {/* Visual background elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-coral-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title row */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/30">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Tour Interactivo de la Aplicación</span>
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Explora EduPlop desde adentro
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Haz clic en las pestañas para simular cada funcionalidad clave vista en nuestros smartphones de prueba y conoce los increíbles beneficios que esperan a tu comunidad.
          </p>
        </div>

        {/* Outer Split Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          
          {/* LEFT COLUMN: INTERACTIVE NAVIGATION TABS */}
          <div className="lg:col-span-5 space-y-3.5 order-2 lg:order-1">
            {screens.map((screen, idx) => {
              const isActive = idx === activeScreenIndex;
              return (
                <button
                  key={screen.id}
                  onClick={() => setActiveScreenIndex(idx)}
                  className={`w-full text-left p-4.5 rounded-2xl border text-slate-300 transition duration-150 flex items-start gap-4 cursor-pointer ${
                    isActive
                      ? "bg-slate-800 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/5"
                      : "bg-slate-850/40 border-slate-800 hover:bg-slate-800/40 hover:border-slate-750"
                  }`}
                >
                  {/* Miniature Indicator */}
                  <div className={`mt-1 shrink-0 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                    isActive ? "border-coral-500 text-coral-500 bg-coral-500/10" : "border-slate-600 text-slate-400"
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${
                        isActive ? "text-coral-400" : "text-slate-400"
                      }`}>
                        {screen.badge}
                      </span>
                    </div>
                    <h4 className={`text-base font-bold ${isActive ? "text-white" : "text-slate-200"}`}>
                      {screen.title}
                    </h4>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-slate-400 leading-relaxed pt-1"
                      >
                        {screen.shortDesc}
                      </motion.p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* MIDDLE COLUMN: CELL PHONE SIMULATION FRAME */}
          <div className="lg:col-span-4 flex justify-center mb-12 lg:mb-0 order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-[325px] rounded-[42px] border-[11px] border-slate-950 bg-slate-900 p-2 shadow-2xl shadow-black/80">
              
              {/* Phone speaker top bezel */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-20 flex items-center justify-center">
                <span className="w-10 h-1 bg-slate-800 rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-slate-900 rounded-full ml-2"></span>
              </div>

              {/* LIVE SIMULATOR CONTAINER */}
              <div className="relative overflow-hidden rounded-[34px] bg-slate-50 px-3.5 py-7.5 h-[530px] flex flex-col justify-between text-slate-800 select-none">
                
                {/* Simulated Header */}
                <div className="space-y-2 shrink-0">
                  <div className="flex items-center justify-between">
                    {/* Replicated Logo */}
                    <div className="flex items-center gap-1.5">
                      <EduplopLogo size={24} />
                      <div>
                        <h4 className="text-[11px] font-extrabold text-slate-900 leading-none">EduPlop</h4>
                        <span className="text-[8px] text-slate-400 block font-normal">Colegio San Martín</span>
                      </div>
                    </div>
                    
                    {/* Simulated Bell & Exit Buttons */}
                    <div className="flex items-center gap-1">
                      <div className="h-6 w-6 rounded-md bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-3xs cursor-pointer hover:bg-slate-50">
                        <span className="text-xs">🔔</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold cursor-pointer pl-1">Salir</span>
                    </div>
                  </div>

                  {/* Menu Tabs mimicking your layout */}
                  <div className="grid grid-cols-4 gap-1 border-b border-rose-50 pb-2">
                    <button
                      onClick={() => setActiveScreenIndex(1)}
                      className={`py-1 px-0.5 rounded-md flex flex-col items-center justify-center gap-0.5 transition cursor-pointer ${
                        activeScreenIndex === 1 ? "bg-indigo-600 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-[10px]">💬</span>
                      <span className="text-[8px] font-bold">Mensajes</span>
                    </button>
                    <button
                      onClick={() => setActiveScreenIndex(2)}
                      className={`py-1 px-0.5 rounded-md flex flex-col items-center justify-center gap-0.5 transition cursor-pointer ${
                        activeScreenIndex === 2 ? "bg-indigo-600 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-[10px]">📅</span>
                      <span className="text-[8px] font-bold">Agenda</span>
                    </button>
                    <button
                      onClick={() => setActiveScreenIndex(3)}
                      className={`py-1 px-0.5 rounded-md flex flex-col items-center justify-center gap-0.5 transition cursor-pointer ${
                        activeScreenIndex === 3 ? "bg-indigo-600 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-[10px]">🎫</span>
                      <span className="text-[8px] font-bold">Retiro</span>
                    </button>
                    <button
                      onClick={() => setActiveScreenIndex(5)}
                      className={`py-1 px-0.5 rounded-md flex flex-col items-center justify-center gap-0.5 transition cursor-pointer ${
                        activeScreenIndex === 4 || activeScreenIndex === 5 || activeScreenIndex === 6 ? "bg-indigo-600 text-white shadow-xs" : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-[10px]">🏫</span>
                      <span className="text-[8px] font-bold">Mural/Doc</span>
                    </button>
                  </div>
                </div>

                {/* Simulated Main Stage Scroll Container */}
                <div className="flex-grow overflow-y-auto py-3 space-y-2.5 scrollbar-thin">
                  <AnimatePresence mode="wait">
                    
                    {/* SCREEN 1: LOGIN APP */}
                    {activeScreenIndex === 0 && (
                      <motion.div
                        key="scr-login"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 pt-4 text-center"
                      >
                        <EduplopLogo size={46} className="mx-auto" />
                        <div>
                          <h3 className="text-xl font-bold tracking-tight text-indigo-900">EduPlop</h3>
                          <p className="text-[10px] font-medium text-slate-500">Hub de Experiencia Familiar</p>
                          <p className="text-[9px] text-slate-400">Colegio San Martín</p>
                        </div>

                        {/* Text form boxes */}
                        <div className="space-y-2 text-left px-1.5">
                          <div>
                            <span className="block text-[10px] font-bold text-slate-600 mb-0.5">Usuario</span>
                            <div className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-500">
                              ej. familia_sanmartin
                            </div>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-slate-600 mb-0.5">Contraseña</span>
                            <div className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 tracking-widest">
                              ••••••••
                            </div>
                          </div>
                        </div>

                        {/* Big button */}
                        <div className="px-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveScreenIndex(1)}
                            className="w-full rounded-xl bg-indigo-600 text-white py-2 text-xs font-bold shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition"
                          >
                            Ingresar
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* SCREEN 2: MESSAGES */}
                    {activeScreenIndex === 1 && (
                      <motion.div
                        key="scr-messages"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 pt-1 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-800">Mensajes con el colegio</span>
                          <span className="text-[8px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md font-bold">+ Nuevo</span>
                        </div>

                        {/* List of sample direct chats */}
                        <div className="bg-white p-2.5 rounded-xl shadow-3xs border border-slate-100 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-indigo-900 leading-tight">Consulta sobre la merienda</span>
                            <span className="text-[8px] bg-mint-100 text-mint-600 px-1 rounded-sm font-bold">Respondido</span>
                          </div>
                          <p className="text-[9px] text-slate-500 truncate">Consulta general • Mía Fernández</p>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl shadow-3xs border border-slate-100 space-y-1 opacity-75">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-indigo-900 leading-tight">Aviso de inasistencia médica</span>
                            <span className="text-[8px] bg-mint-100 text-mint-600 px-1 rounded-sm font-bold">Respondido</span>
                          </div>
                          <p className="text-[9px] text-slate-500 truncate">Inasistencia • Sala Verde</p>
                        </div>

                        {/* Chat interactive bubble mockup */}
                        <div className="bg-slate-100/60 p-2.5 rounded-xl border border-slate-150 text-[9px] space-y-1.5">
                          <p className="text-slate-450 uppercase font-bold text-[8px]">Historial de Chat:</p>
                          <div className="self-end bg-indigo-50 p-1.5 rounded-lg text-right text-[9px] max-w-[90%] ml-auto">
                            ¿Por qué no habrá clases el viernes?
                          </div>
                          <div className="self-start bg-white p-1.5 rounded-lg text-left text-[9px] max-w-[90%] border border-slate-100">
                            Estimadas familias: El viernes se llevará a cabo el Consejo de Evaluación Técnica Docente. ¡Saludos!
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* SCREEN 3: AGENDA OUTLOOK / CALENDAR */}
                    {activeScreenIndex === 2 && (
                      <motion.div
                        key="scr-agenda"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 pt-1 text-left"
                      >
                        <div>
                          <span className="text-slate-400 text-[8px] uppercase font-bold">Jueves, 4 de Junio</span>
                          <h4 className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                            📅 Reunión de Padres <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1 rounded-sm">Primer Trimestre</span>
                          </h4>
                          <p className="text-[9px] text-slate-500">Horario: 18:00 • Sala Verde y 1º A</p>
                        </div>

                        {/* Simulated Attendance RSVPs */}
                        <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs space-y-2">
                          <p className="text-[9px] text-slate-600 font-medium">¿Vas a asistir a esta reunión obligatoria?</p>
                          
                          <div className="grid grid-cols-3 gap-1">
                            <button
                              onClick={() => setRsvpState("yes")}
                              className={`text-[8px] font-bold py-1 px-1 rounded-md border text-center transition cursor-pointer ${
                                rsvpState === "yes" ? "bg-mint-500 border-mint-500 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              Asistiré
                            </button>
                            <button
                              onClick={() => setRsvpState("maybe")}
                              className={`text-[8px] font-bold py-1 px-1 rounded-md border text-center transition cursor-pointer ${
                                rsvpState === "maybe" ? "bg-amber-400 border-amber-400 text-slate-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              Quizás
                            </button>
                            <button
                              onClick={() => setRsvpState("no")}
                              className={`text-[8px] font-bold py-1 px-1 rounded-md border text-center transition cursor-pointer ${
                                rsvpState === "no" ? "bg-red-500 border-red-500 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              No puedo
                            </button>
                          </div>
                        </div>

                        {/* Calendar sync exports */}
                        <div className="space-y-1.5">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Agregar a mi Agenda Externa</span>
                          <div className="flex gap-1 justify-between bg-white p-1.5 rounded-xl border border-slate-150">
                            <span className="text-[8px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md cursor-pointer hover:bg-slate-200 flex items-center gap-1">
                              Google
                            </span>
                            <span className="text-[8px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md cursor-pointer hover:bg-slate-200 flex items-center gap-1">
                              Outlook
                            </span>
                            <span className="text-[8px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md cursor-pointer hover:bg-slate-200 flex items-center gap-1">
                              Apple .ics
                            </span>
                          </div>
                        </div>

                        {/* Acto Nacional */}
                        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-150 mt-1">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">11 de Junio • 10:00</span>
                          <p className="text-[10px] font-bold text-slate-800">Acto Conmemorativo del 9 de Julio</p>
                          <p className="text-[9px] text-slate-500 leading-none">Venir con escarapela y guardapolvo impecable en el patio.</p>
                        </div>
                      </motion.div>
                    )}

                    {/* SCREEN 4: AUTORIZAR RETIRO */}
                    {activeScreenIndex === 3 && (
                      <motion.div
                        key="scr-retiros"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 pt-1 text-left"
                      >
                        <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                          <p className="text-[9px] text-amber-800 leading-normal font-sans">
                            <strong>Pase de Retiro Seguro:</strong> Generá un pase temporal o permanente para que busquen a tu hijo/a en la puerta del colegio.
                          </p>
                        </div>

                        {/* Selectors */}
                        <div className="space-y-1.5">
                          <div>
                            <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase">¿A quién vas a retirar?</span>
                            <select
                              value={selectedChild}
                              onChange={(e) => setSelectedChild(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[9px] text-slate-700 font-semibold focus:outline-hidden"
                            >
                              <option>Mía Fernández · Sala Verde</option>
                              <option>Emiliano Fernández · Kinder B</option>
                            </select>
                          </div>

                          <div>
                            <span className="text-[8px] font-mono font-bold text-slate-400 block uppercase">¿Quién lo va a retirar?</span>
                            <select
                              value={selectedDelegate}
                              onChange={(e) => setSelectedDelegate(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-1 text-[9px] text-slate-700 font-semibold focus:outline-hidden"
                            >
                              <option>Laura Fernández (Madre)</option>
                              <option>Carlos Fernández (Abuelo)</option>
                              <option>Ignacio Díaz (Tío Autorizado)</option>
                            </select>
                          </div>
                        </div>

                        {/* Interactive dynamic QR code simulator */}
                        <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[8px] bg-indigo-600 text-white rounded px-1 py-0.2 font-mono uppercase font-bold">Pase Generado</span>
                            <p className="text-[9px] font-bold text-indigo-900 leading-none">ID: RET_77A9</p>
                            <p className="text-[8px] text-slate-500">Validez: Jueves 4 de Jun</p>
                          </div>

                          {/* Replicate QR pattern using neat flex layout with active laser scanner line */}
                          <div className="h-8 w-8 bg-slate-900 shrink-0 p-1 rounded-sm flex flex-wrap gap-0.5 relative overflow-hidden">
                            <div className="w-2 h-2 bg-white rounded-2xs"></div>
                            <div className="w-2 h-2 bg-white rounded-2xs"></div>
                            <div className="w-1.5 h-1.5 bg-indigo-500"></div>
                            <div className="w-1.5 h-1.5 bg-slate-100"></div>
                            <div className="w-2 h-2 bg-white rounded-2xs"></div>
                            <div className="w-2 h-2 bg-white rounded-2xs"></div>
                            
                            {/* Scanning moving line */}
                            <motion.div
                              animate={{ top: ["5%", "85%", "5%"] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_4px_#34d399] z-10 pointer-events-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* SCREEN 5: GATEKEEPER / PUERTA */}
                    {activeScreenIndex === 4 && (
                      <motion.div
                        key="scr-gatekeeper"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 pt-1 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-800">Puerta / Aula</span>
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-mint-500 animate-ping"></span>
                            <span className="text-[8px] text-mint-600 font-extrabold uppercase">● Conectado</span>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-2xl border border-slate-150 shadow-3xs space-y-2 relative overflow-hidden">
                          {/* Pulsing radar scanner ripple effect overlay representing movement */}
                          <div className="absolute right-3 top-3 w-8 h-8 rounded-full border border-indigo-100/60 flex items-center justify-center pointer-events-none">
                            <motion.div
                              animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                              className="w-4 h-4 rounded-full border border-indigo-500 absolute"
                            />
                            <div className="w-3 h-3 rounded-full bg-indigo-50 flex items-center justify-center text-[8px]">📷</div>
                          </div>

                          <p className="text-[10px] text-slate-800 pr-6">
                            Hola <strong>Doc. Pérez</strong>. Para entregar un alumno en la salida, escaneá el pase digital que muestra la familia.
                          </p>

                          <button 
                            type="button"
                            onClick={() => alert("Simulación: Abriendo escáner de cámara integrado desde el app de docente liderado por firmas Ed25519.")}
                            className="w-full py-2.5 rounded-xl bg-indigo-605 text-white bg-indigo-600 hover:bg-indigo-700 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden"
                          >
                            <Camera className="h-3.5 w-3.5" />
                            Escandear pase de retiro
                          </button>
                        </div>

                        {/* Crypo logs mimicking Screen 5 */}
                        <div className="p-2 rounded-xl bg-slate-900 text-[7px] text-slate-300 font-mono space-y-0.5">
                          <p className="text-emerald-400 font-bold">✓ Sincronización activa</p>
                          <p>SECURE KEY: Ed25519-Sign-Verified</p>
                          <p>BLOK_NUM: #20260610</p>
                        </div>
                      </motion.div>
                    )}

                    {/* SCREEN 6: MURAL SOCIAL */}
                    {activeScreenIndex === 5 && (
                       <motion.div
                         key="scr-mural"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         className="space-y-2 py-0 text-left"
                       >
                         <div className="flex items-center justify-between">
                           <div className="space-y-0.5">
                             <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Feed Seguro</span>
                             <h4 className="text-[10px] font-bold text-slate-800">Mural de Actividades - Sala Verde</h4>
                           </div>
                           
                           <button
                             type="button"
                             onClick={() => setShowTeacherPanel(!showTeacherPanel)}
                             className="text-[7.5px] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-extrabold cursor-pointer transition flex items-center gap-0.5"
                           >
                             <span>+</span>
                             <span>{showTeacherPanel ? "Cerrar" : "Docente: Subir"}</span>
                           </button>
                         </div>

                         {/* Teacher Panel Simulation */}
                         {showTeacherPanel && (
                           <motion.form
                             initial={{ opacity: 0, y: -5 }}
                             animate={{ opacity: 1, y: 0 }}
                             onSubmit={handleTeacherUpload}
                             className="bg-indigo-50 border border-indigo-100 p-2 rounded-lg space-y-1"
                           >
                             <span className="text-[7.5px] text-indigo-700 font-extrabold uppercase block">Pizarra del Docente</span>
                             <input
                               type="text"
                               required
                               value={customCaptionInput}
                               onChange={(e) => setCustomCaptionInput(e.target.value)}
                               placeholder="Ej: Pintura de manos, Modelado de arcilla..."
                               className="w-full bg-white border border-slate-200 text-[8px] rounded px-1.5 py-1 text-slate-800 focus:outline-hidden"
                             />
                             <div className="flex justify-between items-center">
                               <span className="text-[7px] text-slate-400 italic">Simulará fotos reales de clase...</span>
                               <button
                                 type="submit"
                                 className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[7.5px] px-2 py-0.5 rounded cursor-pointer animate-pulse"
                               >
                                 Publicar en Mural
                               </button>
                             </div>
                           </motion.form>
                         )}

                         {/* Stories/Categories list matching Screenshot 6 exactly */}
                         <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none leading-none">
                           <div className="flex-none w-[52px] text-center space-y-0.5">
                             <div className="relative h-[32px] w-[52px] rounded-md overflow-hidden border border-slate-150 shadow-3xs">
                               <img 
                                 src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=120&h=80&q=70"
                                 alt="Featured"
                                 className="w-full h-full object-cover"
                                 referrerPolicy="no-referrer"
                               />
                             </div>
                             <span className="text-[6.5px] text-slate-500 block font-semibold truncate">Juegos</span>
                           </div>
                           
                           <div className="flex-none w-[52px] text-center space-y-0.5">
                             <div className="relative h-[32px] w-[52px] rounded-md overflow-hidden border border-slate-150 shadow-3xs">
                               <img 
                                 src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=120&h=80&q=70"
                                 alt="Docentes"
                                 className="w-full h-full object-cover"
                                 referrerPolicy="no-referrer"
                               />
                             </div>
                             <span className="text-[6.5px] text-slate-500 block font-semibold truncate font-mono">Aula Abierta</span>
                           </div>

                           <div className="flex-none w-[52px] text-center space-y-0.5">
                             <div className="relative h-[32px] w-[52px] rounded-md overflow-hidden border border-slate-150 shadow-3xs">
                               <img 
                                 src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=120&h=80&q=70"
                                 alt="Mía"
                                 className="w-full h-full object-cover"
                                 referrerPolicy="no-referrer"
                               />
                               <div className="absolute bottom-0.5 right-0.5 bg-red-500 text-white text-[4px] h-2 w-2 rounded-full flex items-center justify-center">
                                 ❤️
                               </div>
                             </div>
                             <span className="text-[6.5px] text-slate-500 block font-semibold truncate">Mía F.</span>
                           </div>
                         </div>

                         {/* Mapped posts list */}
                         <div className="space-y-2 overflow-y-auto max-h-[195px] pr-0.5 scrollbar-thin">
                           {muralFeed.map(post => (
                             <div key={post.id} className="bg-white rounded-xl border border-slate-150 shadow-3xs overflow-hidden">
                               
                               {/* Post Header */}
                               <div className="p-1.5 pb-0.5 flex items-center gap-1.5">
                                 <img 
                                   src={post.avatar}
                                   alt={post.author}
                                   className="h-5.5 w-5.5 rounded-full border border-slate-150 object-cover"
                                   referrerPolicy="no-referrer"
                                 />
                                 <div className="leading-tight shrink-0">
                                   <p className="text-[7.5px] font-extrabold text-slate-900">{post.author}</p>
                                   <span className="text-[5.5px] text-slate-400 block font-medium">{post.time} • {post.role}</span>
                                 </div>
                                 <span className="ml-auto text-[6px] text-indigo-600 bg-indigo-50 px-1 rounded-sm font-mono uppercase font-bold">Seguro</span>
                               </div>

                               {/* Post text caption */}
                               <p className="px-1.5 text-[7px] text-slate-700 leading-tight font-sans pb-1 shrink-0">
                                 {post.caption}
                               </p>

                               {/* Grid images layout */}
                               <div className="grid grid-cols-12 gap-0.5 px-1.5 pb-1">
                                 {post.images.length === 1 && (
                                   <div className="col-span-12 h-[80px] rounded-md overflow-hidden border border-slate-150">
                                     <img 
                                       src={post.images[0]}
                                       alt="Excursión"
                                       className="w-full h-full object-cover"
                                       referrerPolicy="no-referrer"
                                     />
                                   </div>
                                 )}
                                 {post.images.length > 1 && (
                                   <>
                                     <div className="col-span-7 h-[85px] rounded-md overflow-hidden border border-slate-150">
                                       <img 
                                         src={post.images[0]}
                                         alt="Imagen primaria"
                                         className="w-full h-full object-cover"
                                         referrerPolicy="no-referrer"
                                       />
                                     </div>
                                     <div className="col-span-5 h-[85px] flex flex-col gap-0.5">
                                       <div className="h-[41px] rounded-md overflow-hidden border border-slate-150">
                                         <img 
                                           src={post.images[1]}
                                           alt="Imagen secundaria"
                                           className="w-full h-full object-cover"
                                           referrerPolicy="no-referrer"
                                         />
                                       </div>
                                       <div className="h-[41px] rounded-md overflow-hidden border border-slate-150 relative">
                                         <img 
                                           src={post.images[2] || post.images[0]}
                                           alt="Imagen terciaria"
                                           className="w-full h-full object-cover"
                                           referrerPolicy="no-referrer"
                                         />
                                         <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center text-white text-[7px] font-bold">
                                           +4
                                         </div>
                                       </div>
                                     </div>
                                   </>
                                 )}
                               </div>

                               {/* Family Quick Reactions Row */}
                               <div className="px-1.5 py-1 bg-slate-50 border-t border-b border-slate-100 flex items-center gap-1 overflow-x-auto scrollbar-none">
                                 <span className="text-[5.5px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Reacción rápida:</span>
                                 <button
                                   type="button"
                                   onClick={() => handleAddCommentToPost(post.id, "❤️ ¡Bello!", "Tú (Apoderado)")}
                                   className="text-[6.5px] whitespace-nowrap bg-white hover:bg-rose-50 border border-slate-150 rounded px-1 py-0.2 font-sans font-medium transition cursor-pointer"
                                 >
                                   ❤️ ¡Bello!
                                 </button>
                                 <button
                                   type="button"
                                   onClick={() => handleAddCommentToPost(post.id, "👏 ¡Maravilloso!", "Tú (Apoderado)")}
                                   className="text-[6.5px] whitespace-nowrap bg-white hover:bg-amber-50 border border-slate-150 rounded px-1 py-0.2 font-sans font-medium transition cursor-pointer"
                                 >
                                   👏 ¡Felicitar!
                                 </button>
                                 <button
                                   type="button"
                                   onClick={() => handleAddCommentToPost(post.id, "🥰 ¡Qué amor!", "Tú (Apoderado)")}
                                   className="text-[6.5px] whitespace-nowrap bg-white hover:bg-indigo-50 border border-slate-150 rounded px-1 py-0.2 font-sans font-medium transition cursor-pointer"
                                 >
                                   🥰 ¡Lindo!
                                 </button>
                               </div>

                               {/* Metrics */}
                               <div className="px-1.5 py-0.5 flex items-center justify-between text-[6.5px] text-slate-400">
                                 <button
                                   type="button"
                                   onClick={() => handleLikePost(post.id)}
                                   className="font-bold text-slate-600 flex items-center gap-0.5 hover:text-red-500 transition cursor-pointer"
                                 >
                                   <span>{post.hasLiked ? "❤️" : "🤍"}</span>
                                   <span>{post.likes}</span>
                                 </button>
                                 <span>{post.comments.length} comentarios</span>
                               </div>

                               {/* Comments loop */}
                               {post.comments.length > 0 && (
                                 <div className="p-1 px-1.5 bg-slate-50/50 border-t border-slate-100 space-y-0.5 max-h-[50px] overflow-y-auto scrollbar-none text-[6.5px]">
                                   {post.comments.map((comment, commentIdx) => (
                                     <div key={commentIdx} className="text-slate-605 leading-tight">
                                       <strong className="text-slate-800">{comment.author}:</strong> "{comment.text}"
                                      </div>
                                   ))}
                                 </div>
                               )}

                             </div>
                           ))}
                         </div>

                         {/* Main feed individual submit form */}
                         <form
                           onSubmit={(e) => {
                             e.preventDefault();
                             const form = e.currentTarget;
                             const input = form.elements.namedItem("mainComment") as HTMLInputElement;
                             if (input && input.value.trim()) {
                               handleAddCommentToPost("post-1", input.value);
                               input.value = "";
                             }
                           }}
                           className="flex gap-1 pt-1 border-t border-slate-100"
                         >
                           <input
                             name="mainComment"
                             type="text"
                             required
                             placeholder="Añade un comentario al mural..."
                             className="bg-white border border-slate-150 text-[7.5px] rounded-md px-2 py-0.5 flex-grow focus:outline-hidden"
                           />
                           <button
                             type="submit"
                             className="bg-indigo-600 text-white rounded px-2 py-0.5 text-[7px] font-bold hover:bg-indigo-700 transition cursor-pointer">
                              Enviar
                            </button>
                         </form>

                       </motion.div>
                     )}

                     {/* SCREEN 7: LEGAGO DOCUMENTAL / BOLETINES */}
                     {activeScreenIndex === 6 && (
                       <motion.div
                         key="scr-docs"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         className="space-y-3 pt-0 text-left"
                       >
                         <div className="space-y-0.5">
                           <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Legajo Familiar Confidencial</span>
                           <h4 className="text-[10px] font-bold text-slate-800 flex items-center justify-between">
                             <span>Carpeta de Documentos Seguros</span>
                             <span className="text-[6.5px] text-teal-600 bg-teal-50 px-1 py-0.2 rounded font-semibold tracking-wider font-mono">🔒 Encriptado</span>
                           </h4>
                         </div>

                         {/* Repository of documents */}
                         <div className="space-y-1.5">
                           
                           {/* Item 1: boletin */}
                           <div className="bg-white border border-slate-150 rounded-xl p-2 flex flex-col gap-1 shadow-3xs hover:border-slate-300 transition">
                             <div className="flex items-start justify-between gap-1">
                               <div className="space-y-0.5 min-w-0">
                                 <span className="text-[6px] uppercase font-bold text-coral-500 bg-coral-50 px-1 rounded-sm">Oficial</span>
                                 <p className="text-[8px] font-extrabold text-slate-800 leading-tight truncate">Boletín de Notas - 1º Bimestre.pdf</p>
                                 <p className="text-[6.5px] text-slate-400 font-mono">Tamaño: 1.4 MB • Emitido por Secretaría</p>
                               </div>
                               <span className="text-[8px] shrink-0">📄</span>
                             </div>
                             
                             <button
                               type="button"
                               onClick={() => startDocDownload("boletin-1")}
                               className={`w-full py-1 rounded text-[7px] font-bold transition text-center cursor-pointer ${
                                 docDownloads["boletin-1"] === "descargar"
                                   ? "bg-slate-900 text-white hover:bg-slate-800"
                                   : docDownloads["boletin-1"] === "descargando"
                                   ? "bg-indigo-600 text-white cursor-wait animate-pulse"
                                   : "bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default"
                               }`}
                             >
                               {docDownloads["boletin-1"] === "descargar" && "Descargar Boletín Académico (PDF)"}
                               {docDownloads["boletin-1"] === "descargando" && "Descargando... ⏳"}
                               {docDownloads["boletin-1"] === "completado" && "✓ Descargado / Imprimir Notas"}
                             </button>
                           </div>

                           {/* Item 2: autorization */}
                           <div className="bg-white border border-slate-150 rounded-xl p-2 flex flex-col gap-1 shadow-3xs hover:border-slate-300 transition">
                             <div className="flex items-start justify-between gap-1">
                               <div className="space-y-0.5 min-w-0">
                                 <span className="text-[6px] uppercase font-bold text-indigo-505 text-indigo-600 bg-indigo-50 px-1 rounded-sm">Imprimible</span>
                                 <p className="text-[8px] font-extrabold text-slate-800 leading-tight truncate">Autorización Excursión de Ciencia.pdf</p>
                                 <p className="text-[6.5px] text-slate-400 font-mono">Tamaño: 410 KB • Requiere Firma Física y Retorno</p>
                               </div>
                               <span className="text-[8px] shrink-0">📝</span>
                             </div>
                             
                             <button
                               type="button"
                               onClick={() => startDocDownload("autorizapaseo-1")}
                               className={`w-full py-1 rounded text-[7px] font-bold transition text-center cursor-pointer ${
                                 docDownloads["autorizapaseo-1"] === "descargar"
                                   ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                   : docDownloads["autorizapaseo-1"] === "descargando"
                                   ? "bg-indigo-400 text-white cursor-wait animate-pulse"
                                   : "bg-teal-50 text-teal-850 border border-teal-200 cursor-default"
                               }`}
                             >
                               {docDownloads["autorizapaseo-1"] === "descargar" && "Descargar y Generar para Imprimir"}
                               {docDownloads["autorizapaseo-1"] === "descargando" && "Guardando en dispositivo..."}
                               {docDownloads["autorizapaseo-1"] === "completado" && "✓ Generado para Imprimir (Impreso)"}
                             </button>
                           </div>

                           {/* Item 3: medical file */}
                           <div className="bg-white border border-slate-150 rounded-xl p-2 shadow-3xs">
                             <div className="flex items-center justify-between">
                               <div className="space-y-0.5">
                                 <p className="text-[8px] font-extrabold text-slate-800 leading-none">Ficha Médica Anual Obligatoria 2026.pdf</p>
                                 <p className="text-[6.5px] text-slate-400 font-mono">Tamaño: 820 KB • Legajo de Alumno Completo</p>
                               </div>
                               <span className="text-[7.5px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-mono">✓ Validado</span>
                             </div>
                           </div>

                         </div>

                         {/* Simulation upload form for parent signature */}
                         <div className="bg-slate-100 border border-slate-200 p-2 rounded-xl text-[7px] space-y-1">
                           <span className="font-extrabold text-slate-800 block uppercase">Subir Documento Firmado</span>
                           <p className="text-slate-505 text-slate-500 leading-normal">¿Ya imprimiste y firmaste tu autorización? Súbela aquí para enviarla al colegio de inmediato.</p>
                           
                           <button
                             type="button"
                             onClick={() => {
                               alert("Simulación: Seleccionando documento firmado desde la galería o archivos. El archivo es encriptado con clave local y transmitido con seguridad SSL.");
                             }}
                             className="w-full bg-white border border-dashed border-slate-350 hover:border-indigo-500 text-slate-650 hover:text-indigo-600 py-1.5 rounded font-bold text-center cursor-pointer transition"
                           >
                             📷 Escanear con Cámara o Subir PDF
                           </button>
                         </div>

                       </motion.div>
                     )}

                  </AnimatePresence>
                </div>

                {/* Floating IA assistant widget representation inside phone */}
                <motion.div 
                  animate={{
                    y: [0, -3, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 shrink-0"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-1.5 rounded-xl flex items-center justify-between text-[10px] shadow-md shadow-indigo-600/20">
                    <span className="flex items-center gap-1 font-semibold">
                      <Sparkles className="h-3 w-3 animate-pulse text-amber-300" />
                      Asistente Activo
                    </span>
                    <span className="text-[8px] bg-white/20 px-1 py-0.2 rounded-sm uppercase font-bold tracking-widest font-mono">
                      Gemini
                    </span>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: BENEFITS AND VALUE OF SELECTED ACTIVE SCREEN */}
          <div className="lg:col-span-3 space-y-6 order-3">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScreenIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Details header */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold text-coral-500 uppercase tracking-widest block">
                    {screens[activeScreenIndex].badge}
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    {screens[activeScreenIndex].title}
                  </h3>
                  <div className="h-1.5 w-12 bg-coral-500 rounded-full"></div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {screens[activeScreenIndex].shortDesc}
                </p>

                {/* Bullet list of major advantages */}
                <div className="space-y-3 pt-2">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {screens[activeScreenIndex].benefitTitle}
                  </span>
                  
                  <ul className="space-y-2 text-xs text-slate-300">
                    {screens[activeScreenIndex].benefits.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-mint-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal Framework integration (PRIVACY & COMPLIANCE STANDARDS) */}
                {screens[activeScreenIndex].legalHighlight && (
                  <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 p-3.5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-coral-400 font-bold">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Privacidad y Cumplimiento Legal</span>
                    </div>
                    <p className="text-[11px] text-slate-405 text-slate-400 leading-normal">
                      {screens[activeScreenIndex].legalHighlight}
                    </p>
                  </div>
                )}

                {/* Live Sandbox Interactive Pointer */}
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <p className="text-[11px] text-indigo-300 leading-normal">
                    💡 <strong>Tip Técnico:</strong> Esta pantalla simula el comportamiento real de la aplicación web de EduPlop hospedada en Vercel. ¡Haz clic en los botones del smartphone simulado para comprobar las reacciones!
                  </p>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

        {/* Footer block pointing to the real vercel link */}
        <div className="mt-16 text-center">
          <a
            href="https://eduplop.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 transition duration-150"
          >
            Probar todos estos flujos en el Demo En Vivo
            <ExternalLink className="h-4 w-4 text-indigo-300" />
          </a>
        </div>

      </div>
    </section>
  );
}
