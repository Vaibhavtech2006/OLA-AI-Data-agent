export default function Sidebar({ view, setView, backendReachable }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div>
          <div className="brand-name">Data Agent</div>
          <div className="brand-sub">router console</div>
        </div>
      </div>

      <div className="sidebar-section-label">Workspace</div>
      <div className="nav-group">
        <button
          className={`nav-item ${view === "chat" ? "active" : ""}`}
          onClick={() => setView("chat")}
        >
          <span className="dot" />
          Chat
        </button>
        <button
          className={`nav-item ${view === "dashboard" ? "active" : ""}`}
          onClick={() => setView("dashboard")}
        >
          <span className="dot" />
          Dashboard
        </button>
      </div>

      <div className="agent-status-card">
        <div className="agent-status-row">
          <span>SQL Analyst</span>
          <span className="pill">
            <span className="pulse" /> ready
          </span>
        </div>
        <div className="agent-status-row">
          <span>ETL Analyst</span>
          <span className="pill">
            <span className="pulse" /> ready
          </span>
        </div>
        <div className="agent-status-row">
          <span>Backend API</span>
          <span className="pill">
            <span className={`pulse ${backendReachable ? "" : "warn"}`} />
            {backendReachable ? "connected" : "demo mode"}
          </span>
        </div>
      </div>
    </aside>
  );
}
