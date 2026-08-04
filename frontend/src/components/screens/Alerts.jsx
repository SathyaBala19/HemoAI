// src/components/screens/Alerts.jsx
//
// Alerts are computed live from inventory-service's real stock numbers
// (same data as Inventory.jsx) - a blood group below its minimum
// threshold becomes a "Critical" or "Warning" alert here. There's no
// separate alerts database; this list changes automatically whenever
// stock levels change.
import { useEffect, useState } from "react";
import { C } from "../../tokens";
import { AlertRow, Card } from "../shared/UI";
import { listInventory, getToken } from "../../api";

// Turns one inventory row into an alert, or null if that blood group is
// currently at a safe level (safe groups don't generate an alert at all).
function toAlert(row) {
  const ratio = row.minimumThreshold > 0 ? row.units / row.minimumThreshold : 1;
  if (ratio >= 1) return null;

  const type = ratio < 0.3 ? "critical" : "low";
  const shortBy = row.minimumThreshold - row.units;
  return {
    type,
    title: type === "critical"
      ? `${row.bloodGroup} critically low - only ${row.units} units left`
      : `${row.bloodGroup} below minimum threshold`,
    desc: `Current stock is ${row.units} units, minimum is ${row.minimumThreshold} (short by ${shortBy} units).`,
    time: row.lastUpdated ? new Date(row.lastUpdated).toLocaleString() : "",
  };
}

export default function Alerts() {
  const token = getToken();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!token) {
      setError("You're not signed in. Please log in again.");
      setLoading(false);
      return;
    }
    listInventory(token)
      .then(rows => setAlerts(rows.map(toAlert).filter(Boolean)))
      .catch(err => setError(err.message || "Could not load alerts"))
      .finally(() => setLoading(false));
  }, [token]);

  const criticalCount = alerts.filter(a => a.type === "critical").length;
  const warningCount = alerts.filter(a => a.type === "low").length;

  const tabs = [
    { label: "All",                        filter: null },
    { label: `Critical (${criticalCount})`, filter: "critical" },
    { label: `Warnings (${warningCount})`,  filter: "low" },
  ];

  const shown = tabs[tab].filter ? alerts.filter(a => a.type === tabs[tab].filter) : alerts;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Alert feed</span>
          <span style={{ fontSize: 11, color: C.gray, marginLeft: 8 }}>computed live from current stock</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: "5px 14px", borderRadius: 7, cursor: "pointer",
              border: `1px solid ${tab === i ? C.navy : C.border}`,
              background: tab === i ? C.navy : C.white,
              color: tab === i ? C.white : C.slate,
              fontSize: 11, fontWeight: 500,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <Card style={{ padding: "16px 18px" }}>
        {error && (
          <div style={{ fontSize: 11.5, color: C.red700, background: C.red50, borderRadius: 7, padding: "8px 12px", marginBottom: 10 }}>
            {error}
          </div>
        )}
        {loading ? (
          <div style={{ fontSize: 12, color: C.gray, padding: "16px 0", textAlign: "center" }}>Loading…</div>
        ) : shown.length === 0 ? (
          <div style={{ fontSize: 12, color: C.gray, padding: "16px 0", textAlign: "center" }}>
            No alerts - every blood group is currently at or above its minimum threshold.
          </div>
        ) : (
          shown.map((a, i) => <AlertRow key={i} type={a.type} title={a.title} desc={a.desc} time={a.time} />)
        )}
      </Card>
    </div>
  );
}
