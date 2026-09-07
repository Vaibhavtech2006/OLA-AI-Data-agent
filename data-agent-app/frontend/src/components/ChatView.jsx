import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.jsx";
import Composer from "./Composer.jsx";
import { api } from "../api.js";

const SUGGESTIONS = [
  "Show me the top 5 users with the highest ratings",
  "Average rating per vehicle type",
  "Extract data from https://pokeapi.co/api/v2/pokemon and save as CSV",
  "Transform rides.csv, keep rating > 4.0, save as JSON",
];

export default function ChatView({ onExchangeComplete }) {
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (text) => {
    const userMsg = { role: "user", text, timestamp: new Date().toISOString() };
    const pendingMsg = { role: "agent", pending: true };
    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setSending(true);

    try {
      const res = await api.sendMessage(text);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "agent",
          text: res.answer,
          route: res.route,
          latencyMs: res.latency_ms,
          generatedSql: res.generated_sql,
          generatedCode: res.generated_code,
          isSafe: res.is_safe,
          timestamp: res.timestamp,
        };
        return next;
      });
      onExchangeComplete?.();
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "agent",
          text: `Request failed: ${err.message}`,
          route: "unknown",
          timestamp: new Date().toISOString(),
        };
        return next;
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-view">
      <div className="chat-scroll" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="empty-chat">
            <h2>Ask the data agent anything</h2>
            <p>
              Queries route automatically — analytical questions go to the SQL
              Analyst, extract/transform requests go to the ETL Analyst.
            </p>
            <div className="suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="suggestion-chip" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => <MessageBubble key={i} message={m} />)
        )}
      </div>
      <Composer onSend={send} disabled={sending} />
    </div>
  );
}
