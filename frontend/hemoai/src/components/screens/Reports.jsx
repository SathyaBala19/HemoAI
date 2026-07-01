import { C } from "../../tokens";
import { KPICard, BarChart, LineChart, DataTable, Card, SectionTitle } from "../shared/UI";

const donorRows = [
  ["Arjun Kumar",   "O−",  "12", "14 Jun 2026", "Active"],
  ["Priya Sharma",  "A+",  "8",  "10 Jun 2026", "Active"],
  ["Karthik Rajan", "B+",  "5",  "28 May 2026", "Inactive"],
  ["Meena Devi",    "O+",  "15", "17 Jun 2026", "Active"],
  ["Suresh Babu",   "AB−", "3",  "22 Apr 2026", "Inactive"],
];

export default function Reports() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <KPICard label="Units collected"    value="8,240"  change="↑ 6% on last month"   changeUp accent={C.red700} spark={0} />
        <KPICard label="Donor response"     value="73.4%"  change="↑ 4.2 pts improvement" changeUp accent={C.green}  spark={1} />
        <KPICard label="Avg response time"  value="22 min" change="↓ 8 min faster"        changeUp accent={C.blue}   spark={2} />
        <KPICard label="Requests met"       value="96.8%"  change="of all blood requests"  changeUp accent={C.amber}  spark={3} />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Card style={{ flex: 3, padding: "18px 20px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
            <div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>Monthly collections</span>
              <span style={{ fontSize: 11, color: C.gray, marginLeft: 7 }}>Jan–Jun 2026</span>
            </div>
            <button
              style={{ padding: "5px 13px", background: C.navy, color: C.white, border: "none", borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = C.slate}
              onMouseLeave={e => e.currentTarget.style.background = C.navy}
            >Export PDF</button>
          </div>
          <BarChart values={[6200, 7100, 6800, 7400, 7900, 8240]} labels={["Jan","Feb","Mar","Apr","May","Jun"]} color={C.red700} />
        </Card>

        <Card style={{ flex: 2, padding: "18px 20px 14px" }}>
          <SectionTitle sub="response rate %">Donor response trend</SectionTitle>
          <LineChart values={[58, 61, 64, 68, 71, 73]} labels={["Jan","Feb","Mar","Apr","May","Jun"]} color={C.green} height={150} />
        </Card>
      </div>

      <Card style={{ padding: "18px 20px" }}>
        <SectionTitle>Top donors this period</SectionTitle>
        <DataTable headers={["Name", "Group", "Donations", "Last donated", "Status"]} rows={donorRows} />
      </Card>
    </div>
  );
}
