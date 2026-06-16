import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ShieldCheck, Key, RefreshCw, HelpCircle, EyeOff, Smile, FileText } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      category: "Seguridad",
      question: "¿Cómo garantizan la seguridad en el retiro de los alumnos?",
      answer: "Utilizamos pases digitales dinámicos firmados criptográficamente (con curvas ED25519) que cambian periódicamente. El docente escanea el código desde la app y nuestra plataforma lo valida instantáneamente a nivel de servidor. Esto erradica el riesgo de suplantación de identidad y credenciales falsas.",
      icon: <Key className="h-4 w-4 text-indigo-500" />,
    },
    {
      category: "Privacidad",
      question: "¿Qué medidas de privacidad aplican para los datos curriculares y de menores?",
      answer: "La privacidad de tus chicos es nuestra prioridad absoluta. Toda la información personal está completamente encriptada (AES-256 en reposo y TLS 1.3 en tránsito). Cumplimos estrictamente las normativas internacionales de protección de datos menores de edad (COPPA y GDPR) y jamás comercializamos ni exponemos perfiles públicos de estudiantes.",
      icon: <EyeOff className="h-4 w-4 text-rose-500" />,
    },
    {
      category: "Integración",
      question: "¿EduPlop se integra directamente con plataformas escolares existentes?",
      answer: "Sí, de forma transparente. Contamos con conectores API estándar y automatizaciones para sincronizar datos con los principales sistemas de gestión escolar (SIS) y bases de datos tradicionales. Esto permite una transición fluida y evita la carga doble de listas de alumnos, cursos o apoderados.",
      icon: <RefreshCw className="h-4 w-4 text-amber-500" />,
    },
    {
      category: "Infraestructura",
      question: "¿Qué pasa si hay mala señal móvil o corte de internet en las salidas?",
      answer: "Nuestra aplicación móvil cuenta con un potente modo de sincronización híbrida local ('Offline-First'). Los pases de retiro autorizados pueden confirmarse con firmas criptográficas sin conexión activa a internet. En cuanto se recupere la señal, el historial se consolida automáticamente hacia el servidor central.",
      icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />,
    },
    {
      category: "Comunicación",
      question: "¿Cómo funciona el asistente de IA para redactar comunicados con empatía?",
      answer: "EduPlop integra de manera nativa modelos avanzados de IA (Gemini). Cuando redactas un comunicado directivo urgente (por ejemplo, suspensión de clases o aviso meteorológico), la IA puede analizar y sugerir correcciones de tono en tiempo real para mantenerlo empático, claro, libre de ambigüedades y tranquilizador para las familias.",
      icon: <HelpCircle className="h-4 w-4 text-indigo-500" />,
    },
    {
      category: "Mural Familiar",
      question: "¿Qué es el Mural Interactivo y cómo promueve una red social escolar segura?",
      answer: "El Mural de EduPlop es un espacio completamente protegido para compartir los progresos y trabajos de los alumnos realizados en clase por los docentes. Las familias pueden ver imágenes reales de las actividades, reaccionar con emojis o palabras de aliento preestablecidas y comentar en un entorno cerrado y moderado. Esto crea un sentido profundo de comunidad y pertenencia familiar similar a una red social, pero blindada de publicidad, algoritmos externos y con estricto consentimiento de imagen de menores.",
      icon: <Smile className="h-4 w-4 text-amber-500" />,
    },
    {
      category: "Documentos",
      question: "¿Es posible gestionar boletines de calificaciones y autorizaciones imprimibles?",
      answer: "Sí, absolutamente. EduPlop cuenta con un repositorio digital seguro para cada familia. La administración académica o los docentes pueden cargar boletines oficiales, informes pedagógicos específicos y documentos imprimibles (como la autorización médica para excursiones o salidas didácticas). Los padres se notifican, acceden y descargan estos archivos de manera 100% personalizada y confidencial, eliminando la pérdida de circulares físicas.",
      icon: <FileText className="h-4 w-4 text-coral-500" />,
    }
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50/50 border-t border-slate-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 select-none">
            🛡️ Transparencia & Confianza
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Preguntas Frecuentes
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-sans">
            Todo lo que los directivos de colegio y las familias necesitan saber sobre el ecosistema seguro de EduPlop.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqItems.map((item, index) => {
            const isExpanded = activeIndex === index;
            return (
              <div
                key={index}
                className="bg-white border rounded-2xl transition-all duration-200 shadow-sm"
                style={{
                  borderColor: isExpanded ? "#c7d2fe" : "#f1f5f9"
                }}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left px-5 sm:px-6 py-4.5 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest sm:border-r sm:border-slate-100 sm:pr-3 shrink-0">
                        {item.category}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 tracking-tight leading-snug">
                        {item.question}
                      </span>
                    </div>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="text-slate-400 shrink-0"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>

                {/* Animated Collapsible Answer panel */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs text-slate-600 sm:pl-[74px] leading-relaxed font-sans border-t border-slate-50">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
