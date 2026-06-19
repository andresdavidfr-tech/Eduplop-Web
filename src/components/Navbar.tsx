import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppWindow, Menu, X, ArrowUpRight, Sparkles, AlertCircle } from "lucide-react";
import EduplopLogo from "./EduplopLogo";

interface NavbarProps {
  onScrollTo: (elementId: string) => void;
}

export default function Navbar({ onScrollTo }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Características", id: "features" },
    { name: "Tour de la App", id: "app-tour" },
    { name: "Demostrador IA", id: "ai-playground" },
    { name: "Beneficios de Preventa", id: "pre-sale" },
    { name: "Preguntas", id: "faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Name */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <EduplopLogo size={38} />
          <span className="relative text-xl font-extrabold tracking-tight text-slate-800 font-display flex items-center pr-3.5">
            Edu<span className="text-indigo-650 text-indigo-600">Plop</span>
            <span className="absolute right-0 top-[6px] flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onScrollTo(item.id)}
              className="text-sm font-medium text-slate-600 hover:text-coral-500 transition-colors duration-150 cursor-pointer"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://eduplop.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-coral-600 hover:text-coral-700 transition"
          >
            Ver App en Vivo
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <button
            onClick={() => onScrollTo("pre-sale-form")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-coral-500 px-4.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral-600 transition duration-150 cursor-pointer"
          >
            Obtener 50% Off
            <Sparkles className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="https://eduplop.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 transition"
            title="Ver App en Claude/Vercel"
          >
            <AppWindow className="h-5 w-5" />
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-50 lg:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-rose-100 bg-white"
          >
            <div className="space-y-1.5 px-4 py-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsOpen(false);
                    onScrollTo(item.id);
                  }}
                  className="block w-full text-left rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-rose-50 hover:text-coral-500 transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <div className="h-px bg-slate-100 my-3"></div>
              <div className="flex flex-col gap-2.5">
                <a
                  href="https://eduplop.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Ver App en Vivo
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onScrollTo("pre-sale-form");
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-coral-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-coral-600 cursor-pointer"
                >
                  Registrarse por el 50% Off
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
