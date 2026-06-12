import { AppWindow, Heart, Shield, ArrowUpRight } from "lucide-react";
import EduplopLogo from "./EduplopLogo";

interface FooterProps {
  onScrollTo: (elementId: string) => void;
  onClickAdmin?: () => void;
}

export default function Footer({ onScrollTo, onClickAdmin }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Description Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <EduplopLogo size={34} />
              <span className="text-lg font-bold text-white tracking-tight">
                Edu<span className="text-indigo-500">Plop</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Re-imaginando el ecosistema escolar mediante comunicación inteligente asistida por IA, retiro de alumnos seguro y fomento voluntario de la comunidad.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>Creado con amor para colegios y familias</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Secciones</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onScrollTo("features")}
                  className="hover:text-white transition duration-100 cursor-pointer"
                >
                  Características Clave
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("app-tour")}
                  className="hover:text-white transition duration-100 cursor-pointer"
                >
                  Tour de la App
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("ai-playground")}
                  className="hover:text-white transition duration-100 cursor-pointer"
                >
                  Demostrador IA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo("pre-sale")}
                  className="hover:text-white transition duration-100 cursor-pointer"
                >
                  Preventa 50% Off
                </button>
              </li>
            </ul>
          </div>

          {/* Connected App redirect / Metadata */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Nuestra Plataforma</h4>
            <p className="text-xs text-slate-400 leading-normal">
              Contamos con una versión en constante desarrollo desplegada activamente para demostración en Vercel.
            </p>
            <a
              href="https://eduplop.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 text-white hover:bg-slate-750 px-4 py-2 text-xs font-bold transition-all"
            >
              <AppWindow className="h-4 w-4" />
              Explorar EduPlop Vercel
              <ArrowUpRight className="h-3.5 w-3.5 text-coral-400" />
            </a>
          </div>

        </div>

        {/* Separator */}
        <div className="h-px bg-slate-800 my-8"></div>

        {/* Bottom copyright & information row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduPlop Inc. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2 select-none">
            <Shield className="h-4 w-4 text-mint-500" />
            <span 
              onClick={onClickAdmin}
              className="cursor-pointer hover:text-slate-400 hover:underline transition duration-150"
              title="Acceso de Administración Privado"
            >
              Encriptación de datos segura • Entorno protegido
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
