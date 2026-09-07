import AgentBadge from "./AgentBadge.jsx";

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="msg-row user">
        <div className="msg-avatar user">You</div>
        <div className="msg-body">
          <div className="msg-bubble">{message.text}</div>
        </div>
      </div>
    );
  }

  if (message.pending) {
    return (
      <div className="msg-row agent">
        <div className="msg-avatar sql">···</div>
        <div className="msg-body">
          <div className="msg-bubble">
            <span className="typing-dots">
              <span />
              <span />
              <span />
            </span>
          </div>
        </div>
      </div>
    );
  }

  const route = message.route || "unknown";
  const avatarCls = route === "etl" ? "etl" : "sql";
  const initial = route === "etl" ? "ET" : route === "sql" ? "SQ" : "?";

  return (
    <div className="msg-row agent">
      <div className={`msg-avatar ${avatarCls}`}>{initial}</div>
      <div className="msg-body">
        <div className="msg-meta">
          <AgentBadge route={route} />
          <span>{formatTime(message.timestamp)}</span>
          {message.latencyMs != null && <span>· {message.latencyMs}ms</span>}
        </div>

        <div className="msg-bubble">{message.text}</div>

        {message.generatedSql && (
          <pre className="msg-code">{message.generatedSql}</pre>
        )}

        {message.generatedCode && (
          <pre className="msg-code">{message.generatedCode}</pre>
        )}

        {message.isSafe && (
          <div className={`safety-line ${message.isSafe === "No" ? "unsafe" : ""}`}>
            {message.isSafe === "Yes" ? "✓ passed safety validation" : "✕ blocked — unsafe query"}
          </div>
        )}
      </div>
    </div>
  );
}
