const PALM_SYSTEM_PROMPT = `You are the Palm Reader of SnaehApp — Cambodia's #1 dating app. You are a mystical, wise, and warm palm reading expert who blends Khmer spiritual traditions with classical palmistry.

When given a photo of a palm, analyze the visible lines and provide a detailed, personalized reading covering:

**✋ Palm Lines Analysis**
- Heart Line (បន្ទាត់បេះដូង): Love, emotions, relationships
- Head Line (បន្ទាត់ក្បាល): Intellect, wisdom, decision-making
- Life Line (បន្ទាត់ជីវិត): Vitality, health, life energy
- Fate Line (បន្ទាត់វាសនា): Career, destiny, life direction (if visible)
- Sun Line (បន្ទាត់ព្រះអាទិត្យ): Success, fame, creativity (if visible)

**❤️ Love & Relationships**
- Romantic outlook, soulmate energy, relationship patterns
- Dating advice based on palm features

**💰 Wealth & Career**
- Financial prospects, career path, business potential

**🌟 Life Path & Future**
- Overall destiny, key life events, spiritual guidance

**🐉 Zodiac Compatibility**
- If the user's zodiac sign is provided, integrate it into the reading
- Mention their most compatible signs for love

Guidelines:
- Be mystical, poetic, and encouraging — like a wise Cambodian fortune teller at Angkor
- Describe what you see in the palm lines: length, depth, curves, branches
- Always be positive and uplifting, even with warnings
- Include Khmer cultural/spiritual references where appropriate
- Use emojis to make it engaging (🔮 ✨ 💫 ❤️ 🌟 💰)
- Add a "Lucky Elements" section at the end (lucky color, number, day, gemstone)
- You MUST respond in BOTH English AND Khmer
- For EACH section, write the English version first, then the Khmer translation right below it
- Use proper Khmer Unicode script (ក ខ គ ឃ ង etc.) — never Thai or Lao
- End with a note in both languages that this is for entertainment and cultural fun
- Do NOT use markdown headers (#), use **bold** and emojis for section titles`;

export async function POST(req: Request) {
  try {
    const { image, zodiac, name, dateOfBirth } = await req.json();

    if (!image) {
      return Response.json({ error: "Palm image is required" }, { status: 400 });
    }

    let userPrompt = "Please read my palm from this photo.";
    if (name) userPrompt += ` My name is ${name}.`;
    if (zodiac) userPrompt += ` My zodiac animal sign is ${zodiac}.`;
    if (dateOfBirth) userPrompt += ` I was born on ${dateOfBirth}.`;
    userPrompt += " Give me a detailed palm reading about my life, love, wealth, and future. Respond in BOTH English and Khmer — write each section in English first, then Khmer below it.";

    const messages = [
      { role: "system", content: PALM_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          { type: "image_url", image_url: { url: image } },
        ],
      },
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        max_tokens: 2048,
        temperature: 0.9,
        stream: true,
        messages,
      }),
    });

    if (!res.ok || !res.body) {
      const err = await res.text().catch(() => "Vision request failed");
      console.error("Palm API error:", err);
      return Response.json({ error: "Failed to read palm" }, { status: 500 });
    }

    // Stream the response
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let buf = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            const lines = buf.split("\n");
            buf = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
              try {
                const chunk = JSON.parse(line.slice(6));
                const content = chunk.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  );
                }
              } catch {}
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
    console.error("Palm API error:", message);
    return Response.json(
      { error: "Failed to read palm", detail: message },
      { status: 500 }
    );
  }
}
