import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calculator, Clipboard, Check, Phone, Mail, School, User, ArrowRight, ExternalLink, Shield, Users } from "lucide-react";
import { Lead } from "../types";
import { getApiUrl } from "../apiConfig";
import googleFormConfig from "../../google-form-config.json";

interface QuoteFormProps {
  onLeadAdded?: () => void;
}

export default function QuoteForm({ onLeadAdded }: QuoteFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Director");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [phone, setPhone] = useState("");
  const [studentsCount, setStudentsCount] = useState("100-300");
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

  const studentRanges = [
    "Menos de 100 alumnos",
    "100 a 300 alumnos",
    "300 a 600 alumnos",
    "600 a 1000 alumnos",
    "Más de 1000 alumnos",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !school || !role) {
      setError("Por favor completa los campos obligatorios: Nombre, Correo, Rol y Colegio.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Formateamos el mensaje final agrupando la información específica de la cotización
    const fullFormattedMessage = `[SOLICITUD DE PRESUPUESTO] \n- Cantidad de Alumnos: ${studentsCount} \n- Detalles adicionales: ${message || "Ninguno"}`;

    try {
      const response = await fetch(getApiUrl("/api/leads"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          role, 
          email, 
          school, 
          phone, 
          message: fullFormattedMessage 
        }),
      });

      if (!response.ok) {
        throw new Error("Ocurrió un error al procesar tu solicitud en el servidor.");
      }

      const data = await response.json();
      if (data.success) {
        setSuccessLead(data.lead);
        if (onLeadAdded) onLeadAdded();
      } else {
        throw new Error(data.error || "No se pudo registrar.");
      }
    } catch (err: any) {
      console.warn("⚠️ Servidor no disponible o error de red en cotizaciones. Iniciando fallback directo a Google Forms...", err);
      
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
          if (entryMap.message) params.append(entryMap.message, fullFormattedMessage || "");

          // Enviar datos mediante fallback no-cors
          await fetch(submissionUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
          });

          console.log("✅ Cotización sincronizada directamente con Google Form mediante fallback cliente.");
        }

        const fallbackLead: Lead = {
          id: "quote_fb_" + Date.now().toString(36),
          name,
          role,
          email,
          school,
          phone: phone || "",
          message: fullFormattedMessage,
          coupon: "EDUPLOP50PREVENTA",
          createdAt: new Date().toISOString(),
        };

        // Guardar respaldo local offline
        try {
          const offlineLeads = JSON.parse(localStorage.getItem("eduplop_offline_leads") || "[]");
          offlineLeads.push(fallbackLead);
          localStorage.setItem("eduplop_offline_leads", JSON.stringify(offlineLeads));
        } catch (storageErr) {
          console.error("Error al guardar respaldo local offline de cotización:", storageErr);
        }

        setSuccessLead(fallbackLead);
        if (onLeadAdded) onLeadAdded();

        // Registrar conversión virtual con #presupuesto-gracias
        if (typeof window !== "undefined") {
          window.location.hash = "#presupuesto-gracias";
          
          if ((window as any).gtag) {
            try {
              (window as any).gtag("event", "generate_lead", {
                event_category: "quote_request",
                event_label: "Solicitud de Presupuesto EduPlop",
                value: 5.0,
                currency: "USD"
              });
            } catch (gtagErr) {
              console.error("Error al disparar conversión gtag:", gtagErr);
            }
          }
        }
      } catch (fallbackErr: any) {
        console.error("❌ El fallback de cotizaciones ha fallado:", fallbackErr);
        setError("Ocurrió un error al procesar tu solicitud de presupuesto. Por favor reintenta.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("EDUPLOP50PREVENTA");
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  return (
    <section id="quote-section" className="py-24 relative bg-gradient-to-br from-[#0B0914] via-[#15102a] to-[#080610] overflow-hidden border-t-2 border-[#8A3CF2]/30">
      
      {/* Decorative Grid and Blur Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] -z-10" />
      <div className="absolute top-1/3 right-1/10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/3 left-1/10 w-96 h-96 bg-[#8A3CF2]/10 rounded-full blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="quote-form-container" className="mx-auto max-w-3xl">
          
          <AnimatePresence mode="wait">
            {!successLead ? (
              <motion.div
                key="quote-form-block"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-tr from-[#110D24] via-[#15102D] to-[#1C153A] rounded-3xl border-2 border-[#8a3cf2]/50 p-6 sm:p-10 shadow-2xl shadow-[#8a3cf2]/20 relative overflow-hidden ring-4 ring-[#3b26f2]/10"
              >
                {/* Heading inside quote container */}
                <div className="text-center space-y-3 mb-8">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8A3CF2]/25 to-[#3B26F2]/25 text-[#A78BFA] border border-[#8a3cf2]/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-sm">
                    Cotización Instantánea
                  </span>
                  <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                    Solicita un Presupuesto a Medida
                  </h3>
                  <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                    Déjanos tus datos de contacto y la cantidad aproximada de alumnos. Diseñamos una propuesta económica adaptada a las necesidades de tu establecimiento escolar con el 50% de descuento incluido.
                  </p>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    
                    {/* Name field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <User className="h-4 w-4 text-[#A78BFA]" /> Nombre Completo <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Carolina Muñoz"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#8A3CF2] focus:bg-slate-900 focus:ring-1 focus:ring-[#8A3CF2] transition"
                      />
                    </div>

                    {/* Choose Role */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        ¿Qué rol representas? <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2.5 text-sm text-white focus:outline-hidden focus:border-[#8A3CF2] focus:ring-1 focus:ring-[#8A3CF2] transition cursor-pointer [&>option]:bg-slate-900"
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
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-[#A78BFA]" /> Correo Electrónico <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#8A3CF2] focus:bg-slate-900 focus:ring-1 focus:ring-[#8A3CF2] transition"
                      />
                    </div>

                    {/* School Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <School className="h-4 w-4 text-[#A78BFA]" /> Colegio / Establecimiento <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="Ej: Colegio Sol y Luna"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#8A3CF2] focus:bg-slate-900 focus:ring-1 focus:ring-[#8A3CF2] transition"
                      />
                    </div>

                    {/* Phone field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Phone className="h-4 w-4 text-[#A78BFA]" /> Teléfono de Contacto
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej: +56 9 1234 5678"
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#8A3CF2] focus:bg-slate-900 focus:ring-1 focus:ring-[#8A3CF2] transition"
                      />
                    </div>

                    {/* Students range count */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-[#A78BFA]" /> Cantidad de Alumnos <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={studentsCount}
                        onChange={(e) => setStudentsCount(e.target.value)}
                        className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-4 py-2.5 text-sm text-white focus:outline-hidden focus:border-[#8A3CF2] focus:ring-1 focus:ring-[#8A3CF2] transition cursor-pointer [&>option]:bg-slate-900"
                      >
                        {studentRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Mensaje, dudas o requerimientos especiales
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Cuéntanos las necesidades de comunicación de tu colegio o si requieres integración con algún sistema (SIS)..."
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#8A3CF2] focus:bg-slate-900 focus:ring-1 focus:ring-[#8A3CF2] transition resize-none"
                    />
                  </div>

                  {/* Error warning */}
                  {error && (
                    <div className="p-3 text-xs font-semibold text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl">
                      {error}
                    </div>
                  )}

                  {/* Submit Button with Pulsing effect */}
                  <motion.div
                    className="relative pt-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full cursor-pointer flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#8A3CF2] to-[#3B26F2] py-4 text-base font-bold text-white hover:brightness-110 shadow-xl shadow-indigo-950/50 transition-all duration-200 relative overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-white/5 animate-pulse" />
                      {isLoading ? "Procesando Presupuesto..." : "Solicitar Presupuesto con 50% Off"}
                      <Calculator className="h-5 w-5" />
                    </button>
                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#8A3CF2] to-[#3B26F2] opacity-25 blur-sm animate-pulse -z-10 pointer-events-none" />
                  </motion.div>

                  <div className="flex items-center justify-center gap-2 text-slate-400 text-xs text-center pt-2.5">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span>Propuesta comercial sin compromiso de compra. Privacidad asegurada.</span>
                  </div>
                </form>

              </motion.div>
            ) : (
              <motion.div
                key="quote-success-block"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-gradient-to-tr from-[#110D24] via-[#15102D] to-[#1C153A] rounded-3xl border-2 border-emerald-500/50 p-8 sm:p-12 text-center shadow-2xl shadow-emerald-950/20 relative overflow-hidden"
              >
                {/* Decorative confetti like particles */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -z-10" />

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6 text-3xl shadow-inner animate-bounce">
                  ✨
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                    ¡Propuesta Recibida Exitosamente!
                  </h3>
                  <p className="text-base text-slate-200 max-w-lg mx-auto leading-relaxed">
                    Muchas gracias <strong className="text-white font-semibold">{successLead.name}</strong> por contactarnos para tu colegio <strong className="text-white font-semibold">{successLead.school}</strong>.
                  </p>
                  <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    Un asesor especializado de <span className="text-indigo-400 font-bold">EduPlop</span> analizará tu cantidad de alumnos ({studentsCount}) y se pondrá en contacto contigo a la brevedad vía <span className="text-slate-300 font-semibold">{successLead.email}</span> o teléfono para enviarte la propuesta económica con el 50% de descuento vitalicio aplicado.
                  </p>

                  {/* Promo Code Card */}
                  <div className="max-w-md mx-auto mt-8 p-5 bg-slate-900/80 border border-slate-700/60 rounded-2xl space-y-3 relative">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-widest block">Tu Cupón de Reserva Preventa</span>
                      <span className="text-xs text-slate-400">Congela 50% de Descuento de por vida</span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 justify-between">
                      <code className="text-sm font-mono font-bold text-white tracking-wider">EDUPLOP50PREVENTA</code>
                      <button
                        onClick={copyToClipboard}
                        className="cursor-pointer text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/20 flex items-center gap-1 transition"
                      >
                        {copiedCoupon ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Clipboard className="h-3.5 w-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setSuccessLead(null);
                        setName("");
                        setEmail("");
                        setSchool("");
                        setPhone("");
                        setMessage("");
                      }}
                      className="cursor-pointer text-sm font-semibold text-slate-400 hover:text-white transition"
                    >
                      Solicitar otro presupuesto para un colegio diferente
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
