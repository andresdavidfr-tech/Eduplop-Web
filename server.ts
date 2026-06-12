import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const LEADS_FILE_PATH = path.join(process.cwd(), "leads.json");

// Middleware to parse JSON
app.use(express.json());

// Initialize Gemini SDK with telemetry and fallback key check
const apiKey = process.env.GEMINI_API_KEY || "";
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.log("⚠️ WARNING: GEMINI_API_KEY environment variable is not set. AI features will fallback to client-side friendly simulators.");
}

// Ensure leads file exists
async function ensureLeadsFile() {
  try {
    await fs.access(LEADS_FILE_PATH);
  } catch {
    await fs.writeFile(LEADS_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
  }
}
ensureLeadsFile();

// API endpoint to post a lead
app.post("/api/leads", async (req, res) => {
  try {
    const { name, role, email, school, phone, message } = req.body;

    if (!name || !email || !role || !school) {
       res.status(400).json({ error: "Faltan campos requeridos (nombre, email, rol, colegio)." });
       return;
    }

    await ensureLeadsFile();
    const dataStr = await fs.readFile(LEADS_FILE_PATH, "utf-8");
    const leads = JSON.parse(dataStr);

    const newLead = {
      id: "lead_" + Date.now().toString(36),
      name,
      role,
      email,
      school,
      phone: phone || "",
      message: message || "",
      coupon: "EDUPLOP50PREVENTA",
      createdAt: new Date().toISOString(),
    };

    leads.push(newLead);
    await fs.writeFile(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), "utf-8");

    res.status(201).json({
      success: true,
      message: "¡Registro exitoso! Código de descuento enviado.",
      lead: newLead
    });
  } catch (error: any) {
    console.error("Error al registrar lead:", error);
    res.status(500).json({ error: "Error interno al procesar el registro." });
  }
});

// API endpoint to retrieve leads (for admin console visualization)
app.get("/api/leads", async (req, res) => {
  try {
    await ensureLeadsFile();
    const dataStr = await fs.readFile(LEADS_FILE_PATH, "utf-8");
    const leads = JSON.parse(dataStr);
    res.json({ leads });
  } catch (error) {
    console.error("Error al obtener leads:", error);
    res.status(500).json({ error: "Error al recuperar registros." });
  }
});

// API endpoint for generating a structured internal report (Confidential)
app.get("/api/admin/report", async (req, res) => {
  try {
    await ensureLeadsFile();
    const dataStr = await fs.readFile(LEADS_FILE_PATH, "utf-8");
    const leads = JSON.parse(dataStr);

    const totalLeads = leads.length;
    const uniqueSchools = [...new Set(leads.map((l: any) => l.school))];
    
    // Role distribution
    const roleStats = { parents: 0, teachers: 0, admins: 0 };
    leads.forEach((l: any) => {
      const lowerRole = (l.role || "").toLowerCase();
      if (lowerRole.includes("familiar") || lowerRole.includes("apoderado")) {
        roleStats.parents++;
      } else if (lowerRole.includes("docente") || lowerRole.includes("educador")) {
        roleStats.teachers++;
      } else {
        roleStats.admins++;
      }
    });

    const schoolBreakdown = leads.reduce((acc: any, l: any) => {
      if (l.school) {
        acc[l.school] = (acc[l.school] || 0) + 1;
      }
      return acc;
    }, {});

    const timestamp = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });

    let aiAnalysis = "";

    if (ai && totalLeads > 0) {
      try {
        const leadBrief = leads.slice(-15).map((l: any) => `- Rol: ${l.role}, Colegio: ${l.school}, Mensaje: "${l.message || "Sin comentario"}"`).join("\n");
        const analysisPrompt = `Analiza detalladamente este listado de leads de preventa interesados en la plataforma educativa "EduPlop" (una app con IA para comunicación fluida, salidas de alumnos ágiles y seguras):
${leadBrief}

Genera un reporte ejecutivo interno sumamente conciso en español (Markdown). Incluye:
1. "Análisis de Mensajes y Necesidades Principales" (Cuáles son las mayores preocupaciones o expectativas que expresan los padres y directores en sus mensajes).
2. "Estrategia de Conversión Recomendada" (Cómo el equipo comercial de EduPlop debe abordar a estos leads usando el beneficio del 50% de descuento).
3. "Score de Viabilidad" (Calcula un score de viabilidad comercial de 1 a 10 basado en los cargos de las personas registradas).
No incluyas introducciones ni saludos comerciales. Ve directo a los puntos indicados.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: analysisPrompt,
        });
        aiAnalysis = response.text?.trim() || "Análisis automático no disponible.";
      } catch (aiErr) {
        console.error("Gemini report error:", aiErr);
        aiAnalysis = "Error al sintetizar el informe con Inteligencia Artificial. Se muestra informe estándar.";
      }
    }

    if (!aiAnalysis) {
      // High fidelity fallback text based on data
      aiAnalysis = `### Análisis Automático de Demanda
* **Necesidades estimadas:** Con ${totalLeads} registros, se evidencia preocupación central en la optimización de los momentos de retiro (salida de alumnos) y la agilidad de los comunicados cotidianos.
* **Toma de Decisiones:** La presencia de ${roleStats.admins} perfiles directivos/administradores indica una alta probabilidad de penetración institucional B2B, ya que son los decisores de compras del software escolar.
* **Recomendación Comercial:** Ofrecer webinars guiados a los ${uniqueSchools.length} colegios detectados, invitando a los ${roleStats.teachers} docentes pre-inscritos para que actúen como promotores internos en sus respectivos establecimientos.`;
    }

    // Compose cohesive markdown
    const mdReport = `# INFORME DE INTELIGENCIA COMERCIAL - EDUPLOP 🚀
*Generado automáticamente el ${timestamp} | Uso Interno Confidencial*

---

### 1. Métricas de Conversión y Embudo de Ventas
* **Total Pre-inscritos:** **${totalLeads}** prospectos de alta intención.
* **Colegios Únicos:** **${uniqueSchools.length}** establecimientos detectados en el sistema.
* **Distribución de Roles Operativos:**
  - 🏡 **Familias / Apoderados:** ${totalLeads > 0 ? Math.round((roleStats.parents / totalLeads) * 100) : 0}% (${roleStats.parents} leads)
  - 🏫 **Docentes / Educadores:** ${totalLeads > 0 ? Math.round((roleStats.teachers / totalLeads) * 100) : 0}% (${roleStats.teachers} leads)
  - 💼 **Directivos / Administradores de Colegio:** ${totalLeads > 0 ? Math.round((roleStats.admins / totalLeads) * 100) : 0}% (${roleStats.admins} leads)

---

### 2. Penetración Geográfica y Demanda por Establecimiento
${Object.entries(schoolBreakdown).map(([sch, count]) => `- **${sch}**: ${count} pre-inscripciones registradas.`).join("\n") || "_No hay colegios registrados aún._"}

---

### 3. Síntesis Analítica de Negocio
${aiAnalysis}

---
*Fin del Reporte Ejecutivo Interno - EduPlop Analytics Engine*`;

    res.json({
      success: true,
      timestamp,
      summary: {
        totalLeads,
        distinctSchools: uniqueSchools.length,
        roleStats,
      },
      markdown: mdReport
    });

  } catch (error: any) {
    console.error("Error al generar reporte administrativo:", error);
    res.status(500).json({ error: "Ocurrió un error al compilar el informe interno." });
  }
});

// API endpoint for AI Assisted communication
app.post("/api/ai-assisted-communication", async (req, res) => {
  try {
    const { rawMessage, tone } = req.body;

    if (!rawMessage) {
       res.status(400).json({ error: "Se requiere un mensaje original." });
       return;
    }

    const selectedTone = tone || "Empático y Cercano";

    if (!ai) {
      // Return a simulated high-quality response if Gemini API Key is missing, to keep app functioning nicely
      const fallbackOptions: Record<string, string> = {
        "Empático y Cercano": `Estimadas familias de EduPlop: Esperamos que se encuentren muy bien. Queremos comentarle de la manera más cercana que hoy tuvimos un momento especial con los pequeños. Les recordamos que ${rawMessage}. ¡Muchas gracias por co-crear comunidad junto a nosotros!`,
        "Formal e Institucional": `Estimada Comunidad Educativa: Por medio del presente comunicado, nos dirigimos a ustedes en representación de la Dirección del Establecimiento para informarles que ${rawMessage}. Agradecemos de antemano su colaboración y compromiso.`,
        "Directo y Claro": `Estimados Padres y Apoderados: Le informamos sobre el siguiente aviso importante para su conocimiento y acción: ${rawMessage}. Saludos cordiales, Equipo de Coordinación.`
      };
      
      const responseText = fallbackOptions[selectedTone] || fallbackOptions["Empático y Cercano"];
      res.json({ 
        optimizedMessage: responseText, 
        isSimulation: true 
      });
      return;
    }

    const prompt = `Actúa como el asistente de comunicación inteligente de "EduPlop", una aplicación escolar innovadora integrada con IA. Tu objetivo es reescribir un borrador de mensaje escolar escrito por un profesor o director para que sea elegante, confiable, profesional y con el tono seleccionado.

Tono de comunicación solicitado: ${selectedTone}

Mensaje original a reescribir: 
"${rawMessage}"

Instrucciones adicionales:
1. Mantén la información clave original intacta (fechas, horas, solicitudes particulares).
2. Mejora sustancialmente la gramática, redacción, cordialidad y profesionalismo.
3. El mensaje reescrito debe ser conciso, claro, diseñado para ser leído en la pantalla del celular de un padre preocupado o un apoderado.
4. No agregues etiquetas markdown extrañas en la respuesta. Devuelve exclusivamente la versión mejorada del mensaje.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ 
      optimizedMessage: response.text?.trim() || "No se pudo optimizar el mensaje.",
      isSimulation: false 
    });

  } catch (error: any) {
    console.error("Error en AI Assist:", error);
    res.status(500).json({ error: "Ocurrió un error al procesar el mensaje con la Inteligencia Artificial." });
  }
});

// Configure Vite or Serve Static Files
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduPlop Server running on port ${PORT}`);
  });
}

setupViteOrStatic();
