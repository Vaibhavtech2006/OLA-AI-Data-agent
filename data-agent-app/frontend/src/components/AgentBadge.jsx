const LABELS = {
  sql: "SQL Analyst",
  etl: "ETL Analyst",
  router: "Router",
  unknown: "Agent",
};

export default function AgentBadge({ route }) {
  const cls = route === "sql" ? "sql" : route === "etl" ? "etl" : "router";
  return (
    <span className={`agent-badge ${cls}`}>
      <span className="dot" />
      {LABELS[route] || LABELS.unknown}
    </span>
  );
}
