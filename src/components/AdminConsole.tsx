import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Users, RefreshCw, Calendar, Tag, ShieldCheck, Mail, Database, ChevronDown, ChevronUp } from "lucide-react";
import { Lead } from "../types";

interface AdminConsoleProps {
  refreshTrigger: number;
}

export default function AdminConsole({ refreshTrigger }: AdminConsoleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLeads = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/leads");
      if (!response.ok) {
        throw new Error("No se pudieron cargar las pre-ventas.");
      }
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      setError(err.message || "Error al recuperar datos backend.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen || refreshTrigger > 0) {
      fetchLeads();
    }
  }, [isOpen, refreshTrigger]);

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-lg">
      
      {/* Drawer Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-750/80 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-lg shadow-black/20"
      >
        <div className="flex h-4 w-4 items-center justify-center rounded-md bg-coral-500 text-white text-[10px] font-bold">
          !
        </div>
        <span>Consola de Suscriptores ({leads.length})</span>
        {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
      </button>

      {/* Expandable Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mt-2.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 w-[320px] sm:w-[420px] max-h-[480px] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Database className="h-4.5 w-4.5 text-coral-500" />
                <span className="text-xs font-bold text-slate-900">Console: Leads Registrados (Preventa)</span>
              </div>
              <button
                onClick={fetchLeads}
                disabled={isLoading}
                className="cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                title="Sincronizar con servidor"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {error && (
              <p className="text-[11px] text-red-500 bg-red-50 border border-red-100 p-2 rounded-lg mb-3">
                {error}
              </p>
            )}

            {/* Leads list */}
            {leads.length === 0 ? (
              <div className="text-center py-6 text-slate-400 space-y-1.5">
                <Users className="h-7 w-7 mx-auto text-slate-300" />
                <p className="text-xs font-medium">No hay registros aún.</p>
                <p className="text-[10px]">¡Inscríbete usando el formulario de arriba para ver aparecer tus datos en tiempo real!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 bg-slate-50 border border-slate-150 rounded-xl relative space-y-1.5 text-xs text-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{lead.name}</span>
                      <span className="text-[9px] bg-coral-100 text-coral-600 font-bold px-1.5 py-0.5 rounded-md">
                        {lead.role.split(" / ")[0]}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Mail className="h-3 w-3" /> {lead.email}
                      </p>
                      <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <ShieldCheck className="h-3 w-3" /> {lead.school}
                      </p>
                    </div>

                    {lead.message && (
                      <p className="text-[10px] text-slate-500 italic bg-white p-1.5 border border-slate-100 rounded-md">
                        "{lead.message}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-150 text-[9px] text-slate-450 font-mono">
                      <span>Cupón: {lead.coupon}</span>
                      <span>{new Date(lead.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-normal">
              *Demo de persistencia full-stack. Los leads se guardan de forma segura en el servidor de Cloud Run.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
