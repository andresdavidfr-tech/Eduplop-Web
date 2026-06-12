import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import AppScreenshots from "./components/AppScreenshots";
import AIPlayground from "./components/AIPlayground";
import RegistrationForm from "./components/RegistrationForm";
import FAQ from "./components/FAQ";
import AdminConsole from "./components/AdminConsole";
import Footer from "./components/Footer";

export default function App() {
  const [refreshLeadsTrigger, setRefreshLeadsTrigger] = useState(0);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return typeof window !== "undefined" && localStorage.getItem("eduplop_admin_unlocked") === "true";
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const handleScrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offset = 80; // Offset for stick-fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleLeadAdded = () => {
    setRefreshLeadsTrigger((prev) => prev + 1);
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "eduplop2026") {
      setIsAdminUnlocked(true);
      localStorage.setItem("eduplop_admin_unlocked", "true");
      setShowAuthModal(false);
      setPasscode("");
      setAuthError("");
    } else {
      setAuthError("Clave incorrecta. Por favor intente de nuevo.");
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    localStorage.removeItem("eduplop_admin_unlocked");
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-coral-100 selection:text-coral-600">
      {/* Dynamic Header / Navigation bar */}
      <Navbar onScrollTo={handleScrollToSection} />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero onScrollTo={handleScrollToSection} />

        {/* Feature grid highlighting key value propositions */}
        <Features />

        {/* Live-reproduced cell phone mockups and highlights */}
        <AppScreenshots />

        {/* Dynamic AI interactive playground */}
        <AIPlayground />

        {/* Secure lead registration form (50% presale off) */}
        <RegistrationForm onLeadAdded={handleLeadAdded} />

        {/* Dynamic FAQ Accordion */}
        <FAQ />
      </main>

      {/* Persistent admin console diagnostics preview (Only rendered if unlocked to ensure privacy) */}
      {isAdminUnlocked && (
        <AdminConsole refreshTrigger={refreshLeadsTrigger} onLock={handleLockAdmin} />
      )}

      {/* Multi-grid beautiful footer */}
      <Footer 
        onScrollTo={handleScrollToSection} 
        onClickAdmin={() => setShowAuthModal(true)}
      />

      {/* Absolute Admin Access Modal Gate (Hidden in Plain Sight, Only accessible from Footer badge) */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              {/* Corner decorative light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />

              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setPasscode("");
                  setAuthError("");
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold hover:scale-110 transition cursor-pointer text-sm"
              >
                ✕
              </button>

              <div className="text-center space-y-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-150 text-indigo-600 flex items-center justify-center mx-auto text-xl font-bold">
                  🔐
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">Área Privada Administrador</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Acceso de índole estrictamente comercial y confidencial. Ingrese su clave de administrador de <strong>EduPlop</strong>.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyPasscode} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Clave de Seguridad</label>
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition font-mono tracking-widest text-center"
                    autoFocus
                  />
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-medium italic">Pista: eduplop2026</span>
                  </div>
                </div>

                {authError && (
                  <p className="text-xs font-semibold text-red-500 text-center bg-red-50 p-2.5 rounded-xl border border-red-100">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full cursor-pointer py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition font-bold text-sm tracking-wide shadow-md shadow-slate-900/10"
                >
                  Confirmar Identidad Admin
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

