import React, { useState } from "react";
import { MessageSquare, X, Send, Bot, Loader2 } from "lucide-react";
import { store } from "../state.js";

const IMAGE_REQUEST_PATTERN = /\b(create|generate|make|draw|render)\b.*\b(image|picture|photo|art|illustration)\b|\b(image|picture|photo|art|illustration)\b.*\b(create|generate|make|draw|render)\b/i;

const buildImageDescriptionReply = (question) => {
  const subjectMatch = question.match(/(?:of|about|showing)\s+([^?.!,]+)/i);
  const subject = subjectMatch?.[1]?.trim() || "the requested subject";

  return `I'm an AI language model and I don't have the ability to create images. However, I can describe an image of ${subject} based on common characteristics: ${subject} can be described with recognizable visual features, overall shape, typical colors, and notable details that help a reader imagine it clearly.`;
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  const sendMessage = async () => {
    if (!question.trim()) return;

    if (IMAGE_REQUEST_PATTERN.test(question)) {
      setAnswer(buildImageDescriptionReply(question));
      setQuestion("");
      return;
    }

    const apiKey = import.meta.env.VITE_OPENROUTER_KEY;
    if (!apiKey) {
      setAnswer("Missing OpenRouter API key. Add VITE_OPENROUTER_KEY to your .env file.");
      return;
    }

    setLoading(true);
    // Build context from global store
    const context = `Weather: ${store.weather?.temperature ?? "N/A"}°C, Wind: ${store.weather?.windspeed ?? "N/A"} m/s.\n` +
      `Rates (INR): USD=${store.rates?.rates?.USD?.toFixed(2) ?? "N/A"}, EUR=${store.rates?.rates?.EUR?.toFixed(2) ?? "N/A"}, GBP=${store.rates?.rates?.GBP?.toFixed(2) ?? "N/A"}.\n` +
      `Citizen: ${store.citizen?.name?.first ?? "N/A"} ${store.citizen?.name?.last ?? ""}, ${store.citizen?.location?.city ?? ""}.\n` +
      `Fact: ${store.fact?.text ?? "N/A"}`;
    const payload = {
      model: "openrouter/auto",
      messages: [
        { role: "system", content: "Answer only using the provided data. Do not fabricate information." },
        { role: "user", content: `${context}\n\nQuestion: ${question}` },
      ],
    };
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "SmartCity Dashboard",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenRouter error ${res.status}: ${errText || "Unknown error"}`);
      }

      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content ?? "(no response)";
      setAnswer(reply);
      setQuestion(""); // clear input
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : "Unknown error";
      setAnswer(`AI request failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggle}
        className="glass-panel"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backgroundColor: open ? "var(--bg-card-hover)" : "var(--accent)",
          color: "white",
          border: open ? "1px solid var(--border-hover)" : "none",
          zIndex: 50,
          boxShadow: open ? "" : "0 4px 14px 0 rgba(98, 0, 234, 0.39)",
          transition: "all 0.3s ease"
        }}
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {open && (
        <div 
          className="glass-panel animate-slide-up"
          style={{
            position: "fixed",
            bottom: "6.5rem",
            right: "2rem",
            width: "350px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            zIndex: 40,
            overflow: "hidden"
          }}
        >
          {/* AI Header */}
          <div style={{
            padding: "1rem", 
            borderBottom: "1px solid var(--border-color)", 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem",
            background: "rgba(0,0,0,0.2)"
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent)", 
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Bot size={18} color="white" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>City AI Assistant</h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Ask about current dashboard data</p>
            </div>
          </div>

          {/* AI Body */}
          <div style={{ flex: 1, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Greeting */}
            {(!answer && !loading) && (
              <div style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.05)", padding: "0.75rem 1rem", borderRadius: "1rem", borderBottomLeftRadius: "4px", fontSize: "0.95rem" }}>
                Hi! What would you like to know about the current city data?
              </div>
            )}
            
            {loading && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
                <Loader2 size={24} color="var(--accent-secondary)" className="spin" />
              </div>
            )}

            {(!loading && answer) && (
              <div style={{ alignSelf: "flex-start", background: "rgba(98, 0, 234, 0.2)", padding: "0.75rem 1rem", borderRadius: "1rem", borderBottomLeftRadius: "4px", fontSize: "0.95rem", lineHeight: "1.5" }}>
                {answer}
              </div>
            )}
          </div>

          {/* AI Footer input */}
          <div style={{ 
            padding: "1rem", 
            borderTop: "1px solid var(--border-color)", 
            display: "flex", 
            gap: "0.5rem" 
          }}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
              style={{ 
                flex: 1, 
                padding: "0.75rem 1rem", 
                borderRadius: "2rem", 
                border: "1px solid var(--border-color)", 
                background: "rgba(0,0,0,0.3)",
                color: "var(--text-main)",
                outline: "none"
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !question.trim()}
              style={{
                width: "42px", height: "42px", borderRadius: "50%", background: question.trim() ? "var(--accent)" : "rgba(255,255,255,0.1)", color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: question.trim() ? "pointer" : "default", transition: "all 0.2s"
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
