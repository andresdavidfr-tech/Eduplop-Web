import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  RefreshCw, 
  FileText, 
  Download, 
  Lock, 
  Mail, 
  Database, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Briefcase,
  Home,
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import { Lead } from "../types";

interface AdminConsoleProps {
  refreshTrigger: number;
  onLock: () => void;
}

interface ReportData {
  timestamp: string;
  summary: {
    totalLeads: number;
    distinctSchools: number;
    roleStats: { parents: number; teachers: number; admins: number };
  };
  markdown: string;
}

export default function AdminConsole({ refreshTrigger, onLock }: AdminConsoleProps) {
  const [isOpen, setIsOpen] = useState(true); // Open by default once the admin unlocks it!
  const [activeTab, setActiveTab] = useState<"report" | "leads" | "google-form">("report");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Google Form Integración States
  const [gfEnabled, setGfEnabled] = useState(false);
  const [gfFormUrl, setGfFormUrl] = useState("");
  const [gfEntryMap, setGfEntryMap] = useState({
    name: "entry.1000001",
    role: "entry.1000002",
    email: "entry.1000003",
    school: "entry.1000004",
    phone: "entry.100005",
    message: "entry.100006"
  });
  const [isSavingGf, setIsSavingGf] = useState(false);
  const [isTestingGf, setIsTestingGf] = useState(false);
  const [gfStatusMsg, setGfStatusMsg] = useState("");
  const [gfStatusSuccess, setGfStatusSuccess] = useState(true);

  const fetchGfConfig = async () => {
    try {
      const res = await fetch("/api/admin/google-form-config");
      if (res.ok) {
        const config = await res.json();
        setGfEnabled(config.enabled);
        setGfFormUrl(config.formUrl || "");
        if (config.entryMap) {
          setGfEntryMap({
            name: config.entryMap.name || "",
            role: config.entryMap.role || "",
            email: config.entryMap.email || "",
            school: config.entryMap.school || "",
            phone: config.entryMap.phone || "",
            message: config.entryMap.message || ""
          });
        }
      }
    } catch (err) {
      console.error("Error reading Google Form config:", err);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Parallel fetches for raw leads, analytical report, and Google Form configurations
      const [leadsRes, reportRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/admin/report")
      ]);

      if (!leadsRes.ok || !reportRes.ok) {
        throw new Error("Sincronización fallida con servidores.");
      }

      const leadsData = await leadsRes.json();
      const reportData = await reportRes.json();

      setLeads(leadsData.leads || []);
      setReport(reportData || null);
    } catch (err: any) {
      setError(err.message || "Error al recuperar datos de la consola privada.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchGfConfig();
  }, [refreshTrigger]);

  const handleSaveGfConfig = async () => {
    setIsSavingGf(true);
    setGfStatusMsg("");
    try {
      const res = await fetch("/api/admin/google-form-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: gfEnabled,
          formUrl: gfFormUrl,
          entryMap: gfEntryMap
        })
      });

      if (!res.ok) throw new Error("Fallo al guardar la configuración.");
      const data = await res.json();
      if (data.success) {
        setGfStatusSuccess(true);
        setGfStatusMsg("¡Configuración guardada correctamente!");
        setTimeout(() => setGfStatusMsg(""), 4000);
      }
    } catch (err: any) {
      setGfStatusSuccess(false);
      setGfStatusMsg(err.message || "Error al guardar configuración.");
    } finally {
      setIsSavingGf(false);
    }
  };

  const handleTestGfSubmit = async () => {
    setIsTestingGf(true);
    setGfStatusMsg("");
    try {
      const res = await fetch("/api/admin/google-form-test", {
        method: "POST"
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGfStatusSuccess(true);
        setGfStatusMsg(data.message);
      } else {
        setGfStatusSuccess(false);
        setGfStatusMsg(data.error || "Fallo en la prueba de integración.");
      }
    } catch (err: any) {
      setGfStatusSuccess(false);
      setGfStatusMsg(err.message || "Error de conexión en la prueba.");
    } finally {
      setIsTestingGf(false);
    }
  };

  const handleDownloadReport = () => {
    if (!report?.markdown) return;
    const blob = new Blob([report.markdown], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `eduplop_informe_interno_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <strong key={index} className="font-extrabold text-slate-900 bg-amber-50 border-b border-amber-200/50 px-0.5 rounded-sm">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  const parseMarkdownToHTML = (md: string) => {
    if (!md) return null;
    const lines = md.split("\n");
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-2"></div>;

      if (trimmed.startsWith("# ")) {
        return (
          <h1 key={i} className="text-base font-extrabold text-slate-900 mt-5 border-b border-slate-100 pb-2 flex items-center gap-1.5 uppercase tracking-wide">
            {trimmed.replace("# ", "")}
          </h1>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={i} className="text-xs font-bold text-indigo-600 mt-4 mb-2 flex items-center gap-1 uppercase tracking-wider">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={i} className="text-sm font-bold text-slate-800 mt-4 mb-2 border-l-2 border-coral-500 pl-2">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const content = trimmed.substring(2);
        return (
          <li key={i} className="text-xs text-slate-650 ml-3 list-disc leading-relaxed mb-1.5">
            {parseBoldText(content)}
          </li>
        );
      }
      if (trimmed === "---") {
        return <hr key={i} className="my-4 border-slate-100" />;
      }

      return (
        <p key={i} className="text-xs text-slate-655 leading-relaxed mb-2 pb-0.5">
          {parseBoldText(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-2xl">
      
      {/* Floating Toggle trigger (Only shown when admin verified) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center gap-2 rounded-2xl bg-indigo-900 border border-indigo-800/80 px-4.5 py-3 text-xs font-bold text-white hover:bg-slate-900 transition-all shadow-xl shadow-indigo-950/20"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Panel Administrativo (Privado)</span>
        {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
      </button>

      {/* Primary Console Dashboard inside collapsible drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mt-2.5 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xl shadow-slate-900/12 w-[340px] sm:w-[500px] max-h-[500px] flex flex-col overflow-hidden"
          >
            {/* Header / Brand of the console */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs">🏛️</div>
                <div className="leading-tight">
                  <span className="text-xs font-extrabold text-slate-900 block font-sans">EduPlop Internal Analytics</span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Modo Administrador Autorizado</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={fetchData}
                  disabled={isLoading}
                  className="cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                  title="Actualizar Datos"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={onLock}
                  className="cursor-pointer p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
                  title="Cerrar Consola (Cerrar Sesión)"
                >
                  <Lock className="h-4 w-4" />
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-600 bg-red-50 border border-red-100/60 p-2.5 rounded-xl mb-3 font-medium">
                {error}
              </p>
            )}

            {/* Segment Controls (Console Tabs) */}
            <div className="flex gap-1 bg-slate-50 p-1 rounded-xl mb-4 text-[11px] sm:text-xs font-semibold">
              <button
                onClick={() => setActiveTab("report")}
                className={`cursor-pointer flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                  activeTab === "report" 
                    ? "bg-white text-slate-900 shadow-3xs border border-slate-150" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-505" />
                <span>Informe</span>
              </button>
              <button
                onClick={() => setActiveTab("leads")}
                className={`cursor-pointer flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                  activeTab === "leads" 
                    ? "bg-white text-slate-900 shadow-3xs border border-slate-150" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <FileSpreadsheet className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-coral-505" />
                <span>Prospectos ({leads.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("google-form")}
                className={`cursor-pointer flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
                  activeTab === "google-form" 
                    ? "bg-white text-slate-900 shadow-3xs border border-slate-150" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Database className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-505" />
                <span>Google Forms</span>
              </button>
            </div>

            {/* Scrollable Main Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[300px]">
              
              {/* TAB 1: EXECUTIVE ANALYTICAL REPORT */}
              {activeTab === "report" && (
                <div className="space-y-4">
                  {/* Performance Indicators Grid */}
                  {report && (
                    <div className="grid grid-cols-3 gap-2 pb-1">
                      <div className="bg-gradient-to-br from-indigo-50/50 to-indigo-50/20 border border-indigo-100/50 p-2.5 rounded-xl text-center">
                        <span className="block text-[8px] uppercase font-bold text-indigo-500 tracking-wider">Total Leads</span>
                        <span className="text-base font-extrabold text-indigo-900 font-sans block">{report.summary.totalLeads}</span>
                      </div>
                      <div className="bg-gradient-to-br from-coral-50/50 to-coral-50/20 border border-coral-100/50 p-2.5 rounded-xl text-center">
                        <span className="block text-[8px] uppercase font-bold text-coral-500 tracking-wider">Colegios</span>
                        <span className="text-base font-extrabold text-coral-900 font-sans block">{report.summary.distinctSchools}</span>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50/50 to-amber-50/20 border border-amber-100/50 p-2.5 rounded-xl text-center">
                        <span className="block text-[8px] uppercase font-bold text-amber-500 tracking-wider">Toma Decisión</span>
                        <span className="text-base font-extrabold text-amber-900 font-sans block">
                          {report.summary.roleStats.admins}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Rendered Markdown Report */}
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-xs select-text">
                    {report ? (
                      <div>
                        {parseMarkdownToHTML(report.markdown)}
                        
                        {/* Download CTA */}
                        <div className="mt-5 pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                          <span>Reporte compilado mediante analíticas en vivo</span>
                          <button
                            onClick={handleDownloadReport}
                            className="cursor-pointer inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-805 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1.5 rounded-lg transition"
                          >
                            <Download className="h-3 w-3" />
                            Descargar (.md)
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-400 space-y-1">
                        <FileText className="h-6 w-6 mx-auto text-slate-300 animate-pulse" />
                        <p className="font-medium text-xs">Cargando reporte ejecutivo...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: DETAILED LEADS LIST */}
              {activeTab === "leads" && (
                <div className="space-y-3">
                  {leads.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 space-y-1.5">
                      <Users className="h-8 w-8 mx-auto text-slate-300" />
                      <p className="text-xs font-semibold">No se registran pre-ventas todavía.</p>
                      <p className="text-[10px]">Las inscripciones al formulario se guardarán en tiempo real aquí.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-3 bg-white border border-slate-150 rounded-2xl shadow-3xs hover:border-slate-300 transition duration-100 text-xs text-slate-700 relative flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 block text-xs">{lead.name}</span>
                            <span className="text-[9px] bg-indigo-55 bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-md">
                              {lead.role.split(" / ")[0]}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 py-0.5 border-y border-slate-50">
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Correo</span>
                              <span className="font-medium text-slate-755 truncate block max-w-[150px]">{lead.email}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Establecimiento</span>
                              <span className="font-medium text-slate-755 truncate block max-w-[150px]">{lead.school}</span>
                            </div>
                          </div>

                          {lead.phone && (
                            <div className="text-[11px] text-slate-500">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Teléfono:</span>{" "}
                              <span className="font-sans font-medium">{lead.phone}</span>
                            </div>
                          )}

                          {lead.message && (
                            <p className="text-[10px] text-slate-600 font-medium italic bg-slate-50 p-2 border border-slate-100 rounded-xl leading-relaxed">
                              "{lead.message}"
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9px] text-slate-400 font-mono">
                            <span>Ticket: {lead.coupon}</span>
                            <span>{new Date(lead.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* TAB 3: GOOGLE FORM SYNCHRONIZATION CONFIG */}
              {activeTab === "google-form" && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-2xl space-y-1.5 text-xs text-slate-700">
                    <h4 className="font-bold flex items-center gap-1.5 text-amber-800">
                      📝 Sincronización de Leads
                    </h4>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      Envía todos los prospectos que se pre-inscriben en EduPlop de manera automática y en tiempo real a tu <strong>Google Form público</strong> (propietario: <span className="font-semibold text-slate-800 text-nowrap">andresdavidfr@gmail.com</span>).
                    </p>
                  </div>

                  {/* Settings Form */}
                  <div className="space-y-3.5 pb-2">
                    {/* Toggle Activation state */}
                    <div className="flex items-center justify-between p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl">
                      <div className="leading-tight">
                        <span className="text-xs font-bold text-slate-800 block">Sincronización Activa</span>
                        <span className="text-[10px] text-slate-400 font-medium">Reenviar de inmediato</span>
                      </div>
                      <button
                        onClick={() => setGfEnabled(!gfEnabled)}
                        className={`cursor-pointer relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-hidden ${
                          gfEnabled ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            gfEnabled ? "translate-x-5.5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Google Form Link / ID */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Enlace o ID de Google Forms
                      </label>
                      <input
                        type="text"
                        value={gfFormUrl}
                        onChange={(e) => setGfFormUrl(e.target.value)}
                        placeholder="Ej: https://docs.google.com/forms/d/e/1FAIpQLSf.../viewform"
                        className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-400 focus:bg-white transition font-sans"
                      />
                      <p className="text-[9px] text-slate-400 leading-normal">
                        *Puedes pegar el enlace para responder (el de responder visible al público que termina en `/viewform` o `/formResponse`).
                      </p>
                    </div>

                    {/* Collapsible details for mapping entry.xxxxxxxx */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30 p-3 space-y-2.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block border-b border-slate-100 pb-1">
                        Mapeo de Campos (Entry IDs de Google Forms)
                      </span>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Nombre Completo</label>
                          <input
                            type="text"
                            value={gfEntryMap.name}
                            onChange={(e) => setGfEntryMap(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: entry.1000001"
                            className="w-full text-xs font-mono rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Rol Seleccionado</label>
                          <input
                            type="text"
                            value={gfEntryMap.role}
                            onChange={(e) => setGfEntryMap(prev => ({ ...prev, role: e.target.value }))}
                            placeholder="Ej: entry.1000002"
                            className="w-full text-xs font-mono rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Correo Electrónico</label>
                          <input
                            type="text"
                            value={gfEntryMap.email}
                            onChange={(e) => setGfEntryMap(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Ej: entry.1000003"
                            className="w-full text-xs font-mono rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Establecimiento</label>
                          <input
                            type="text"
                            value={gfEntryMap.school}
                            onChange={(e) => setGfEntryMap(prev => ({ ...prev, school: e.target.value }))}
                            placeholder="Ej: entry.1000004"
                            className="w-full text-xs font-mono rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Teléfono</label>
                          <input
                            type="text"
                            value={gfEntryMap.phone}
                            onChange={(e) => setGfEntryMap(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Ej: entry.1000005"
                            className="w-full text-xs font-mono rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-medium block mb-0.5">Mensaje o Comentarios</label>
                          <input
                            type="text"
                            value={gfEntryMap.message}
                            onChange={(e) => setGfEntryMap(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Ej: entry.1000006"
                            className="w-full text-xs font-mono rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700"
                          />
                        </div>
                      </div>

                      {/* Interactive Tutorial Link */}
                      <div className="bg-white border border-slate-100 p-2.5 rounded-lg text-[10px] text-slate-500 space-y-1">
                        <span className="font-bold text-slate-800 block">💡 ¿Cómo conseguir los entry IDs?</span>
                        <ol className="list-decimal pl-3 pb-0.5 space-y-0.5">
                          <li>Crea tu formulario con estas preguntas exactas en Google Forms.</li>
                          <li>Haz clic en los tres puntos (superior derecha) &gt; <strong className="text-slate-700">"Obtener enlace rellenado previamente"</strong>.</li>
                          <li>Rellena las respuestas, haz clic en "Obtener enlace" y cópialo.</li>
                          <li>Pégalo en un bloc de notas; verás parámetros como <code className="font-mono bg-slate-100 px-0.5">?entry.123456=Nombre</code>. Esas son tus claves.</li>
                        </ol>
                      </div>
                    </div>

                    {/* Feedback state message */}
                    {gfStatusMsg && (
                      <div className={`p-2.5 rounded-xl text-center text-xs font-semibold border leading-relaxed ${
                        gfStatusSuccess 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-red-50 text-red-600 border-red-150"
                      }`}>
                        {gfStatusMsg}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 text-xs pt-1.5 font-sans">
                      <button
                        onClick={handleSaveGfConfig}
                        disabled={isSavingGf}
                        className="cursor-pointer flex-1 py-1.5 text-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold transition disabled:opacity-50"
                      >
                        {isSavingGf ? "Guardando..." : "Guardar Cambios"}
                      </button>
                      <button
                        onClick={handleTestGfSubmit}
                        disabled={isTestingGf || !gfFormUrl}
                        className="cursor-pointer py-1.5 px-2.5 text-center text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold border border-slate-200 transition disabled:opacity-50 text-nowrap"
                        title="Enviar un registro de pre-venta de prueba ficticio"
                      >
                        {isTestingGf ? "Enviando..." : "Registro Prueba 🚀"}
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-relaxed">
              *Información encriptada EduPlop Core. Clasificación de uso exclusivo para administración institucional.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
