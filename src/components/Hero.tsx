import { motion } from "motion/react";
import { ArrowRight, Sparkles, ShieldCheck, Heart, Users, ExternalLink } from "lucide-react";
import EduplopLogo from "./EduplopLogo";

interface HeroProps {
  onScrollTo: (elementId: string) => void;
}

export default function Hero({ onScrollTo }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 lg:pb-28 bg-gradient-to-b from-coral-50/70 via-white to-transparent">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 stroke-slate-200 [mask-image:radial-gradient(600px_600px_at_center,white,transparent)] [stroke-dasharray:4_4] lg:h-[800px]">
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern id="grid-pattern" width="80" height="80" patternUnits="userSpaceOnUse" x="50%">
              <path d="M.5 80V.5H80" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          
          {/* Text Content Column */}
          <div className="text-center lg:text-left lg:col-span-7 space-y-6">
            
            {/* Promo Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-coral-100/80 px-3 py-1 text-xs font-semibold text-coral-600 border border-coral-200"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Beneficio Exclusivo: 50% de Descuento en Preventa</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Conectando con <span className="bg-gradient-to-r from-coral-500 to-amber-500 bg-clip-text text-transparent">inteligencia</span> la esencia de tu colegio con el corazón de las familias.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Co-creamos comunidad en un entorno seguro que reduce el estrés diario de familias y docentes. Potenciamos la experiencia comunicacional con Inteligencia Artificial para lograr mensajes asertivos, fluidos y empáticos, asegurando retiros de alumnos ágiles y sin preocupaciones.
            </motion.p>

            {/* Quick feature tags */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-y-2 justify-center lg:justify-start gap-x-6 text-sm text-slate-500 font-medium"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-mint-500" /> Retiro Alumnos Seguro
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-coral-500" /> Comunicación con IA
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-amber-500" /> Co-crear Comunidad
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
            >
              <button
                onClick={() => onScrollTo("pre-sale-form")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-coral-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-coral-500/20 hover:bg-coral-600 transition cursor-pointer"
              >
                Inscribirse a la Preventa (-50%)
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => onScrollTo("app-tour")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition cursor-pointer"
              >
                Ver Tour de la App
                <ArrowRight className="h-5 w-5 rotate-90" />
              </button>
            </motion.div>
          </div>

          {/* Graphical Representation / App Mockup Column */}
          <div className="mt-12 lg:mt-0 lg:col-span-5 relative flex justify-center">
            
            {/* Ambient glows */}
            <div className="absolute -top-4 -right-4 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl -z-10"></div>
            <div className="absolute -bottom-8 -left-8 w-72 h-72 rounded-full bg-coral-500/10 blur-3xl -z-10"></div>



            {/* Continuous Floating Badge 2 (Bottom Right) */}
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
              className="absolute -bottom-6 -right-6 bg-white/95 border border-indigo-100 rounded-2xl p-2.5 shadow-md flex items-center gap-2 z-10 hidden sm:flex max-w-[155px] pointer-events-none select-none"
            >
              <div className="h-6 w-6 rounded-lg bg-indigo-50 flex items-center justify-center text-[11px]">🔒</div>
              <div className="leading-tight text-left">
                <span className="text-[10px] uppercase font-extrabold text-indigo-600 block">Retiro Seguro</span>
                <span className="text-[9px] text-slate-500 font-medium font-sans">Código Dinámico</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto w-full max-w-[340px] rounded-[38px] border-[10px] border-slate-850 bg-slate-900 p-2.5 shadow-2xl shadow-slate-900/30"
            >
              {/* Speaker ear piece, camera mockup */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4.5 bg-black rounded-full flex items-center justify-end px-3">
                <span className="w-1.5 h-1.5 bg-slate-800 rounded-full mr-2"></span>
                <span className="w-1 h-1 bg-slate-850 rounded-full"></span>
              </div>

              {/* Dynamic screen content replicating Screenshot 1 */}
              <div className="overflow-hidden rounded-[28px] bg-white px-4.5 py-10 h-[550px] flex flex-col justify-between text-slate-800 border border-slate-100 shadow-inner">
                
                {/* Replicated Login Screen Header */}
                <div className="space-y-4 pt-4 text-center">
                  <EduplopLogo size={58} className="mx-auto" />
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold tracking-tight text-indigo-900 font-display">EduPlop</h3>
                    <p className="text-[11px] font-semibold text-slate-500 leading-normal leading-relaxed">
                      Hub de Experiencia Familiar <br />
                      <span className="text-[10px] text-slate-400 font-normal">Colegio San Martín</span>
                    </p>
                  </div>
                </div>

                {/* Form fields mimicking Screenshot 1 precisely */}
                <div className="space-y-3.5 text-left px-2">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">Usuario</label>
                    <div className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-400 font-normal shadow-3xs">
                      ej. familia
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">Contraseña</label>
                    <div className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2 text-xs text-slate-400 font-normal tracking-wide shadow-3xs">
                      ••••••••
                    </div>
                  </div>
                </div>

                {/* Simulated Ingresar button mimicking the blue primary cell phone design */}
                <div className="px-2 pt-2 space-y-3">
                  <button
                    onClick={() => onScrollTo("app-tour")}
                    type="button"
                    className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-xs font-bold shadow-md shadow-indigo-600/15 transition cursor-pointer text-center block"
                  >
                    Ingresar
                  </button>

                  <div className="text-center">
                    <span className="text-[9px] text-slate-400 font-medium">Hacé clic para ver el Tour Completo</span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
