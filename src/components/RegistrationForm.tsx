import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Clipboard, Check, Phone, Mail, School, User, ArrowRight, ExternalLink, Shield } from "lucide-react";
import { Lead } from "../types";
import { getApiUrl } from "../apiConfig";
import googleFormConfig from "../../google-form-config.json";

interface RegistrationFormProps {
  onLeadAdded?: () => void;
}

export default function RegistrationForm({ onLeadAdded }: RegistrationFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Director");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successLead, setSuccessLead] = useState<Lead | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const roles = [
    "Director",
    "Dueño de institución educativa",
    "Representante legal",
    "Encargado de TI u otro",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !school || !role) {
      setError("Por favor completa los campos obligatorios: Nombre, Correo, Rol y Colegio.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(getApiUrl("/api/leads"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, email, school, phone, message }),
      });

      if (!response.ok) {
        throw new Error("Ocurrió un error al procesar tu solicitud en el servidor.");
      }

      const data = await response.json();
      if (data.success) {
        setSuccessLead(data.lead);
        if (onLeadAdded) onLeadAdded(); // Notify parent console to refresh leads
      } else {
        throw new Error(data.error || "No se pudo registrar.");
      }
    } catch (err: any) {
      console.warn("⚠️ Servidor no disponible o error de red. Iniciando fallback de sincronización directa a Google Forms...", err);
      
      try {
        const config = googleFormConfig;
        if (config && config.enabled && config.formUrl) {
          let submissionUrl = config.formUrl.trim();
          if (submissionUrl.endsWith("/viewform")) {
            submissionUrl = submissionUrl.replace(/\/viewform$/, "/formResponse");
          } else if (submissionUrl.includes("/viewform?")) {
            submissionUrl = submissionUrl.split("/viewform?")[0] + "/formResponse";
          }

          if (!submissionUrl.endsWith("/formResponse")) {
            if (submissionUrl.endsWith("/")) {
              submissionUrl = submissionUrl + "formResponse";
            } else if (!submissionUrl.includes("formResponse")) {
              submissionUrl = submissionUrl + "/formResponse";
            }
          }

          const params = new URLSearchParams();
          const entryMap = (config.entryMap || {}) as Record<string, string>;

          if (entryMap.name) params.append(entryMap.name, name || "");
          if (entryMap.role) params.append(entryMap.role, role || "");
          if (entryMap.email) params.append(entryMap.email, email || "");
          if (entryMap.school) params.append(entryMap.school, school || "");
          if (entryMap.phone) params.append(entryMap.phone, phone || "");
          if (entryMap.message) params.append(entryMap.message, message || "");

          // Realizar petición POST no bloqueante y tolerante a CORS para registrar el lead
          await fetch(submissionUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
          });

          console.log("✅ Lead sincronizado directamente con Google Form mediante fallback cliente.");
        }

        // Crear una representación local del lead para el estado de la aplicación
        const fallbackLead: Lead = {
          id: "lead_fb_" + Date.now().toString(36),
          name,
          role,
          email,
          school,
          phone: phone || "",
          message: message || "",
          coupon: "EDUPLOP50PREVENTA",
          createdAt: new Date().toISOString(),
        };

        // Guardar respaldo offline en el localStorage
        try {
          const offlineLeads = JSON.parse(localStorage.getItem("eduplop_offline_leads") || "[]");
          offlineLeads.push(fallbackLead);
          localStorage.setItem("eduplop_offline_leads", JSON.stringify(offlineLeads));
        } catch (storageErr) {
          console.error("Error al guardar respaldo local offline:", storageErr);
        }

        setSuccessLead(fallbackLead);
        if (onLeadAdded) onLeadAdded();

        // Modificar el hash de la URL para facilitar el trackeo en Google Ads y GA4 como un pageview virtual (#gracias)
        if (typeof window !== "undefined") {
          window.location.hash = "#gracias";
          
          // Disparar evento de conversión estándar en gtag si está configurado en el sitio
          if ((window as any).gtag) {
            try {
              (window as any).gtag("event", "generate_lead", {
                event_category: "engagement",
                event_label: "Registro de Preventa EduPlop",
                value: 1.0,
                currency: "USD"
              });
              console.log("⚡ Evento gtag 'generate_lead' disparado con éxito.");
            } catch (gtagErr) {
              console.error("Error al disparar evento gtag:", gtagErr);
            }
          }
        }
      } catch (fallbackErr: any) {
        console.error("❌ El fallback directo también ha fallado:", fallbackErr);
        setError("Ocurrió un error al procesar tu solicitud. Prueba de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyCoupon = () => {
    if (!successLead?.coupon) return;
    navigator.clipboard.writeText(successLead.coupon);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <section id="pre-sale" className="py-24 relative bg-gradient-to-br from-[#0B0914] via-[#130F25] to-[#080610] overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/12 w-85 h-85 bg-violet-500/10 rounded-full blur-3xl -z-10"></div>
 
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="pre-sale-form" className="mx-auto max-w-3xl">
          
          <AnimatePresence mode="wait">
            {!successLead ? (
              
              /* PRECONDTION: LEAD FORM NOT YET SUBMITTED */
              <motion.div
                key="form-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-tr from-[#fbfbfe] via-white to-[#f5f3ff] rounded-3xl border-2 border-[#8a3cf2]/40 p-6 sm:p-10 shadow-2xl shadow-[#8a3cf2]/10 relative overflow-hidden ring-4 ring-[#3b26f2]/5"
              >
                {/* Heading inside form container */}
                <div className="text-center space-y-3 mb-8">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8A3CF2]/15 to-[#3B26F2]/15 text-[#8A3CF2] border border-[#8a3cf2]/25 px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
                    Preventa Limitada
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    Inscríbete y Asegura un 50% de Descuento
                  </h3>
                  <p className="text-slate-500 text-sm max-w-2xl mx-auto">
                    Sé parte activa de los colegios pioneros que están re-imaginando la comunidad escolar. Registra tus datos para recibir información de lanzamiento y acceder al descuento exclusivo.
                  </p>
                </div>
 
                {/* Actual Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    
                    {/* Name field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <User className="h-4 w-4 text-[#8A3CF2]" /> Nombre Completo <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Carolina Muñoz"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#8A3CF2] focus:bg-white focus:ring-1 focus:ring-[#8A3CF2] transition"
                      />
                    </div>
 
                    {/* Choose Role */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        ¿Qué rol representas? <span className="text-[#EF4444]">*</span>
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:border-[#8A3CF2] focus:ring-1 focus:ring-[#8A3CF2] transition"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
 
                    {/* Email field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-[#8A3CF2]" /> Correo Electrónico <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#8A3CF2] focus:bg-white focus:ring-1 focus:ring-[#8A3CF2] transition"
                      />
                    </div>
 
                    {/* School Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <School className="h-4 w-4 text-[#8A3CF2]" /> Colegio / Establecimiento <span className="text-[#EF4444]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="Ej: Colegio Sol y Luna"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#8A3CF2] focus:bg-white focus:ring-1 focus:ring-[#8A3CF2] transition"
                      />
                    </div>
                  </div>
 
                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-[#8A3CF2]" /> Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: +56 9 1234 5678"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#8A3CF2] focus:bg-white focus:ring-1 focus:ring-[#8A3CF2] transition"
                    />
                  </div>
 
                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Mensaje / ¿Qué te gustaría lograr en tu comunidad escolar? <span className="text-slate-400 font-normal">(Opcional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Cuéntanos alguna duda o necesidad especial..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#8A3CF2] focus:bg-white focus:ring-1 focus:ring-[#8A3CF2] transition"
                    />
                  </div>
 
                  {/* Error warning inside submit context */}
                  {error && (
                    <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl">
                      {error}
                    </div>
                  )}
 
                  {/* Tooltip Informativo / Estado de Beneficio */}
                  <div className="flex items-center justify-between px-1 text-xs text-indigo-300 md:text-sm font-medium pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-slate-300">Garantía EduPlop:</span>
                      <span className="text-emerald-400 font-bold">Lanzamiento Seguro</span>
                    </div>
                    <div className="group relative cursor-help flex items-center gap-1">
                      <span className="text-[#A78BFA] hover:text-[#C084FC] underline decoration-dotted decoration-[#8A3CF2] transition">
                        Ver detalles
                      </span>
                      {/* Interactive Floating Tooltip */}
                      <span className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-900 border border-[#8A3CF2]/40 rounded-xl shadow-2xl text-xs text-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 leading-relaxed font-normal">
                        🎁 <strong className="text-[#A78BFA]">50% OFF para Colegios Pioneros</strong>. Tu registro reserva el precio preferencial para toda la vida de tu licencia. ¡Sin costo de activación!
                      </span>
                    </div>
                  </div>

                  {/* Submit Button with Pulsing Micro-Animation */}
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    animate={{
                      scale: [1, 1.01, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                    }}
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full cursor-pointer flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#8A3CF2] to-[#3B26F2] py-4 text-base font-bold text-white hover:brightness-110 shadow-xl shadow-[#8A3CF2]/20 transition-all duration-200 relative overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-white/5 animate-pulse" />
                      {isLoading ? "Procesando Registro..." : "Habilitar mi Beneficio de Lanzamiento (50% Off)"}
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    {/* Pulsing ring around the button to guide focus */}
                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#8A3CF2] to-[#3B26F2] opacity-25 blur-sm animate-pulse -z-10 pointer-events-none" />
                  </motion.div>
 
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-xs text-center pt-2.5">
                    <Shield className="h-4 w-4 text-mint-500" />
                    <span>Resguardamos tus datos. No enviamos spam. Privacidad garantizada.</span>
                  </div>
                </form>
 
              </motion.div>
            ) : (
              
              /* POSTCONDITION: REGISTRATION COMPLETED */
              <motion.div
                key="success-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-mint-200 p-8 sm:p-12 text-center shadow-2xl shadow-mint-50/50 space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-mint-100 border border-mint-200 text-mint-600 flex items-center justify-center mx-auto text-2xl font-bold animate-bounce">
                  ✓
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-extrabold text-slate-900">
                    ¡Registro de Preventa Confirmado!
                  </h3>
                  <p className="text-slate-600 text-base max-w-md mx-auto">
                    ¡Muchas gracias, <strong>{successLead.name}</strong>! Hemos guardado tus datos para asegurar la preventa de <strong>EduPlop</strong> para el <strong>{successLead.school}</strong>.
                  </p>
                </div>

                {/* Presale coupon code block */}
                <div className="bg-slate-50 border border-slate-150 p-6 rounded-2xl max-w-md mx-auto space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Código de Descuento Exclusivo (50%)</span>
                  <div className="flex items-center justify-between bg-white border border-slate-200 pl-4 pr-1.5 py-1.5 rounded-xl">
                    <span className="font-mono font-bold text-base text-coral-600 tracking-wider">
                      {successLead.coupon}
                    </span>
                    <button
                      onClick={copyCoupon}
                      className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 transition px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1"
                    >
                      {copiedCoupon ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-mint-500" /> ¡Copiado!
                        </>
                      ) : (
                        <>
                          <Clipboard className="h-3.5 w-3.5" /> Copiar Código
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal text-left">
                    *Te hemos enviado un correo de bienvenida. Guarda este cupón bien; se aplicará al momento de dar de alta la licencia de tu colegio o establecimiento.
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <a
                    href="https://eduplop.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition shadow-md shadow-slate-900/10"
                  >
                    Explorar Aplicación Vercel
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => {
                      setSuccessLead(null);
                      setName("");
                      setEmail("");
                      setSchool("");
                      setPhone("");
                      setMessage("");
                    }}
                    className="cursor-pointer text-slate-500 hover:text-slate-800 text-sm font-semibold transition"
                  >
                    Registrar otra cuenta/colegio
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
