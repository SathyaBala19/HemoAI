// src/components/screens/Dashboard.jsx
//
// Every number here is computed live from real backend data - inventory
// (GET /api/inventory), donors (GET /api/users/donors) and donations
// (GET /api/donations), the same sources Inventory.jsx, DonorMap.jsx,
// Alerts.jsx and Reports.jsx already use. There's no separate "dashboard"
// backend endpoint - this screen is just aggregation done in the browser.
//
// "Blood requests" isn't shown here (unlike the original mock) because
// there's no request-tracking concept anywhere in this backend - see
// Reports.jsx for the same reasoning applied to its dropped metrics.
import { useEffect, useState } from "react";
import { C } from "../../tokens";
import { KPICard, AlertRow, BarChart, Card, SectionTitle } from "../shared/UI";
import { listInventory, listDonors, listAllDonations, getToken } from "../../api";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const GROUP_COLORS = { "O+": C.red700, "A+": C.blue, "B+": C.green, "AB+": C.amber, "O−": "#E05252", "A−": C.gray, "B−": C.amber, "AB−": C.blue };

// Same alert derivation as Alerts.jsx - a blood group below its minimum
// threshold becomes a "critical" or "low" alert, safe groups produce none.
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

// Counts donations per day for the last 7 days (oldest first, today last).
function last7DaysCounts(donations) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ key: d.toDateString(), label: DAY_LABELS[d.getDay()], count: 0 });
  }
  donations.forEach(d => {
    const key = new Date(d.donationDate).toDateString();
    const bucket = days.find(b => b.key === key);
    if (bucket) bucket.count += 1;
  });
  return days;
}

export default function Dashboard({ onNavigate }) {
  const token = getToken();
  const [inventory, setInventory] = useState([]);
  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("You're not signed in. Please log in again.");
      setLoading(false);
      return;
    }
    Promise.all([listInventory(token), listDonors(token), listAllDonations(token)])
      .then(([inventoryData, donorData, donationData]) => {
        setInventory(inventoryData);
        setDonors(donorData);
        setDonations(donationData);
      })
      .catch(err => setError(err.message || "Could not load dashboard data"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div style={{ fontSize: 12, color: C.gray, padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ fontSize: 12, color: C.red700, padding: 24 }}>{error}</div>;

  const totalUnits = inventory.reduce((sum, r) => sum + r.units, 0);
  const alerts = inventory.map(toAlert).filter(Boolean);
  const criticalCount = alerts.filter(a => a.type === "critical").length;
  const warningCount = alerts.filter(a => a.type === "low").length;
  const belowThreshold = inventory.filter(r => r.units < r.minimumThreshold);

  const weekBuckets = last7DaysCounts(donations);
  const donationsThisWeek = weekBuckets.reduce((sum, b) => sum + b.count, 0);
  const donationsToday = weekBuckets[weekBuckets.length - 1].count;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      <div style={{ display: "flex", gap: 12 }}>
        <KPICard label="Blood units on hand" value={String(totalUnits)} change={`Across ${inventory.length} blood groups`} changeUp accent={C.red700} spark={0} />
        <KPICard label="Active donors"        value={String(donors.length)} change="Live from auth-service" changeUp accent={C.blue}   spark={1} />
        <KPICard label="Open alerts"          value={String(alerts.length)} change={`${criticalCount} critical, ${warningCount} warning`} accent={C.red700} spark={2} />
        <KPICard label="Donations this week"  value={String(donationsThisWeek)} change={`${donationsToday} today`} changeUp accent={C.green} spark={3} />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Card style={{ flex: 3, padding: "18px 20px 14px" }}>
          <SectionTitle sub="last 7 days, live">Donations this week</SectionTitle>
          <BarChart values={weekBuckets.map(b => b.count || 0.01)} labels={weekBuckets.map(b => b.label)} color={C.red700} />
        </Card>

        <Card style={{ flex: 2, padding: "18px 18px 16px" }}>
          <SectionTitle>Stock breakdown</SectionTitle>
          {inventory.map(row => {
            const pct = totalUnits > 0 ? Math.round((row.units / totalUnits) * 100) : 0;
            const col = GROUP_COLORS[row.bloodGroup] || C.gray;
            return (
              <div key={row.bloodGroup} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: C.navy, width: 28, letterSpacing: "-0.3px" }}>{row.bloodGroup}</span>
                <div style={{ flex: 1, height: 6, background: C.fog, borderRadius: 3 }}>
                  <div style={{ height: 6, width: `${Math.min(100, pct * 2.2)}%`, background: col, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 10, color: C.gray, width: 26, textAlign: "right" }}>{pct}%</span>
              </div>
            );
          })}
          {belowThreshold.length > 0 && (
            <div style={{ marginTop: 12, padding: "9px 12px", background: C.red50, borderRadius: 8, borderLeft: `3px solid ${C.red700}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.red700 }}>
                {belowThreshold.map(r => r.bloodGroup).join(", ")} below threshold
              </div>
              <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>{belowThreshold.length} of {inventory.length} groups need restocking</div>
            </div>
          )}
        </Card>
      </div>

      <Card style={{ padding: "18px 20px" }}>
        <SectionTitle action="See all alerts →" onAction={() => onNavigate?.("alerts")}>Recent alerts</SectionTitle>
        {alerts.length === 0 ? (
          <div style={{ fontSize: 12, color: C.gray, padding: "16px 0", textAlign: "center" }}>
            No alerts - every blood group is currently at or above its minimum threshold.
          </div>
        ) : (
          alerts.slice(0, 3).map((a, i) => <AlertRow key={i} type={a.type} title={a.title} desc={a.desc} time={a.time} />)
        )}
      </Card>
    </div>
  );
}
