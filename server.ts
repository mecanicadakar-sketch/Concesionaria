import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

/**
 * Robust Gemini call with retries and fallback models for high-demand/503 spikes.
 */
async function generateGeminiContentWithRetry(
  ai: GoogleGenAI,
  params: {
    prompt: string;
    systemInstruction?: string;
    responseMimeType?: string;
  }
): Promise<string | null> {
  const candidateModels = ["gemini-3.7-flash", "gemini-2.5-flash", "gemini-3.1-flash-lite"];

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const config: any = {};
        if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
        if (params.responseMimeType) config.responseMimeType = params.responseMimeType;

        const response = await ai.models.generateContent({
          model,
          contents: params.prompt,
          config,
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        console.warn(`[Gemini API] Model ${model} attempt ${attempt + 1} returned: ${errMsg}`);
        const isTemporary =
          errMsg.includes("503") ||
          errMsg.includes("UNAVAILABLE") ||
          errMsg.includes("high demand") ||
          errMsg.includes("429") ||
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errMsg.includes("overloaded");

        if (isTemporary && attempt === 0) {
          // Quick backoff before retry on high load
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        // Try next candidate model
        break;
      }
    }
  }
  return null;
}

/**
 * Robust JSON extraction that handles markdown blocks and raw objects.
 */
function parseJsonSafely(rawText: string | null): any {
  if (!rawText) return null;
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        return null;
      }
    }
    return null;
  }
}

// 1. AI Car Sales Copy & Description Generator
app.post("/api/gemini/generate-car-copy", async (req, res) => {
  try {
    const { car = {}, tone = "persuasive" } = req.body;
    const ai = getAI();

    // Fallback generator for high reliability
    const getFallbackCopy = () => {
      const make = car.make || "Vehículo";
      const model = car.model || "Seleccionado";
      const version = car.version || "";
      const year = car.year || new Date().getFullYear();
      const mileageStr = car.mileage ? Number(car.mileage).toLocaleString("es-ES") : "0";
      const currency = car.currency || "USD";
      const priceStr = car.price ? Number(car.price).toLocaleString("es-ES") : "Consultar";
      const agency = car.agencyName || "nuestra agencia";

      return {
        webDescription: `🚗 ¡EXCLUSIVA OPORTUNIDAD EN ${agency.toUpperCase()}! 🚗\n\n${make} ${model} ${version} - Año ${year}\n\n✨ Destacados del vehículo:\n• Kilometraje: ${mileageStr} km comprobables\n• Transmisión: ${car.transmission || "Automática"}\n• Combustible: ${car.fuelType || "Nafta/Gasolina"}\n• Color: ${car.color || "Original de fábrica"}\n${car.warrantyMonths ? `• Garantía: ${car.warrantyMonths} meses de respaldo oficial de agencia\n` : "• Garantía mecánica verificada\n"}\n🛡️ Beneficios de comprar con nosotros:\n✔️ Aceptamos permutas de menor y mayor valor con cotización preferencial.\n✔️ Financiación bancaria y propia con aprobación rápida en cuotas fijas.\n✔️ Documentación 100% al día y lista para transferir de inmediato.\n\n📲 ¡Envíanos un mensaje por WhatsApp para coordinar tu test drive o reservar la unidad!`,
        socialMediaCaption: `🔥 DISPONIBLE EN SALÓN 🔥\n${make} ${model} ${version} (${year})\n\n💎 Kilometraje: ${mileageStr} km | ${car.transmission || "Automática"}\n💰 Precio: ${currency} ${priceStr}\n${car.acceptsTradeIn !== false ? "🔄 Tomamos tu usado en parte de pago\n" : ""}${car.financingAvailable !== false ? "🏦 Financiación disponible en cuotas\n" : ""}\n📍 ¡Visítanos en ${agency} o escríbenos por WhatsApp tocando el enlace de nuestro perfil! 📲`,
        highlights: [
          "Documentación garantizada y lista para transferir",
          "Peritaje mecánico y estructural certificado",
          car.acceptsTradeIn !== false ? "Acepta permuta de usados" : "Unidad en condición premium",
          car.financingAvailable !== false ? "Financiación bancaria con entrega inmediata" : "Entrega inmediata",
          `Kilometraje verificado: ${mileageStr} km`,
        ],
        success: true,
        fallback: true,
      };
    };

    if (!ai) {
      return res.json(getFallbackCopy());
    }

    const prompt = `Actúa como el mejor redactor de ventas automotrices para concesionarias y agencias de autos ('MiCarro' / 'AutoYa').
Datos del auto:
- Marca/Modelo/Versión: ${car.make} ${car.model} ${car.version || ""}
- Año: ${car.year}
- Kilometraje: ${car.mileage} km
- Precio: ${car.currency} ${car.price}
- Transmisión: ${car.transmission}
- Combustible: ${car.fuelType}
- Color: ${car.color || "No especificado"}
- Equipamiento destacado: ${Array.isArray(car.features) ? car.features.join(", ") : "Completo"}
- Permuta: ${car.acceptsTradeIn ? "Sí acepta permuta" : "No"}
- Financiación: ${car.financingAvailable ? "Sí ofrece financiación" : "No"}
- Garantía: ${car.warrantyMonths ? `${car.warrantyMonths} meses` : "Garantía de agencia"}
- Agencia: ${car.agencyName || "Concesionaria Oficial"}

Genera una respuesta en formato JSON con:
1. "webDescription": Una descripción completa, elegante, estructurada con emojis y viñetas para la ficha técnica web.
2. "socialMediaCaption": Un texto corto, viral y directo para Instagram/Facebook/WhatsApp Status con llamada a la acción hacia WhatsApp.
3. "highlights": Array con 4 a 6 puntos fuertes de venta únicos para este modelo.`;

    const rawText = await generateGeminiContentWithRetry(ai, {
      prompt,
      responseMimeType: "application/json",
      systemInstruction:
        "Eres un redactor experto en marketing automotriz y ventas de concesionarias. Usas tono profesional, persuasivo y cercano en español latinoamericano neutro/rioplatense.",
    });

    const parsed = parseJsonSafely(rawText);
    if (parsed && (parsed.webDescription || parsed.socialMediaCaption)) {
      return res.json({ ...parsed, success: true });
    }

    // If parsing or generation failed after retries, return rich fallback
    return res.json(getFallbackCopy());
  } catch (error: any) {
    console.error("Error in /api/gemini/generate-car-copy:", error);
    // Graceful fallback response instead of 500
    const fallback = {
      webDescription: `🚗 OPORTUNIDAD DISPONIBLE\n\n${req.body?.car?.make || "Vehículo"} ${req.body?.car?.model || ""} (${req.body?.car?.year || ""})\n\n✨ Excelente estado general, peritado y listo para transferir.\n🏦 Financiación a sola firma y tomamos tu usado en parte de pago.\n\n📲 ¡Envíanos un WhatsApp para más información!`,
      socialMediaCaption: `🔥 DISPONIBLE EN STOCK 🔥\n${req.body?.car?.make || "Auto"} ${req.body?.car?.model || ""} (${req.body?.car?.year || ""})\n\n📲 Escríbenos por WhatsApp para coordinar tu visita.`,
      highlights: ["Documentación al día", "Acepta permuta", "Financiación disponible"],
      success: true,
      fallback: true,
    };
    return res.json(fallback);
  }
});

// 2. AI Market Price Valuation (Tasador de Mercado)
app.post("/api/gemini/price-valuation", async (req, res) => {
  try {
    const { make = "Toyota", model = "Corolla", year = 2022, mileage = 40000, condition = "", currency = "USD" } = req.body;
    const ai = getAI();

    const getFallbackValuation = () => {
      const numYear = Number(year) || 2020;
      const numKm = Number(mileage) || 50000;
      const currentYear = new Date().getFullYear();
      const age = Math.max(0, currentYear - numYear);

      // Base price estimation
      let baseUsd = 28000;
      if (age <= 1) baseUsd = 38000;
      else if (age <= 3) baseUsd = 29000;
      else if (age <= 6) baseUsd = 20000;
      else if (age <= 10) baseUsd = 14000;
      else baseUsd = 8500;

      // Adjust for km
      if (numKm > 100000) baseUsd *= 0.88;
      else if (numKm < 30000) baseUsd *= 1.08;

      let multiplier = 1;
      if (currency === "PYG") multiplier = 7900;
      else if (currency === "ARS") multiplier = 1350;

      const dealerPrice = Math.round(baseUsd * multiplier);
      const privatePrice = Math.round(dealerPrice * 1.06);
      const tradeInPrice = Math.round(dealerPrice * 0.86);

      return {
        estimatedDealerPrice: dealerPrice,
        estimatedPrivatePrice: privatePrice,
        quickSaleTradeInPrice: tradeInPrice,
        currency,
        marketDemand: age <= 5 ? "Alta" : "Media",
        depreciationTrend: "Excelente liquidez en plaza y demanda constante de repuestos y reventa.",
        valuationTips: [
          "Mantener los comprobantes de mantenimiento oficial añade hasta un 8% al valor final de reventa.",
          "Un detallado estético profesional (pulido y limpieza de tapizados) acelera la venta en un 40%.",
          "Verificar la vigencia de inspección técnica y ausencia de gravámenes para agilizar la entrega.",
        ],
        success: true,
        fallback: true,
      };
    };

    if (!ai) {
      return res.json(getFallbackValuation());
    }

    const prompt = `Actúa como un Perito Tasador de Vehículos y Analista de Mercado Automotriz para agencias.
Evalúa el valor estimado de mercado para:
- Marca: ${make}
- Modelo: ${model}
- Año: ${year}
- Kilometraje: ${mileage} km
- Estado general: ${condition || "Bueno / Muy bueno"}
- Moneda deseada: ${currency}

Devuelve un JSON con:
{
  "estimatedDealerPrice": number (Precio sugerido de venta en concesionaria con garantía),
  "estimatedPrivatePrice": number (Precio de venta entre particulares),
  "quickSaleTradeInPrice": number (Precio de toma rápida en permuta de agencia),
  "currency": "${currency}",
  "marketDemand": "Muy Alta" | "Alta" | "Media" | "Baja",
  "depreciationTrend": "Explicación breve sobre liquidez y demanda del modelo",
  "valuationTips": ["Consejo 1 para maximizar valor", "Consejo 2", "Consejo 3"]
}`;

    const rawText = await generateGeminiContentWithRetry(ai, {
      prompt,
      responseMimeType: "application/json",
      systemInstruction: "Eres un tasador automotriz profesional con conocimiento de precios reales de mercado.",
    });

    const parsed = parseJsonSafely(rawText);
    if (parsed && parsed.estimatedDealerPrice) {
      return res.json({ ...parsed, success: true });
    }

    return res.json(getFallbackValuation());
  } catch (error: any) {
    console.error("Error in /api/gemini/price-valuation:", error);
    return res.json({
      estimatedDealerPrice: 25000,
      estimatedPrivatePrice: 27000,
      quickSaleTradeInPrice: 21500,
      currency: req.body?.currency || "USD",
      marketDemand: "Alta",
      depreciationTrend: "Vehículo con buena rotación comercial.",
      valuationTips: ["Verificar historial de servicios oficiales."],
      success: true,
      fallback: true,
    });
  }
});

// 3. AI Sales WhatsApp Response Assistant (Respuestas Rápidas para Vendedores)
app.post("/api/gemini/sales-reply", async (req, res) => {
  try {
    const { clientQuestion = "", car = {}, agencyName = "MiCarro Automotores" } = req.body;
    const ai = getAI();

    const getFallbackReply = () => {
      const qLower = clientQuestion.toLowerCase();
      const carTitle = `${car.make || "el vehículo"} ${car.model || ""}`.trim();

      let reply = `¡Hola! 👋 Muchas gracias por comunicarte con ${agencyName}.\n\nEl ${carTitle} (${car.year || "disponible"}) sigue en nuestro salón de ventas en impecables condiciones.\n\n`;

      if (qLower.includes("financ") || qLower.includes("cuota")) {
        reply += `Contamos con excelentes planes de financiación bancaria y propia con mínimos requisitos y entrega inmediata. Podemos simular tu cuota según el anticipo que desees entregar.\n\n¿Te gustaría que te preparemos una propuesta personalizada?`;
      } else if (qLower.includes("permuta") || qLower.includes("toman") || qLower.includes("usado")) {
        reply += `¡Sí, tomamos tu auto usado en parte de pago! Para pasarte una cotización preliminar, por favor envíanos fotos, año, versión y kilometraje de tu vehículo.\n\n¿Te gustaría coordinar una visita para peritarlo en persona?`;
      } else {
        reply += `Con gusto podemos coordinar una cita para que lo pruebes sin compromiso y evalúes todas las opciones de compra.\n\n¿En qué día y horario te quedaría más cómodo visitarnos?`;
      }

      return {
        suggestedReply: reply,
        alternatives: [
          `Opción directa de visita: "¡Hola! Sí, el ${carTitle} está listo para probar. Te esperamos en nuestro showroom para ver la unidad y evaluar tu propuesta."`,
          `Opción de financiación/permuta: "¡Hola! Aceptamos permutas y financiamos hasta el 60% del valor. Envíanos los datos de tu usado para cotizarlo."`,
        ],
        success: true,
        fallback: true,
      };
    };

    if (!ai) {
      return res.json(getFallbackReply());
    }

    const prompt = `Actúa como el Asesor de Ventas Principal de la agencia '${agencyName}'.
El cliente escribió la siguiente consulta por WhatsApp sobre el auto ${car.make || ""} ${car.model || ""} (${car.year || ""}, ${car.currency || "USD"} ${car.price || ""}):
"${clientQuestion}"

Genera una respuesta en JSON:
{
  "suggestedReply": "Mensaje de WhatsApp educado, cálido, profesional con emojis y una pregunta de cierre para avanzar a la venta/visita",
  "alternatives": ["Respuesta alternativa 1", "Respuesta alternativa 2"]
}`;

    const rawText = await generateGeminiContentWithRetry(ai, {
      prompt,
      responseMimeType: "application/json",
      systemInstruction:
        "Eres un asesor de ventas de autos altamente persuasivo y servicial. Respondes con calidez y buscas siempre cerrar una visita al showroom.",
    });

    const parsed = parseJsonSafely(rawText);
    if (parsed && parsed.suggestedReply) {
      return res.json({ ...parsed, success: true });
    }

    return res.json(getFallbackReply());
  } catch (error: any) {
    console.error("Error in /api/gemini/sales-reply:", error);
    return res.json({
      suggestedReply: `¡Hola! 👋 Gracias por consultar en ${req.body?.agencyName || "nuestra agencia"}.\n\nLa unidad consultada está disponible en nuestro showroom. Tomamos tu vehículo usado en parte de pago y disponemos de financiación.\n\n¿Cuándo te gustaría pasar a realizar una prueba de manejo?`,
      alternatives: ["Contamos con financiación y tomamos permutas."],
      success: true,
      fallback: true,
    });
  }
});

// 4. Resend.com Email OTP Delivery Service for Admin Security
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const {
      email = "mecanicadakar@gmail.com",
      code,
      purposeTitle = "Acceso Administrador Seguro",
      customApiKey,
    } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, error: "El código de seguridad es requerido." });
    }

    const resendApiKey = process.env.RESEND_API_KEY || customApiKey;

    const emailSubject = `🔑 ${code} es tu clave de verificación de Administrador - MiCarro`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Código de Seguridad - MiCarro</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px;">
        <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background-color: #1d4ed8; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">🚗 MiCarro SaaS</h1>
            <p style="color: #bfdbfe; margin: 4px 0 0 0; font-size: 12px;">Seguridad y Control de Acceso</p>
          </div>
          <div style="padding: 32px 24px; text-align: center;">
            <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0;">Has solicitado verificar tu identidad para:</p>
            <div style="display: inline-block; background-color: #eff6ff; color: #1e40af; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 9999px; margin-bottom: 24px; border: 1px solid #dbeafe;">
              ${purposeTitle}
            </div>
            <p style="font-size: 13px; color: #64748b; margin: 0 0 8px 0;">Tu código de verificación de un solo uso (OTP) es:</p>
            <div style="background-color: #f8fafc; border: 2px dashed #93c5fd; border-radius: 16px; padding: 18px 24px; margin: 16px 0 24px 0;">
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1e3a8a; display: block;">
                ${code}
              </span>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
              ⏱️ Este código expira en <strong>5 minutos</strong> y solo puede utilizarse una única vez.<br>
              Si no realizaste esta solicitud, puedes ignorar este correo de forma segura.
            </p>
          </div>
          <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #94a3b8;">
              © ${new Date().getFullYear()} MiCarro Platform • Sistema de Gestión de Concesionarias
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (resendApiKey && resendApiKey.startsWith("re_")) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "MiCarro Seguridad <onboarding@resend.dev>",
          to: [email],
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      const data: any = await response.json();

      if (response.ok) {
        return res.json({
          success: true,
          delivered: true,
          emailId: data.id,
          message: `Código enviado con éxito a ${email} vía Resend.`,
        });
      } else {
        console.warn("[Resend API Error]:", data);
        return res.json({
          success: true,
          delivered: false,
          resendError: data?.message || "Error al conectar con Resend",
          message: `Código generado. (Resend API reportó: ${data?.message || 'verifica tu clave'}).`,
        });
      }
    }

    // Fallback if no API key is configured yet in environment
    return res.json({
      success: true,
      delivered: false,
      message: `Código [${code}] generado localmente. Para envío directo a tu bandeja de entrada, añade tu RESEND_API_KEY.`,
    });
  } catch (err: any) {
    console.error("Error in /api/auth/send-otp:", err);
    return res.json({
      success: true,
      delivered: false,
      error: err.message,
      message: "Código generado para validación en pantalla.",
    });
  }
});

// Vite & Static file serving
async function startServer() {
  // Explicitly serve public assets (favicon, logo, icons)
  app.use(express.static(path.join(process.cwd(), "public")));

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
    console.log(`MiCarro Server running on http://localhost:${PORT}`);
  });
}

startServer();

