// src/components/screens/Inventory.jsx
//
// Shows REAL blood stock data from inventory-service (port 8083, see
// src/api.js). The 8 blood groups are seeded automatically when
// inventory-service starts (see InventoryDataSeeder.java), so this table
// is never empty on a fresh database.
//
// HOSPITAL_ADMIN and BLOOD_BANK_OFFICER can edit units inline (the
// backend enforces this too - a DONOR or DHO token would get a 403 if it
// tried to PUT here).
import { useEffect, useState } from "react";
import { C } from "../../tokens";
import { KPICard, BloodBadge, DataTable, Card, SectionTitle } from "../shared/UI";
import { listInventory, getInventoryById, updateInventory, deleteInventory, getToken, getStoredUser } from "../../api";

// Turns a row's units/threshold ratio into the two different status
// vocabularies the shared UI components expect (an old mismatch in this
// codebase's UI kit, not something worth redesigning here):
//   - BloodBadge wants "safe" | "low" | "moderate"
//   - DataTable (via statusColor/statusBg in tokens.js) wants "Safe" | "Critical" | "Low"
function deriveStatus(units, threshold) {
  const ratio = threshold > 0 ? units / threshold : 1;
  if (ratio < 0.3) return { badge: "low", table: "Critical" };
  if (ratio < 1) return { badge: "moderate", table: "Low" };
  return { badge: "safe", table: "Safe" };
}

export default function Inventory() {
  const token = getToken();
  const currentUser = getStoredUser();
  const canEdit = currentUser?.role === "HOSPITAL_ADMIN" || currentUser?.role === "BLOOD_BANK_OFFICER";
  const canDelete = currentUser?.role === "DHO";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    if (!token) {
      setError("You're not signed in. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    listInventory(token)
      .then(data => setRows(data))
      .catch(err => setError(err.message || "Could not load inventory"))
      .finally(() => setLoading(false));
  }

  useEffect(load, [token]);

  // Fetches this one row fresh from the server (GET /api/inventory/:id)
  // instead of just reusing whatever's already in the loaded list, so
  // editing always starts from the latest saved value.
  async function startEdit(row) {
    try {
      const fresh = await getInventoryById(token, row.id);
      setEditingId(fresh.id);
      setEditValue(String(fresh.units));
    } catch (err) {
      setError(err.message || "Could not load that row");
    }
  }

  async function saveEdit(row) {
    const units = Number(editValue);
    if (Number.isNaN(units) || units < 0) {
      setError("Units must be a number of 0 or more");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateInventory(token, row.id, { ...row, units });
      setRows(list => list.map(r => (r.id === row.id ? updated : r)));
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Could not update stock");
    } finally {
      setSaving(false);
    }
  }

  // DHO-only, matches InventoryController's DELETE role check on the backend.
  async function removeRow(id) {
    try {
      await deleteInventory(token, id);
      setRows(list => list.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message || "Could not delete that row");
    }
  }

  const totalUnits = rows.reduce((sum, r) => sum + r.units, 0);
  const safeCount = rows.filter(r => deriveStatus(r.units, r.minimumThreshold).table === "Safe").length;
  const belowThresholdRows = rows.filter(r => deriveStatus(r.units, r.minimumThreshold).table !== "Safe");
  const mostRecentUpdate = rows.reduce(
    (latest, r) => (!latest || r.lastUpdated > latest ? r.lastUpdated : latest),
    null
  );

  const tableRows = rows.map(r => {
    const status = deriveStatus(r.units, r.minimumThreshold);
    return [
      r.bloodGroup,
      String(r.units),
      r.lastUpdated ? new Date(r.lastUpdated).toLocaleString() : "—",
      String(r.minimumThreshold),
      status.table,
      r.id,
    ];
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {error && (
        <div style={{ fontSize: 11.5, color: C.red700, background: C.red50, borderRadius: 7, padding: "8px 12px" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ fontSize: 12, color: C.gray, padding: "16px 0", textAlign: "center" }}>Loading inventory…</div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 12 }}>
            <KPICard label="Total on hand"   value={totalUnits.toLocaleString()} change={`Across ${rows.length} blood groups`} changeUp accent={C.red700} spark={0} />
            <KPICard label="Safe groups"     value={`${safeCount} / ${rows.length}`} change="At or above minimum threshold" changeUp accent={C.green} spark={1} />
            <KPICard label="Below threshold" value={String(belowThresholdRows.length)} change={belowThresholdRows.map(r => r.bloodGroup).join(", ") || "None"} accent={C.red700} spark={2} />
            <KPICard label="Last updated"    value={mostRecentUpdate ? new Date(mostRecentUpdate).toLocaleTimeString() : "—"} change="Most recent stock change" changeUp accent={C.blue} spark={3} />
          </div>

          <Card style={{ padding: "18px 20px" }}>
            <SectionTitle>Current stock by blood group</SectionTitle>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {rows.map(r => {
                const status = deriveStatus(r.units, r.minimumThreshold);
                const pct = r.minimumThreshold > 0 ? Math.min(100, Math.round((r.units / r.minimumThreshold) * 100)) : 100;
                return <BloodBadge key={r.id} group={r.bloodGroup} units={r.units} pct={pct} status={status.badge} />;
              })}
            </div>
          </Card>

          <Card style={{ padding: "18px 20px" }}>
            <SectionTitle sub="live · from inventory-service">Detailed inventory log</SectionTitle>
            {(canEdit || canDelete) ? (
              // Editable version of the table, since DataTable itself
              // doesn't support inline editing - built directly here.
              // canEdit (HOSPITAL_ADMIN/BLOOD_BANK_OFFICER) gets the Edit
              // button, canDelete (DHO only) gets the Delete button -
              // matches InventoryController's PUT vs DELETE role split.
              <div style={{ overflowX: "auto", marginTop: 2 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["Group", "Units", "Last updated", "Minimum", "Status", ""].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 13px", fontSize: 10.5, fontWeight: 600, color: C.gray, background: C.warmgray, borderBottom: `1px solid ${C.border}`, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => {
                      const status = deriveStatus(r.units, r.minimumThreshold);
                      const isEditing = editingId === r.id;
                      return (
                        <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}80` }}>
                          <td style={{ padding: "9px 13px", color: C.navy, fontWeight: 500 }}>{r.bloodGroup}</td>
                          <td style={{ padding: "9px 13px" }}>
                            {isEditing ? (
                              <input
                                type="number" min="0" value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                style={{ width: 70, height: 28, borderRadius: 5, border: `1px solid ${C.border}`, padding: "0 8px", fontSize: 12 }}
                              />
                            ) : r.units}
                          </td>
                          <td style={{ padding: "9px 13px", color: C.slate }}>{r.lastUpdated ? new Date(r.lastUpdated).toLocaleString() : "—"}</td>
                          <td style={{ padding: "9px 13px", color: C.slate }}>{r.minimumThreshold}</td>
                          <td style={{ padding: "9px 13px" }}>
                            <span style={{ fontSize: 10.5, fontWeight: 600, color: status.table === "Safe" ? C.green : status.table === "Critical" ? C.red700 : C.amber, background: status.table === "Safe" ? C.green50 : status.table === "Critical" ? C.red50 : C.amber50, borderRadius: 5, padding: "2px 9px" }}>{status.table}</span>
                          </td>
                          <td style={{ padding: "9px 13px", display: "flex", gap: 8 }}>
                            {canEdit && (isEditing ? (
                              <button onClick={() => saveEdit(r)} disabled={saving} style={{ fontSize: 10.5, fontWeight: 600, color: C.white, background: C.red700, border: "none", borderRadius: 5, padding: "5px 10px", cursor: saving ? "default" : "pointer" }}>
                                {saving ? "Saving…" : "Save"}
                              </button>
                            ) : (
                              <button onClick={() => startEdit(r)} style={{ fontSize: 10.5, fontWeight: 600, color: C.blue, background: "transparent", border: "none", cursor: "pointer" }}>
                                Edit
                              </button>
                            ))}
                            {canDelete && (
                              <button onClick={() => removeRow(r.id)} style={{ fontSize: 10.5, fontWeight: 600, color: C.red700, background: "transparent", border: "none", cursor: "pointer" }}>
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <DataTable
                headers={["Group", "Units", "Last updated", "Minimum", "Status"]}
                rows={tableRows.map(r => r.slice(0, 5))}
              />
            )}
          </Card>
        </>
      )}
    </div>
  );
}
