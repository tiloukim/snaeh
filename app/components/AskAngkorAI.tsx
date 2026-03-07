"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AskAngkorAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [lang, setLang] = useState<"en" | "km">("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleOpen() {
    setSessionId(crypto.randomUUID());
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setMessages([]);
    setInput("");
    setStreaming(false);
    setSessionId("");
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setStreaming(true);

    // Add empty assistant message for streaming
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, session_id: sessionId, lang }),
      });

      if (!res.ok) throw new Error("Failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const { content } = JSON.parse(data);
              if (content) {
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  copy[copy.length - 1] = {
                    ...last,
                    content: last.content + content,
                  };
                  return copy;
                });
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      {!open && (
        <button className="ai-chat-fab" onClick={handleOpen}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Ask ស្នេហ៍ AI</span>
        </button>
      )}

      {/* Chat Modal */}
      {open && (
        <div className="ai-chat-modal">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-title">Ask ស្នេហ៍ AI — Love AI</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                className="ai-chat-lang"
                onClick={() => setLang(lang === "en" ? "km" : "en")}
              >
                {lang === "en" ? "ខ្មែរ" : "EN"}
              </button>
              <button className="ai-chat-close" onClick={handleClose}>
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.length === 0 && (
              <div className="ai-chat-empty">
                <div className="ai-chat-empty-icon">💕</div>
                <p>
                  {lang === "en"
                    ? "Ask me about love advice, relationship tips, or zodiac compatibility!"
                    : "សួរខ្ញុំអំពីស្នេហា គន្លឹះទំនាក់ទំនង ឬភាពឆបគ្នាតាមរាសីចក្រ!"}
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.role === "user"
                    ? "ai-chat-bubble-user"
                    : "ai-chat-bubble-ai"
                }
              >
                {msg.content || (streaming && i === messages.length - 1 ? "..." : "")}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-chat-input-row">
            <input
              ref={inputRef}
              className="ai-chat-input"
              type="text"
              placeholder={lang === "en" ? "Ask about love or zodiac..." : "សួរអំពីស្នេហា ឬរាសីចក្រ..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={streaming}
            />
            <button
              className="ai-chat-send"
              onClick={handleSend}
              disabled={streaming || !input.trim()}
            >
              {streaming ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
