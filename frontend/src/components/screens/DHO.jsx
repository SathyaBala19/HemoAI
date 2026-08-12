// src/components/screens/DHO.jsx
//
// Every number here is computed live from real backend data - inventory
// (GET /api/inventory), donors (GET /api/users/donors) and donations
// (GET /api/donations), the same sources Inventory.jsx, DonorMap.jsx and
// Reports.jsx already use.
//
// The original mock version showed a per-taluk heatmap and a per-hospital
// stock table - those have been dropped rather than faked, because there's
// no hospital/taluk model anywhere in this backend (this system tracks
// blood groups district-wide, not per-facility). Same reasoning
// Reports.jsx used for the metrics it dropped.
import { useEffect, useState } from "react";
import { C } from "../../tokens";
import { KPICard, LineChart, Card, SectionTitle } from "../shared/UI";
import { listInventory, listDonors, listAllDonations, getToken } from "../../api";

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function monthlyBuckets(donations) {
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ year: d.getFullYear(), month: d.getMonth(), label: MONTH_LABELS[d.getMonth()], count: 0 });
  }
  donations.forEach(d => {
    const date = new Date(d.donationDate);
    const bucket = buckets.find(b => b.year === date.getFullYear() && b.month === date.getMonth());
    if (bucket) bucket.count += 1;
  });
  return buckets;
}

export default function DHO() {
  const token = getToken();
  const [inventory, setInventory] = useState([]);
  const [donorCount, setDonorCount] = useState(0);
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
        setDonorCount(donorData.length);
        setDonations(donationData);
      })
      .catch(err => setError(err.message || "Could not load district data"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div style={{ fontSize: 12, color: C.gray, padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ fontSize: 12, color: C.red700, padding: 24 }}>{error}</div>;

  const totalUnits = inventory.reduce((sum, r) => sum + r.units, 0);
  const belowThreshold = inventory.filter(r => r.units < r.minimumThreshold);
  const buckets = monthlyBuckets(donations);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <KPICard label="Blood groups tracked" value={String(inventory.length)}   change="District-wide, live"          changeUp accent={C.blue}   spark={0} />
        <KPICard label="District total"       value={String(totalUnits)}        change="Units on hand, live"          changeUp accent={C.red700} spark={1} />
        <KPICard label="Shortages right now"  value={String(belowThreshold.length)} change={belowThreshold.length > 0 ? `${belowThreshold.map(r => r.bloodGroup).join(", ")} below minimum` : "All groups healthy"} accent={C.red700} spark={2} />
        <KPICard label="Registered donors"    value={String(donorCount)}        change="Live from auth-service"       changeUp accent={C.green}  spark={3} />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Card style={{ flex: 1, padding: "18px 20px" }}>
          <SectionTitle sub="by blood group, live">Stock levels</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
            {inventory.map(row => {
              const col = row.units < row.minimumThreshold * 0.5 ? C.red700 : row.units < row.minimumThreshold ? C.amber : C.green;
              const note = row.units < row.minimumThreshold * 0.5 ? "Critical" : row.units < row.minimumThreshold ? "Needs restock" : "Well stocked";
              return (
                <div key={row.bloodGroup} style={{ padding: "11px 12px", borderRadius: 10, background: `${col}14`, border: `1.5px solid ${col}44` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: col, marginBottom: 5, lineHeight: 1.2 }}>{row.bloodGroup}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, letterSpacing: "-0.5px" }}>{row.units}</div>
                  <div style={{ fontSize: 9.5, color: col, marginTop: 3 }}>{note}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
            {[[C.green,"Sufficient"],[C.amber,"Low"],[C.red700,"Critical"]].map(([col,lbl]) => (
              <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
                <span style={{ fontSize: 10, color: C.gray }}>{lbl}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ flex: 1, padding: "18px 20px 14px" }}>
          <SectionTitle sub="last 6 months, live">Monthly donation trend</SectionTitle>
          <LineChart values={buckets.map(b => b.count || 0)} labels={buckets.map(b => b.label)} color={C.red700} height={165} />
        </Card>
      </div>
    </div>
  );
}
