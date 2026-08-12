// src/components/screens/BloodBank.jsx
//
// Every number here comes from real backend data - inventory-service
// (GET/PUT /api/inventory) and auth-service's donor directory
// (GET /api/users/donors), the same sources Inventory.jsx and
// DonorMap.jsx already use.
//
// The original mock version showed "incoming requests" and a "dispatched
// today" log - those have been dropped rather than faked, because there's
// no request/dispatch-tracking concept anywhere in this backend (same
// reasoning Reports.jsx used for the metrics it dropped). "Donors nearby"
// is likewise just the real donor count, not distance-sorted, since
// there's no real geocoding either (see DonorMap.jsx's own disclaimer).
import { useEffect, useState } from "react";
import { C } from "../../tokens";
import { KPICard, Card, SectionTitle } from "../shared/UI";
import { listInventory, listDonors, updateInventory, getToken } from "../../api";

export default function BloodBank() {
  const token = getToken();
  const [inventory, setInventory] = useState([]);
  const [donorCount, setDonorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(null);

  function load() {
    if (!token) {
      setError("You're not signed in. Please log in again.");
      setLoading(false);
      return;
    }
    Promise.all([listInventory(token), listDonors(token)])
      .then(([inventoryData, donorData]) => {
        setInventory(inventoryData);
        setDonorCount(donorData.length);
      })
      .catch(err => setError(err.message || "Could not load blood bank data"))
      .finally(() => setLoading(false));
  }

  useEffect(load, [token]);

  async function adjust(row, delta) {
    const nextUnits = Math.max(0, row.units + delta);
    setInventory(rows => rows.map(r => r.id === row.id ? { ...r, units: nextUnits } : r));
    setSaving(row.id);
    try {
      await updateInventory(token, row.id, { ...row, units: nextUnits });
    } catch (err) {
      setError(err.message || "Could not update stock");
      load();
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <div style={{ fontSize: 12, color: C.gray, padding: 24 }}>Loading…</div>;

  const totalUnits = inventory.reduce((sum, r) => sum + r.units, 0);
  const belowThreshold = inventory.filter(r => r.units < r.minimumThreshold);
  const healthPct = inventory.length > 0 ? Math.round(((inventory.length - belowThreshold.length) / inventory.length) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {error && (
        <div style={{ fontSize: 11.5, color: C.red700, background: C.red50, borderRadius: 7, padding: "8px 12px" }}>{error}</div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <KPICard label="Units on hand"    value={String(totalUnits)} change={`Across ${inventory.length} blood groups`} changeUp accent={C.red700} spark={0} />
        <KPICard label="Groups short"     value={String(belowThreshold.length)} change={belowThreshold.length > 0 ? belowThreshold.map(r => r.bloodGroup).join(", ") : "All groups healthy"} accent={C.amber} spark={1} />
        <KPICard label="Registered donors" value={String(donorCount)} change="Live from auth-service" changeUp accent={C.blue}   spark={2} />
        <KPICard label="Stock health"      value={`${healthPct}%`} change={`${belowThreshold.length} group(s) need attention`} accent={C.amber}  spark={3} />
      </div>

      <Card style={{ padding: "18px 20px" }}>
        <SectionTitle sub="live · tap +/− to adjust, saved instantly">Update stock levels</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 7 }}>
          {inventory.map(row => {
            const col = row.units < row.minimumThreshold ? C.red700 : C.green;
            return (
              <div key={row.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.fog, borderRadius: 8, padding: "7px 10px" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: col, letterSpacing: "-0.3px" }}>{row.bloodGroup}</div>
                  <div style={{ fontSize: 10, color: C.slate }}>{row.units} u {saving === row.id ? "· saving…" : ""}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => adjust(row, -1)} style={{ width: 20, height: 20, borderRadius: 4, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 12, color: C.slate, lineHeight: 1 }}>−</button>
                  <button onClick={() => adjust(row, 1)} style={{ width: 20, height: 20, borderRadius: 4, border: "none", background: C.red700, cursor: "pointer", fontSize: 12, color: C.white, lineHeight: 1 }}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
