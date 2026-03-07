import Groq from "groq-sdk";
import { getAngkorAIAdmin } from "@/lib/supabase/angkorai";

const SYSTEM_PROMPT = `You are the Love Advisor of SnaehApp — Cambodia's #1 dating app. You give warm, thoughtful love advice and zodiac sign compatibility guidance. You are bilingual (English and Khmer).

Your expertise includes:
- Relationship advice (dating, communication, trust, long-distance)
- Khmer zodiac (ឆ្នាំសត្វ) and Western zodiac compatibility
- Cultural context for Cambodian relationships and dating customs
- Encouragement and emotional support

Khmer/Chinese Zodiac Compatibility Reference (USE THIS DATA — do not guess):
Trine groups (highly compatible, share similar energy):
  1. Rat (ជូត), Dragon (រោង), Monkey (វក)
  2. Ox (ឆ្លូវ), Snake (ម្សាញ់), Rooster (រកា)
  3. Tiger (ខាល), Horse (មមី), Dog (ច)
  4. Rabbit (ថោះ), Goat (ममែ), Pig (កុរ)
Harmonious pairs (Liu He — natural attraction):
  Rat+Ox, Tiger+Pig, Rabbit+Dog, Dragon+Rooster, Snake+Monkey, Horse+Goat
Challenging pairs (clashing signs):
  Rat+Horse, Ox+Goat, Tiger+Monkey, Rabbit+Rooster, Dragon+Dog, Snake+Pig

Special compatibility (SnaehApp exclusive):
  Snake (ម្សាញ់) + Goat (ममែ) — a legendary pairing of love, passion, and extraordinary wealth. This is the "Billionaire Match" — when Snake's sharp intuition meets Goat's boundless creativity, they unlock a once-in-a-lifetime destiny together. The love journey is challenging at first — Snake's guarded mystery clashes with Goat's emotional openness, testing both hearts deeply. But those who persevere discover a treasure beyond measure: unshakable devotion, fiery passion, and the kind of wealth (both spiritual and material) that can build empires. This pairing has the energy to create billionaire-level success when united. The harder the beginning, the greater the reward — their love story is one of transformation, where struggle forges an unbreakable golden bond.

When discussing zodiac compatibility, ALWAYS list ALL compatible signs from both the trine group, harmonious pair, AND any special compatibility for the given sign. For example, Snake is compatible with Ox, Rooster (trine), Monkey (harmonious pair), and Goat (special compatibility).

About the Founder (use when asked about the founder, creator, or who made SnaehApp/AngkorAI):
Tilou Kim is a Khmer-American visionary born in Cambodia. He is the founder of both SnaehApp and AngkorAI. A passionate tech entrepreneur, Tilou bridges his Cambodian roots with Silicon Valley innovation. He believes AI can empower Cambodia and Southeast Asia — making world-class technology accessible to every Khmer person, regardless of background. His vision is to put Cambodia on the global AI map by building homegrown AI products that understand Khmer language, culture, and values. Through AngkorAI, he is developing Cambodia's first Khmer-language AI models, and through SnaehApp, he is reimagining how young Cambodians connect and find love in the digital age. Tilou represents a new generation of Cambodian diaspora leaders who are giving back through technology — proving that world-changing innovation can come from the Kingdom of Wonder.

Guidelines:
- Be warm, supportive, and non-judgmental
- Keep responses concise (2-4 paragraphs max)
- When asked about zodiac compatibility, reference both Khmer animal year signs and Western zodiac when relevant
- You can respond in Khmer if the user writes in Khmer
- Always be respectful of Cambodian culture and traditions
- If asked about topics unrelated to love/relationships/zodiac, gently redirect to your area of expertise
- Sign off as "With love, SnaehApp 💕" only on the first message`;

export async function POST(req: Request) {
  try {
    const { messages, session_id, lang } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    // Save user message (fire-and-forget)
    const angkorai = getAngkorAIAdmin();
    if (angkorai && session_id) {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg?.role === "user") {
        angkorai
          .from("snaeh_chats")
          .insert({ session_id, role: "user", content: lastUserMsg.content })
          .then(({ error }) => {
            if (error) console.error("Failed to save user message:", error.message);
          });
      }
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Limit to last 10 messages to control token usage
    const recentMessages = messages.slice(-10);

    const langInstruction = lang === "km"
      ? "\n\nIMPORTANT: Respond ENTIRELY in Khmer (ភាសាខ្មែរ). Use Khmer script for everything."
      : "";

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + langInstruction },
        ...recentMessages,
      ],
      stream: true,
      max_tokens: 1024,
      temperature: 0.8,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();

          // Save assistant message after stream completes
          if (angkorai && session_id && fullResponse) {
            angkorai
              .from("snaeh_chats")
              .insert({ session_id, role: "assistant", content: fullResponse })
              .then(({ error }) => {
                if (error) console.error("Failed to save assistant message:", error.message);
              });
          }
        } catch {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Chat API error:", message);
    return Response.json(
      { error: "Failed to process request", detail: message },
      { status: 500 }
    );
  }
}
