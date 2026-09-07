import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import ChatView from "./components/ChatView.jsx";
import DashboardView from "./components/DashboardView.jsx";

const TITLES = {
  chat: { title: "Chat", sub: "Talk to the SQL Analyst and ETL Analyst agents" },
  dashboard: { title: "Dashboard", sub: "Query volume, routing split, and safety checks" },
};

export default function App() {
  const [view, setView] = useState("chat");
  const [backendReachable, setBackendReachable] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => setBackendReachable(r.ok))
      .catch(() => setBackendReachable(false));
  }, []);

  const meta = TITLES[view];

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} backendReachable={backendReachable} />
      <div className="main-pane">
        <div className="topbar">
          <div>
            <h1>{meta.title}</h1>
            <div className="topbar-sub">{meta.sub}</div>
          </div>
        </div>

        {view === "chat" ? (
          <ChatView onExchangeComplete={() => setRefreshKey((k) => k + 1)} />
        ) : (
          <DashboardView refreshKey={refreshKey} />
        )}
      </div>
    </div>
  );
}
