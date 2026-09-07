import AgentBadge from "./AgentBadge.jsx";

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function HistoryTable({ items }) {
  if (!items || items.length === 0) {
    return <div className="empty-state">No queries yet — run one from the Chat tab.</div>;
  }

  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Agent</th>
          <th>Question</th>
          <th>Safety</th>
          <th>Latency</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{formatTime(item.timestamp)}</td>
            <td>
              <AgentBadge route={item.route} />
            </td>
            <td className="q-cell">{item.user_question}</td>
            <td>
              {item.is_safe ? (
                <span className={`safe-tag ${item.is_safe === "Yes" ? "yes" : "no"}`}>
                  {item.is_safe === "Yes" ? "safe" : "blocked"}
                </span>
              ) : (
                "—"
              )}
            </td>
            <td>{item.latency_ms}ms</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
