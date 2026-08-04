// src/components/screens/Reports.jsx
//
// Every number here is computed from REAL data pulled from donation-service
// (GET /api/donations - staff only) and inventory-service (GET /api/inventory).
// There's no separate "reports" backend - this screen is just aggregation
// done in the browser over data that already exists elsewhere.
//
// A few numbers the original mock version showed (donor response rate,
// average response time, % of requests met) have been dropped rather than
// faked - there's no blood-request tracking anywhere in this backend, so
// there's nothing real to compute them from.
import { useEffect, useState } from "react";
import { C } from "../../tokens";
import { KPICard, BarChart, LineChart, DataTable, Card, SectionTitle } from "../shared/UI";
import Pagination from "../shared/Pagination";
import { listAllDonations, listInventory, getToken } from "../../api";

const PAGE_SIZE = 5;
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Groups donations into the last 6 calendar months, oldest first.
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

// Groups raw donation rows into one row per donor, for the "top donors" table.
function aggregateByDonor(donations) {
  const byEmail = new Map();
  for (const d of donations) {
    const existing = byEmail.get(d.donorEmail);
    if (!existing || d.donationDate > existing.lastDonated) {
      byEmail.set(d.donorEmail, {
        name: d.donorName,
        bloodGroup: existing ? existing.bloodGroup : d.bloodGroup,
        count: (existing?.count || 0) + 1,
        lastDonated: existing && existing.lastDonated > d.donationDate ? existing.lastDonated : d.donationDate,
      });
    } else {
      existing.count += 1;
    }
  }
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return [...byEmail.values()]
    .sort((a, b) => b.count - a.count)
    .map(donor => [
      donor.name,
      donor.bloodGroup,
      String(donor.count),
      donor.lastDonated,
      new Date(donor.lastDonated) >= sixMonthsAgo ? "Active" : "Inactive",
    ]);
}

export default function Reports() {
  const token = getToken();
  const [donations, setDonations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

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
      .catch(err => setError(err.message || "Could not load report data"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div style={{ fontSize: 12, color: C.gray, padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ fontSize: 12, color: C.red700, padding: 24 }}>{error}</div>;

  const donorRows = aggregateByDonor(donations);
  const pageRows = donorRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const buckets = monthlyBuckets(donations);
  const uniqueDonors = donorRows.length;
  const bloodGroupsCovered = new Set(donations.map(d => d.bloodGroup)).size;
  const totalUnitsOnHand = inventory.reduce((sum, r) => sum + r.units, 0);
  const avgDonationsPerDonor = uniqueDonors > 0 ? (donations.length / uniqueDonors).toFixed(1) : "0";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <KPICard label="Donations logged"      value={String(donations.length)} change={`${uniqueDonors} unique donors`} changeUp accent={C.red700} spark={0} />
        <KPICard label="Blood groups covered"  value={`${bloodGroupsCovered} / 8`} change="Distinct groups donated"    changeUp accent={C.green}  spark={1} />
        <KPICard label="Avg donations/donor"   value={avgDonationsPerDonor}       change="Across all recorded donors" changeUp accent={C.blue}   spark={2} />
        <KPICard label="Units currently on hand" value={String(totalUnitsOnHand)} change="Live from inventory-service" changeUp accent={C.amber}  spark={3} />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Card style={{ flex: 3, padding: "18px 20px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
            <div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>Monthly donations</span>
              <span style={{ fontSize: 11, color: C.gray, marginLeft: 7 }}>last 6 months, live</span>
            </div>
          </div>
          <BarChart values={buckets.map(b => b.count || 0.01)} labels={buckets.map(b => b.label)} color={C.red700} />
        </Card>

        <Card style={{ flex: 2, padding: "18px 20px 14px" }}>
          <SectionTitle sub="donations per month">Donation trend</SectionTitle>
          <LineChart values={buckets.map(b => b.count || 0)} labels={buckets.map(b => b.label)} color={C.green} height={150} />
        </Card>
      </div>

      <Card style={{ padding: "18px 20px" }}>
        <SectionTitle>Donors, by total donations</SectionTitle>
        {donorRows.length === 0 ? (
          <div style={{ fontSize: 12, color: C.gray, padding: "16px 0", textAlign: "center" }}>No donations recorded yet.</div>
        ) : (
          <>
            <DataTable headers={["Name", "Group", "Donations", "Last donated", "Status"]} rows={pageRows} />
            <Pagination page={page} totalItems={donorRows.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
