// src/components/screens/Forecast.jsx
//
// The per-group "Predicted (next wk)" column comes from a REAL trained
// model: ml-service (Python, scikit-learn LinearRegression) fits a line
// through each blood group's weekly donation counts and predicts the
// next week. See backend's sibling ml-service/model.py.
//
// With little donation history (a fresh install), most groups will show
// "no data" and predict 0 - there's nothing to learn from yet. This gets
// more accurate as real donations get logged over time, because it's
// training on real rows, not a canned formula.
//
// Everything else on this screen (weekly trend chart, stock-vs-donations
// table) is still plain arithmetic over real donation-service/
// inventory-service data, same as before.
import { useEffect, useState } from "react";
import { C } from "../../tokens";
import { KPICard, LineChart, DataTable, Card, SectionTitle } from "../shared/UI";
import { listAllDonations, listInventory, getMlForecast, getToken } from "../../api";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// Buckets donations into the last N calendar weeks (oldest first).
function weeklyTotals(donations, weeks = 6) {
  const now = Date.now();
  const buckets = Array.from({ length: weeks }, (_, i) => ({
    label: `Wk ${weeks - i}`,
    start: now - (i + 1) * WEEK_MS,
    end: now - i * WEEK_MS,
    count: 0,
  })).reverse();

  donations.forEach(d => {
    const t = new Date(d.donationDate).getTime();
    const bucket = buckets.find(b => t >= b.start && t < b.end);
    if (bucket) bucket.count += 1;
  });
  return buckets;
}

function deriveStatus(units, threshold) {
  const ratio = threshold > 0 ? units / threshold : 1;
  if (ratio < 0.3) return "Critical";
  if (ratio < 1) return "Low";
  return "Sufficient";
}

export default function Forecast() {
  const token = getToken();
  const [donations, setDonations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [mlError, setMlError] = useState(""); // ml-service being down shouldn't break the rest of the page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("You're not signed in. Please log in again.");
      setLoading(false);
      return;
    }
    Promise.all([listAllDonations(token), listInventory(token)])
      .then(([donationData, inventoryData]) => {
        setDonations(donationData);
        setInventory(inventoryData);
      })
      .catch(err => setError(err.message || "Could not load forecast data"))
      .finally(() => setLoading(false));

    // Separate call, separate failure handling - if ml-service isn't
    // running, the rest of this screen should still work.
    getMlForecast(token)
      .then(setPredictions)
      .catch(err => setMlError(err.message || "Could not reach ml-service"));
  }, [token]);

  if (loading) return <div style={{ fontSize: 12, color: C.gray, padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ fontSize: 12, color: C.red700, padding: 24 }}>{error}</div>;

  const weeks = weeklyTotals(donations, 6);
  const thisWeek = weeks[weeks.length - 1].count;
  const lastWeek = weeks[weeks.length - 2].count;
  const weekChangePct = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null;

  const belowThresholdGroups = inventory.filter(r => deriveStatus(r.units, r.minimumThreshold) !== "Sufficient");

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentDonations = donations.filter(d => new Date(d.donationDate).getTime() >= thirtyDaysAgo);
  const donationCountByGroup = {};
  recentDonations.forEach(d => { donationCountByGroup[d.bloodGroup] = (donationCountByGroup[d.bloodGroup] || 0) + 1; });
  const mostDonatedGroup = Object.entries(donationCountByGroup).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  // Total predicted donations across all groups next week, straight from
  // the model - 0 if ml-service hasn't answered (down, or no data yet).
  const totalPredictedNextWeek = Object.values(predictions).reduce((sum, p) => sum + (p.predictedUnits || 0), 0);
  const groupsWithRealPredictions = Object.values(predictions).filter(p => p.method === "linear_regression").length;

  const rows = inventory.map(r => {
    const prediction = predictions[r.bloodGroup];
    return [
      r.bloodGroup,
      String(r.units),
      String(r.minimumThreshold),
      String(donationCountByGroup[r.bloodGroup] || 0),
      prediction ? String(prediction.predictedUnits) : "—",
      deriveStatus(r.units, r.minimumThreshold),
    ];
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <KPICard label="Donations this week"     value={String(thisWeek)} change={weekChangePct === null ? "No data for last week" : `${weekChangePct >= 0 ? "↑" : "↓"} ${Math.abs(weekChangePct)}% vs last week`} changeUp={weekChangePct === null || weekChangePct >= 0} accent={C.red700} spark={0} />
        <KPICard label="ML predicted (next wk)"  value={String(totalPredictedNextWeek)} change={`Trained on ${groupsWithRealPredictions}/8 groups with enough history`} changeUp accent={C.blue} spark={1} />
        <KPICard label="Groups below threshold"  value={String(belowThresholdGroups.length)} change={belowThresholdGroups.map(r => r.bloodGroup).join(", ") || "None"} accent={C.red700} spark={2} />
        <KPICard label="Most donated (30 days)"  value={mostDonatedGroup} change={`${donationCountByGroup[mostDonatedGroup] || 0} donations`} changeUp accent={C.amber} spark={3} />
      </div>

      {mlError ? (
        <div style={{ background: "#FFF4E5", border: `1px solid ${C.amber}44`, borderLeft: `3px solid ${C.amber}`, borderRadius: "0 10px 10px 0", padding: "10px 16px", display: "flex", gap: 10, alignItems: "center" }}>
          <span aria-hidden="true" style={{ fontSize: 13 }}>⚠️</span>
          <div style={{ fontSize: 12, color: "#92600A" }}>
            ML predictions unavailable ({mlError}). Is ml-service running (<code>python app.py</code> in <code>ml-service/</code>)? The rest of this page still works.
          </div>
        </div>
      ) : (
        <div style={{ background: "#EEF4FF", border: `1px solid ${C.blue}44`, borderLeft: `3px solid ${C.blue}`, borderRadius: "0 10px 10px 0", padding: "10px 16px", display: "flex", gap: 10, alignItems: "center" }}>
          <span aria-hidden="true" style={{ fontSize: 13 }}>ℹ️</span>
          <div style={{ fontSize: 12, color: "#1E3A6E" }}>
            "Predicted (next wk)" is a real scikit-learn model trained on your donation history - not a formula.
            Groups with little history so far will predict low until more donations get logged.
          </div>
        </div>
      )}

      <Card style={{ padding: "18px 20px" }}>
        <SectionTitle sub="last 6 weeks · from donation-service">Weekly donation trend</SectionTitle>
        <LineChart values={weeks.map(w => w.count || 0)} labels={weeks.map(w => w.label)} color={C.red700} height={170} />
      </Card>

      <Card style={{ padding: "18px 20px" }}>
        <SectionTitle>Stock, donations, and ML prediction by group</SectionTitle>
        {rows.length === 0 ? (
          <div style={{ fontSize: 12, color: C.gray, padding: "16px 0", textAlign: "center" }}>No inventory data yet.</div>
        ) : (
          <DataTable headers={["Group", "Units on hand", "Minimum", "Donated (30d)", "Predicted (next wk)", "Status"]} rows={rows} />
        )}
      </Card>
    </div>
  );
}
