import { useEffect, useState } from "react";
import StatCard from "./StatCard.jsx";
import HistoryTable from "./HistoryTable.jsx";
import { api } from "../api.js";

export default function DashboardView({ refreshKey }) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.getStats(),
        api.getHistory(20),
      ]);
      setStats(statsRes);
      setHistory(historyRes);
    } catch {
      // backend unreachable — leave empty state in place
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  const maxCount = stats?.queries_by_hour?.length
    ? Math.max(...stats.queries_by_hour.map((b) => b.count))
    : 0;

  return (
    <div className="dashboard">
      <div className="stat-grid">
        <StatCard label="Total queries" value={loading ? "—" : stats?.total_queries ?? 0} />
        <StatCard
          label="SQL Analyst"
          value={loading ? "—" : stats?.sql_queries ?? 0}
          accent="sql"
        />
        <StatCard
          label="ETL Analyst"
          value={loading ? "—" : stats?.etl_queries ?? 0}
          accent="etl"
        />
        <StatCard
          label="Unsafe blocked"
          value={loading ? "—" : stats?.blocked_unsafe ?? 0}
          accent="danger"
        />
      </div>

      <div className="panel-block">
        <div className="panel-block-header">
          <h3>Queries by hour</h3>
          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
            avg latency {loading ? "—" : `${stats?.avg_latency_ms ?? 0}ms`}
          </span>
        </div>
        {stats?.queries_by_hour?.length ? (
          <div className="bar-chart">
            {stats.queries_by_hour.map((b) => (
              <div className="bar-col" key={b.hour}>
                <div
                  className="bar"
                  style={{
                    height: maxCount ? `${Math.max((b.count / maxCount) * 100, 4)}%` : "4%",
                  }}
                />
                <div className="bar-label">{b.hour}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No activity yet.</div>
        )}
      </div>

      <div className="panel-block">
        <div className="panel-block-header">
          <h3>Recent query history</h3>
        </div>
        <HistoryTable items={history} />
      </div>
    </div>
  );
}
