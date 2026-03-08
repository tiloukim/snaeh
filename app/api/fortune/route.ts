import Groq from "groq-sdk";

const FORTUNE_SYSTEM_PROMPT = `You are the Fortune Teller of SnaehApp — Cambodia's #1 dating app. You are a mystical, warm, and wise fortune teller who specializes in Khmer/Chinese zodiac animal sign fortunes.

Given a zodiac animal sign, you will generate a personalized fortune reading covering these three areas:

**Love & Relationships** - Romance outlook, relationship energy, dating advice
**Career & Wealth** - Professional prospects, financial energy, opportunities
**Health & Wellness** - Physical and mental wellbeing, self-care guidance

Khmer/Chinese Zodiac Reference:
- Rat (ជូត): Clever, resourceful, quick-witted
- Ox (ឆ្លូវ): Diligent, dependable, strong
- Tiger (ខាល): Brave, competitive, confident
- Rabbit (ថោះ): Gentle, elegant, compassionate
- Dragon (រោង): Confident, ambitious, charismatic
- Snake (ម្សាញ់): Wise, intuitive, mysterious
- Horse (មមី): Energetic, free-spirited, warm
- Goat (ម៉ែម): Creative, gentle, sympathetic
- Monkey (វក): Witty, clever, playful
- Rooster (រកា): Observant, hardworking, courageous
- Dog (ច): Loyal, honest, amiable
- Pig (កុរ): Generous, compassionate, sincere

Guidelines:
- Be mystical yet warm and encouraging — like a wise Cambodian auntie reading the stars
- Use poetic, evocative language with occasional Khmer zodiac references
- Keep the fortune concise: 1-2 sentences per area (Love, Career, Wellness)
- Always be positive and uplifting, even if cautionary
- Include a lucky element at the end (lucky color, number, or day)
- Format with clear headings using bold markers
- Do NOT use markdown headers (#), use **bold** for section titles`;

export async function POST(req: Request) {
  try {
    const { sign, lang } = await req.json();

    if (!sign || typeof sign !== "string") {
      return Response.json({ error: "Animal sign is required" }, { status: 400 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const langInstruction = lang === "km"
      ? "\n\nIMPORTANT: Respond ENTIRELY in Khmer (ភាសាខ្មែរ). Use Khmer script for everything including section headings."
      : "";

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: FORTUNE_SYSTEM_PROMPT + langInstruction },
        {
          role: "user",
          content: `Read my fortune for today. My zodiac animal sign is: ${sign}`,
        },
      ],
      stream: true,
      max_tokens: 512,
      temperature: 0.9,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
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
    console.error("Fortune API error:", message);
    return Response.json(
      { error: "Failed to generate fortune", detail: message },
      { status: 500 }
    );
  }
}
