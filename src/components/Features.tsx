import { motion } from "motion/react";
import { ShieldCheck, HeartPulse, RefreshCw, MessageSquareCode, Sparkles, Smile, UsersRound } from "lucide-react";
import { FeatureItem } from "../types";

export default function Features() {
  const items: FeatureItem[] = [
    {
      id: "safe-dismissal",
      title: "Retiro Seguro con Código Dinámico",
      subtitle: "Garantía de tranquilidad absoluta",
      description: "Sistema inteligente de entrega de alumnos mediante verificación en tiempo real de autorizaciones y códigos QR/Pin dinámicos para los apoderados autorizados, integrado a alertas inmediatas de seguridad en el panel del colegio.",
      icon: "ShieldCheck",
      badge: "Seguridad Crítica",
      benefit: "Elimina cuellos de botella en la salida y resguarda la integridad de cada niño ante retiros no autorizados."
    },
    {
      id: "ai-communication",
      title: "Comunicación Programable y Asistida por IA",
      subtitle: "Adiós a los malentendidos",
      description: "Redacta de manera ágil comunicados y edítalos con filtros de Inteligencia Artificial que ajustan el tono (empático, institucional, conciso o informativo). Programa envíos futuros y confirma la lectura instantánea de las familias.",
      icon: "MessageSquareCode",
      badge: "Inteligencia Artificial",
      benefit: "Ahorra horas administrativas de redacción escolar y asegura que los mensajes se entiendan amablemente."
    },
    {
      id: "co-create-community",
      title: "Co-creamos Comunidad Escolar",
      subtitle: "Familias + Escuela en sintonía",
      description: "Espacios participativos diseñados para involucrar activamente a las familias y al colegio. Co-diseña pautas de crianza, asiste a asambleas híbridas de padres y comparte logros formativos en una cartelera interactiva.",
      icon: "UsersRound",
      badge: "Lazo de Comunidad",
      benefit: "Fortalece la confianza mutua y construye un entorno cooperativo idóneo para el sano desarrollo de los niños."
    },
    {
      id: "personalized-ui",
      title: "Interfaz Fluida y Altamente Personalizada",
      subtitle: "Facilidad de uso para todos",
      description: "Una experiencia de uso sin curvas de aprendizaje complejas. Se adapta al perfil de cada usuario permitiendo que profesores, abuelos, apoderados y directivos accedan velozmente a lo que realmente les importa de forma intuitiva.",
      icon: "Smile",
      badge: "Experiencia de Usuario",
      benefit: "Alta tasa de adopción en la comunidad escolar debido a botones claros, letras legibles y navegación fluida."
    }
  ];

  // Helper helper to dynamically map icon name strings to Lucide elements
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="h-6 w-6 text-coral-500" />;
      case "MessageSquareCode":
        return <MessageSquareCode className="h-6 w-6 text-coral-500" />;
      case "UsersRound":
        return <UsersRound className="h-6 w-6 text-coral-500" />;
      case "Smile":
        return <Smile className="h-6 w-6 text-coral-500" />;
      default:
        return <Sparkles className="h-6 w-6 text-coral-500" />;
    }
  };

  return (
    <section id="features" className="py-20 bg-white border-y border-rose-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-coral-500">Características Principales</h2>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Todo lo necesario para re-imaginar la alianza escolar
          </p>
          <p className="text-lg text-slate-600">
            Diseñamos soluciones tecnológicas sustentadas en la empatía humana, priorizando la paz mental de los padres y la eficiencia de los educadores.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-coral-50/30 p-6 sm:p-8 hover:border-coral-150 transition-all hover:bg-coral-50/50 group"
            >
              <div className="space-y-4">
                {/* Icon & Badge Row */}
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-200">
                    {renderIcon(item.icon)}
                  </div>
                  <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-coral-600 border border-coral-200/50 shadow-2xs">
                    {item.badge}
                  </span>
                </div>

                {/* Titling */}
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-coral-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-coral-500 uppercase tracking-widest">
                    {item.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>

              {/* Benefit Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 bg-white/40 -mx-6 -mb-6 px-6 pb-6 rounded-b-3xl">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Beneficio Clave:
                </span>
                <p className="text-xs font-medium text-slate-700 leading-normal">
                  {item.benefit}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
