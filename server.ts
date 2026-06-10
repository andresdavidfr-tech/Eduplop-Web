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
