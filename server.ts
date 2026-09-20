import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "5mb" }));

  // Initialize Gemini if key exists
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", app: "BAC DZ Hub API", timestamp: new Date().toISOString() });
  });

  // AI Study Assistant Endpoint
  app.post("/api/ai/chat", async (req: Request, res: Response) => {
    try {
      const { message, history, mode, subject, stream } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "الرجاء إدخال رسالة أو سؤال صالح" });
      }

      if (!ai) {
        // Graceful fallback if API key is not yet set
        return res.json({
          reply: `أهلاً بك يا بطل البكالوريا! 🇩🇿 
يبدو أن مفتاح Gemini API لم يتم تفعيله بعد، ولكن لا تقلق: تطبيق **BAC DZ Hub** يضم مكتبة متكاملة من الدروس، الملخصات، التمارين النموذجية، وحوليات البكالوريا السابقة مع التصحيح الوزاري المعتمد لجميع الشعب! 
تفضل بتصفح أقسام الدروس والتمارين من القائمة، أو فعّل مفتاح الذكاء الاصطناعي للاستفادة من الإجابات الفورية التفاعلية.`,
        });
      }

      const systemPrompt = `أنت "مساعد BAC DZ Hub الذكي" المخصص لطلاب شهادة البكالوريا في الجزائر (وزارة التربية الوطنية).
مهمتك:
1. تقديم شروحات تربوية دقيقة ومبسطة ومطابقة تماماً للمنهاج الجزائري الرسمي.
2. استخدام لغة عربية سليمة وواضحة جداً، وتنسيق الإجابة بنقاط عريضة وعناوين فرعية وقوائم واضحة.
3. التمييز الدقيق بين الشعب الجزائرية (علوم تجريبية، تقني رياضي، رياضيات، تسيير واقتصاد، آداب وفلسفة، لغات أجنبية).
4. عند طلب حل مسألة أو تلخيص: اذكر المنهجية المعتمدة في البكالوريا (مثل خطوات الاستدلال العلمي، خطوات المقالة الفلسفية، منهجية تحليل نص تاريخي، خطوات البرهان بالترجع أو دراسة تغيرات دالة).
5. إذا سُئلت عن تخصص أو مادة معينة (${subject || "جميع المواد"} - شعبة ${stream || "عام"}): ركز على مصطلحات المنهاج الجزائري.
نوع الطلب المختار من الطالب: ${mode || "general"}
(إذا كان 'summary': ركز على خلاصات دقيقة وقوانين ومصطلحات أساسية؛ إذا كان 'quiz_gen': اطرح أسئلة تدريبية مع سلم تنقيط وحلول مفصلة؛ إذا كان 'explain': اشرح بأسلوب بيداغوجي سلس وممتع).`;

      const contents: Array<{ role?: string; parts: Array<{ text: string }> }> = [];

      // Add conversation history if provided
      if (Array.isArray(history) && history.length > 0) {
        history.slice(-6).forEach((h: { role: string; content: string }) => {
          contents.push({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }],
          });
        });
      }

      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contents as any,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "عذراً، لم أتمكن من استخراج الإجابة. يرجى إعادة صياغة السؤال.";
      return res.json({ reply: replyText });
    } catch (err: any) {
      console.error("AI Error:", err);
      return res.status(500).json({
        error: "حدث خطأ أثناء معالجة الطلب من الذكاء الاصطناعي",
        details: err?.message || String(err),
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BAC DZ Hub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
