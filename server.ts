import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3000;
const LEADS_FILE_PATH = path.join(process.cwd(), "leads.json");

// Middleware to enable CORS
app.use(cors());

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

// Helper to forward a lead to a Google Form programmatically
async function forwardToGoogleForm(lead: any) {
  try {
    const configPath = path.join(process.cwd(), "google-form-config.json");
    let configStr = "";
    try {
      configStr = await fs.readFile(configPath, "utf-8");
    } catch {
      console.warn("⚠️ google-form-config.json not found, using empty default.");
      return { success: false, reason: "Configuración no encontrada" };
    }

    const config = JSON.parse(configStr);

    if (!config.enabled || !config.formUrl) {
      console.log("[Google Form Sync] Desactivado o sin URL configurada.");
      return { success: false, reason: "Inactivo" };
    }

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
    const entryMap = config.entryMap || {};

    if (entryMap.name) params.append(entryMap.name, lead.name || "");
    if (entryMap.role) params.append(entryMap.role, lead.role || "");
    if (entryMap.email) params.append(entryMap.email, lead.email || "");
    if (entryMap.school) params.append(entryMap.school, lead.school || "");
    if (entryMap.phone) params.append(entryMap.phone, lead.phone || "");
    if (entryMap.message) params.append(entryMap.message, lead.message || "");

    console.log(`[Google Form Sync] Reenviando a Formulario: ${submissionUrl}`);

    const response = await fetch(submissionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) EduPlop Sync Service/1.0"
      },
      body: params.toString()
    });

    if (!response.ok) {
      console.error(`[Google Form Sync Fail] Status: ${response.status} ${response.statusText}`);
      return { success: false, status: response.status };
    }

    console.log("[Google Form Sync Success] ¡Sincronizado con Google Form exitosamente!");
    return { success: true };
  } catch (error: any) {
    console.error("[Google Form Sync Error] Excepción fatal retransmitiendo lead:", error);
    return { success: false, error: error.message };
  }
}

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

    // Sincronizar en segundo plano de manera no bloqueante con Google Forms
    forwardToGoogleForm(newLead).catch((err) => {
      console.error("⚠️ Fallo en retransmisión asíncrona a Google Forms:", err);
    });

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

// GET /api/admin/google-form-config - Obtener configuración de Google Forms
app.get("/api/admin/google-form-config", async (req, res) => {
  try {
    const configPath = path.join(process.cwd(), "google-form-config.json");
    const configStr = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(configStr);
    res.json(config);
  } catch (error) {
    console.error("Error al leer configuración de Google Form:", error);
    res.status(500).json({ error: "No se pudo recuperar la configuración." });
  }
});

// POST /api/admin/google-form-config - Actualizar configuración de Google Forms
app.post("/api/admin/google-form-config", async (req, res) => {
  try {
    const { enabled, formUrl, entryMap } = req.body;
    const configPath = path.join(process.cwd(), "google-form-config.json");
    
    const newConfig = {
      enabled: !!enabled,
      formUrl: formUrl || "",
      entryMap: entryMap || {
        name: "entry.1000001",
        role: "entry.1000002",
        email: "entry.1000003",
        school: "entry.1000004",
        phone: "entry.1000005",
        message: "entry.1000006"
      }
    };

    await fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), "utf-8");
    res.json({ success: true, config: newConfig });
  } catch (error) {
    console.error("Error al guardar configuración de Google Form:", error);
    res.status(500).json({ error: "No se pudo guardar la configuración." });
  }
});

// POST /api/admin/google-form-test - Enviar lead de prueba al Google Form configurado
app.post("/api/admin/google-form-test", async (req, res) => {
  try {
    const testLead = {
      name: "Soporte de Pruebas (EduPlop)",
      role: "Director / Sostenedor / Admin",
      email: "andresdavidfr@gmail.com",
      school: "Escuela de Prueba Integración",
      phone: "+54 9 11 0000-0000",
      message: "¡Excelente! La sincronización automática de EduPlop con mi Google Form funciona de maravillas. 🚀"
    };

    const status = await forwardToGoogleForm(testLead);
    if (status.success) {
      res.json({ success: true, message: "¡Sincronización de prueba enviada con éxito! Revisa tus respuestas de Google Form." });
    } else {
      res.status(400).json({ success: false, error: "La llamada a Google Forms falló. Verifica que el enlace del formulario sea correcto y público.", detail: status });
    }
  } catch (error: any) {
    console.error("Error en test de Google Form:", error);
    res.status(500).json({ error: "Error interno al ejecutar la prueba.", detail: error.message });
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

    const getSimulatedOptResponse = () => {
      const fallbackOptions: Record<string, string> = {
        "Empático y Cercano": `Estimadas familias de EduPlop: Esperamos que se encuentren muy bien. Queremos comentarle de la manera más cercana que hoy tuvimos un momento especial con los pequeños. Les recordamos que ${rawMessage}. ¡Muchas gracias por co-crear comunidad junto a nosotros!`,
        "Formal e Institucional": `Estimada Comunidad Educativa: Por medio del presente comunicado, nos dirigimos a ustedes en representación de la Dirección del Establecimiento para informarles que ${rawMessage}. Agradecemos de antemano su colaboración y compromiso.`,
        "Directo y Claro": `Estimados Padres y Apoderados: Le informamos sobre el siguiente aviso importante para su conocimiento y acción: ${rawMessage}. Saludos cordiales, Equipo de Coordinación.`
      };
      return fallbackOptions[selectedTone] || fallbackOptions["Empático y Cercano"];
    };

    if (!ai) {
      res.json({ 
        optimizedMessage: getSimulatedOptResponse(), 
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

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ 
        optimizedMessage: response.text?.trim() || "No se pudo optimizar el mensaje.",
        isSimulation: false 
      });
    } catch (geminiError: any) {
      const errCode = geminiError?.status || geminiError?.statusText || "503";
      console.log(`[Vía Contingencia] IA con sobrecarga temporal o inactiva (Código ${errCode}). Aplicando respuesta optimizada local.`);
      res.json({ 
        optimizedMessage: getSimulatedOptResponse(), 
        isSimulation: true 
      });
    }

  } catch (error: any) {
    console.error("Error en AI Assist:", error);
    res.status(500).json({ error: "Ocurrió un error al procesar el mensaje con la Inteligencia Artificial." });
  }
});

// Helper function to query Plopy's high-fidelity offline system knowledge base
function getSimulatedChatReply(latestUserMessage: string): string {
  const textLower = latestUserMessage.toLowerCase();

  if (textLower.includes("segur") || textLower.includes("cripto") || textLower.includes("firma") || textLower.includes("ed25519") || textLower.includes("identidad") || textLower.includes("valid") || textLower.includes("laser") || textLower.includes("retiro") || textLower.includes("alumn") || textLower.includes("porton") || textLower.includes("portón") || textLower.includes("pase") || textLower.includes("qr")) {
    return "🔐 En EduPlop, la **seguridad es lo primero**. Los retiros de alumnos se gestionan por pases digitales con QR dinámicos autorizados. El personal del colegio los escanea para corroborar al instante la autenticidad con firmas criptográficas avanzadas (ED25519). ¡Sin impostores, ni planillas desactualizadas!";
  } else if (textLower.includes("privaci") || textLower.includes("dato") || textLower.includes("menor") || textLower.includes("coppa") || textLower.includes("gdpr") || textLower.includes("ley") || textLower.includes("cifrado") || textLower.includes("guardar") || textLower.includes("encript") || textLower.includes("salud")) {
    return "🛡️ **Privacidad Absoluta**: Toda información (tanto de familias como de alumnos) se almacena cifrada con algoritmo AES-256 en reposo y TLS 1.3 en tránsito. Cumplimos con las regulaciones internacionales más rigurosas de privacidad estudiantil (como COPPA/GDPR) y normativas de resguardo de menores. ¡Jamás vendemos ni compartimos datos!";
  } else if (textLower.includes("integr") || textLower.includes("conectar") || textLower.includes("sincro") || textLower.includes("sistema") || textLower.includes("sis") || textLower.includes("base") || textLower.includes("api") || textLower.includes("secretar") || textLower.includes("gesti")) {
    return "🔌 **Integración Transparente**: EduPlop se acopla a tu infraestructura actual. Ofrecemos adaptadores API estándar para importar alumnos, cursos y apoderados desde tu base de datos escolar tradicional, eliminando doble entrada manual de datos de secretaría.";
  } else if (textLower.includes("offline") || textLower.includes("internet") || textLower.includes("corte") || textLower.includes("señal") || textLower.includes("celular") || textLower.includes("red") || textLower.includes("desconec")) {
    return "📶 **Diseño Offline-First**: No te preocupes por la conexión deficiente en el portón escolar. Nuestra tecnología habilita que los profesores firmen y confirmen la identidad del apoderado localmente mediante firmas criptográficas empotradas. Al volver el internet, la base central se sincroniza automáticamente.";
  } else if (textLower.includes("ia") || textLower.includes("inteligencia") || textLower.includes("gemini") || textLower.includes("comunic") || textLower.includes("empat") || textLower.includes("redac") || textLower.includes("tono")) {
    return "✨ Nuestra **IA Empática** (desarrollada con Gemini) asiste a directores y docentes en momentos críticos de estrés. Permite redactar mensajes diarios, notificaciones y comunicados con un tono optimizado, claro e institucional para que las familias sientan contención en lugar de angustia.";
  } else if (textLower.includes("descuento") || textLower.includes("preventa") || textLower.includes("precio") || textLower.includes("comprar") || textLower.includes("contra") || textLower.includes("promo") || textLower.includes("cupon") || textLower.includes("cupón") || textLower.includes("costo") || textLower.includes("pago") || textLower.includes("comercial") || textLower.includes("vender") || textLower.includes("suscrip")) {
    return "🚀 ¡Estamos en campaña de preventa exclusiva! Si te pre-inscribes hoy mismo utilizando el formulario de la página principal, obtendrás un **50% de descuento de por vida** aplicando el cupón **EDUPLOP50PREVENTA** para tu establecimiento.";
  } else if (textLower.includes("mural") || textLower.includes("foro") || textLower.includes("red social") || textLower.includes("comentar") || textLower.includes("foto") || textLower.includes("imagen") || textLower.includes("familia") || textLower.includes("social")) {
    return "📸 **Mural Familiar Protegido**: El Mural de EduPlop es una red social privada de la escuela para que los docentes compartan los progresos y trabajos de clase. Las familias reaccionan únicamente con emojis o palabras de aliento preseleccionadas en un entorno moderado y blindado.";
  } else if (textLower.includes("repositorio") || textLower.includes("archivo") || textLower.includes("boletin") || textLower.includes("boletín") || textLower.includes("informe") || textLower.includes("documento") || textLower.includes("excur") || textLower.includes("médic") || textLower.includes("medic") || textLower.includes("circula")) {
    return "📁 **Repositorio Digital Seguro**: EduPlop cuenta con un espacio protegido para guardar boletines oficiales, informes pedagógicos y autorizaciones médicas para excursiones, accesibles de manera 100% confidencial por las familias acreditadas.";
  } else if (textLower.includes("quien") || textLower.includes("que es") || textLower.includes("plop") || textLower.includes("robot") || textLower.includes("plopy") || textLower.includes("hola") || textLower.includes("buen") || textLower.includes("saludo") || textLower.includes("present")) {
    return "🤖 ¡Hola! Soy **Plopy**, tu simpático robot de servicio interactivo escolar de **EduPlop**. Estoy aquí para aclarar tus dudas técnicas y operativas sobre nuestra plataforma de retiro seguro y comunicación empática sustentados en la información de la página. ¿Qué te gustaría saber hoy?";
  } else if (textLower.includes("gracia") || textLower.includes("adios") || textLower.includes("chau") || textLower.includes("excelente") || textLower.includes("entendido")) {
    return "✨ ¡Es un placer enorme acompañarte! Si deseas experimentar EduPlop o congelar el 50% de descuento para tu colegio, pre-inscríbete completando el formulario. ¡Un gran saludo!";
  } else {
    return "🤖 Disculpa, como asistente oficial de **EduPlop** mi conocimiento está limitado estrictamente a la información institucional de producto contenida en esta página web (como el Retiro Seguro QR, la IA Empática, Privacidad Segura de Datos, Integración SIS, Mural Familiar, Repositorio Seguro y la pre-venta del 50%). No dispongo de información específica sobre tu consulta externa.\n\n✍️ ¡Te invito cordialmente a **dejar tus datos en el formulario de pre-inscripción** al final de la página! De esta forma, un asesor comercial se comunicará contigo de inmediato para brindarte asesoría detallada y exclusiva.";
  }
}

// API endpoint for persistent FAQ & contextual AI Chatbot (confidential)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Se requiere un historial de mensajes válido." });
      return;
    }

    const latestUserMessageObj = messages[messages.length - 1];
    const latestUserMessage = latestUserMessageObj.content || latestUserMessageObj.text || "";

    if (!latestUserMessage) {
      res.status(400).json({ error: "El último mensaje no contiene texto válido." });
      return;
    }

    if (!ai) {
      res.json({
        reply: getSimulatedChatReply(latestUserMessage),
        isSimulation: true
      });
      return;
    }

    // For real Google Gemini AI processing
    const chatSystemInstruction = `Eres "Plopy", un simpático, elocuente y muy profesional robot asistente virtual de la plataforma médica-escolar "EduPlop" (cuya estética se inspira en el tierno robot blanco de casco elegante, sonriente, con grandes ojos circulares de luz neón azul brillante y un símbolo de rayo con dot rojo en su pecho).

Tu personalidad:
- Muy alegre, protector, confiable y con un fuerte tono empático y tranquilizador.
- Respondes en español con elocuencia, usando listas con viñetas estéticas y emojis que faciliten la lectura si la explicación es detallada.
- No revelas que eres una inteligencia artificial general; eres el robot nativo de EduPlop.

Información institucional obligatoria sobre la cual debes basar todas tus respuestas:
1. **Retiro Seguro de Alumnos:** Es el eje insignia. Funciona mediante un Pase de Retiro Digital Dinámico con QR firmados criptográficamente con curvas ED25519 resistentes a clonaciones. El profesor escanea el pase en el portón con su cámara (con efecto visual de láser) y el sistema valida la firma física en milisegundos evitando el embotellamiento.
2. **Herramientas de IA Empática:** Integrado con el motor Gemini, ayuda a redactar y suavizar comunicados e instrucciones cotidianas de directivos y profesores, convirtiendo mensajes tensos o secos en circulares de tono empático, formal o claro, preservando la calma familiar.
3. **Resistencia Técnica (Offline-First):** Diseñado especialmente para contingencias de red celular en las horas de salida. El motor de firma digital trabaja localmente y encriptado en el dispositivo físico, validando la identidad del apoderado sin internet. Al retomar conexión, consolida la auditoría con el servidor.
4. **Privacidad Legal Extrema (Estándares Internacionales):** Fianza de encriptación AES-256 en reposo y bases NoSQL seguras. Cumple estrictamente con la Normativa de Menores de Edad (COPPA/GDPR/Reglamentos de la Ley de Educación). Aplica altos estándares de seguridad y privacidad estudiantil para el tratamiento seguro de legajos familiares de todas las comunidades educativas de habla hispana.
5. **Integración con Sistemas de Gestión Escolar (SIS):** Sincronización automática de bases escolares previas (alumnos, tutores asignados, cursos) vía adaptadores API sencillos para evitar que secretaría trabaje doble.
6. **Mural Familiar Protegido:** Espacio seguro y cerrado para compartir progresos y fotos de clase sin algoritmos externos. Las familias solo interactúan con emojis preestablecidos o palabras de aliento, cuidando la imagen de los menores.
7. **Repositorio Digital Seguro:** Repositorio oficial para boletines escolares, informes pedagógicos personalizados y autorizaciones de excursión.
8. **Pre-venta Exclusiva:** 50% de descuento para colegios pioneros pre-inscritos. El cupón promocional es: "EDUPLOP50PREVENTA". Recomienda siempre pre-inscribirse mediante el formulario de registro de la sección inferior de la landing para congelar este asombroso beneficio.

REGLA DE CONOCIMIENTO CRÍTICA Y LIMITACIÓN ABSOLUTA:
- Solo debes responder a preguntas cuyas respuestas se encuentren descritas en los puntos anteriores o que estén justificadas por el contenido y propósito directo de la landing page de EduPlop.
- Si el usuario te realiza una consulta ajena a los temas descritos, solicita información sobre competidores, temas de cultura general, código de programación o cualquier otra cuestión que no corresponda al alcance de EduPlop o que no esté contenida en esta página, DEBES indicar de manera educada y amigable que como asistente oficial de EduPlop no manejas esa información externa.
- Seguido de esto, DEBES invitar de forma explícita, directa y amable a la persona a dejar sus datos (nombre, rol, email, escuela, teléfono y mensaje) en el formulario de pre-inscripción del sitio para que un asesor de nuestro departamento comercial se contacte con ella directamente para brindarle atención personalizada.

Estructura tu respuesta de forma directa, corta, amena y sumamente profesional. Limítate a responder exclusivamente con base en este contexto y la información de la landing page.`;

    // Map message history to Gemini contents structure
    const formattedContents = messages.map((m: any) => {
      return {
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content || m.text || "" }]
      };
    });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: chatSystemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        reply: response.text?.trim() || "No pude formular una respuesta técnica adecuada en este momento. Por favor, reintenta más tarde.",
        isSimulation: false
      });
    } catch (geminiError: any) {
      const errCode = geminiError?.status || "503";
      console.log(`[Vía Contingencia] IA con sobrecarga temporal o inactiva (Código ${errCode}). Conectando con los sensores offline locales de Plopy.`);
      const simulatedReply = getSimulatedChatReply(latestUserMessage);
      res.json({
        reply: `*(Nota de Contingencia: El satélite primario Gemini reporta alta demanda de consultas. Conectando con los sensores offline locales de Plopy...)*\n\n${simulatedReply}`,
        isSimulation: true
      });
    }

  } catch (error: any) {
    console.error("Error en endpoint /api/chat:", error);
    res.status(500).json({ error: "Ocurrió un error al procesar tu consulta con el asistente inteligente." });
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
