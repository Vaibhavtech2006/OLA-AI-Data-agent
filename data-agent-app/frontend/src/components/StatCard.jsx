export default function StatCard({ label, value, unit, accent }) {
  return (
    <div className={`stat-card ${accent ? `accent-${accent}` : ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
    </div>
  );
}
