import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, ArrowLeft, Clipboard, Check, Calendar, ShieldCheck, Heart, Sparkles, Building, User, Mail, MessageSquare } from "lucide-react";

interface QuoteSuccessPageProps {
  onBackToHome: () => void;
}

export default function QuoteSuccessPage({ onBackToHome }: QuoteSuccessPageProps) {
  const [quoteDetails, setQuoteDetails] = useState<{
    name: string;
    school: string;
    email: string;
    phone: string;
    studentsCount: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Scroll to top immediately when landing
    window.scrollTo(0, 0);

    // Retrieve the quote details stored in localStorage
    const saved = localStorage.getItem("eduplop_last_quote");
    if (saved) {
      try {
        setQuoteDetails(JSON.parse(saved));
      } catch (e) {
        console.error("Error al decodificar detalles de cotización de localStorage:", e);
      }
    }

    // Trigger Google Ads config page view specifically for this route
    if (typeof window !== "undefined" && (window as any).gtag) {
      try {
        (window as any).gtag("config", "AW-18266104131", {
          page_path: "/gracias-presupuesto"
        });
        console.log("⚡ Conversión de Google Ads registrada para /gracias-presupuesto");
      } catch (err) {
        console.error("Error al registrar evento en gtag:", err);
      }
    }
  }, []);

  const copyCoupon = () => {
    navigator.clipboard.writeText("EDUPLOP50PREVENTA");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
      
      {/* Decorative grids and organic blur spheres to reflect professional medical blue and technological purples */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 -z-10" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#8A3CF2]/15 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl -z-10" />

      {/* Main Content Area */}
      <div className="flex-grow max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative z-10">
        
        {/* Navigation back */}
        <div className="w-full text-left mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-semibold transition cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition duration-150" />
            Volver al inicio
          </button>
        </div>

        {/* Success Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full bg-gradient-to-br from-[#10142A] via-[#120F25] to-[#0A0713] rounded-3xl border border-blue-500/30 p-8 md:p-12 shadow-2xl shadow-blue-950/20 text-center relative overflow-hidden"
        >
          {/* Subtle top indicator bar representing health-blue & alert-red accents */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-[#8A3CF2] to-rose-500" />
          
          {/* Animated circular badge */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 border-2 border-blue-400/30 text-blue-400 mb-8 animate-pulse shadow-lg shadow-blue-500/10">
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/25 px-4 py-1 text-xs font-bold uppercase tracking-wider mb-4 shadow-inner">
            Registro de Conversión Exitoso
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            ¡Tu Solicitud de Presupuesto ha sido Procesada con Éxito!
          </h1>
          
          {/* Empathetic & Firm Intro Section (Aligns with specific professional tone guidelines) */}
          <div className="max-w-2xl mx-auto mt-6 text-left border-l-4 border-rose-500 bg-rose-500/5 px-5 py-4 rounded-r-2xl mb-8">
            <p className="text-sm text-slate-300 italic leading-relaxed">
              &ldquo;Entendemos profundamente el cansancio y la presión constante que representa liderar una institución hoy. Coordinar la salida de cientos de alumnos, gestionar alertas de seguridad urgentes y lidiar con la dispersión en los chats de apoderados es una carga extenuante que drena la energía de tu equipo.&rdquo;
            </p>
            <p className="text-sm text-white font-semibold mt-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Por eso creamos EduPlop: Seguridad robusta, IA para comunicación y tranquilidad total.
            </p>
          </div>

          {/* Dynamic Details block */}
          {quoteDetails && (
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 max-w-2xl mx-auto text-left space-y-4 mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                Resumen de Solicitud de Cotización
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <User className="h-4.5 w-4.5 text-blue-400 flex-shrink-0" />
                  <span><strong>Nombre:</strong> {quoteDetails.name}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Building className="h-4.5 w-4.5 text-blue-400 flex-shrink-0" />
                  <span><strong>Colegio:</strong> {quoteDetails.school}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Mail className="h-4.5 w-4.5 text-blue-400 flex-shrink-0" />
                  <span><strong>Email:</strong> {quoteDetails.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Calendar className="h-4.5 w-4.5 text-blue-400 flex-shrink-0" />
                  <span><strong>Alumnos:</strong> {quoteDetails.studentsCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps Grid (Professional, secure and technical) */}
          <div className="max-w-2xl mx-auto text-left space-y-4 mb-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              ¿Qué pasará a continuación?
            </h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-400/20 text-blue-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Diseño del Presupuesto</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Analizamos la cantidad de estudiantes ({quoteDetails?.studentsCount || "tu colegio"}) para estructurar una cotización balanceada y justa.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#8A3CF2]/10 border border-[#8A3CF2]/20 text-[#A78BFA] flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Contacto Directo</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Un asesor especializado te enviará la propuesta oficial al correo <span className="text-slate-300">{quoteDetails?.email || "registrado"}</span> con el 50% de descuento de lanzamiento aplicado de por vida.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Golden/Indigo Promo Code Card */}
          <div className="max-w-xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-[#120e24] border border-[#8A3CF2]/40 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="text-center space-y-1 mb-4">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">Código de Reserva Activado</span>
              <h4 className="text-base font-bold text-white">Cupón de Lanzamiento Exclusivo</h4>
              <p className="text-xs text-slate-400">Este cupón ha quedado adjunto a tu cotización para congelar un 50% de descuento vitalicio.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-950/90 p-3.5 rounded-xl border border-slate-800/80 justify-between">
              <code className="text-base font-mono font-bold text-emerald-400 tracking-widest bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
                EDUPLOP50PREVENTA
              </code>
              <button
                onClick={copyCoupon}
                className="w-full sm:w-auto cursor-pointer text-xs font-bold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2.5 rounded-lg border border-indigo-500/20 flex items-center justify-center gap-1.5 transition duration-150"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400 animate-bounce" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="h-4 w-4" />
                    <span>Copiar Cupón</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Close back button */}
          <div className="mt-10">
            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-bold text-white hover:brightness-110 shadow-lg shadow-blue-500/15 transition-all duration-150"
            >
              Volver a la Página Principal
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </button>
          </div>

        </motion.div>

        {/* Safety trust badge footer */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <span>Encriptación Bancaria de Datos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-rose-500" />
            <span>Comprometidos con la Salud Emocional y Física Escolar</span>
          </div>
        </div>

      </div>
    </div>
  );
}
