import { C } from "../../tokens";
import { KPICard, BloodBadge, DataTable, Card, SectionTitle } from "../shared/UI";

const badges = [
  ["A+",  412, 82, "safe"],   ["A−",  48,  32, "low"],
  ["B+",  234, 62, "safe"],   ["B−",  61,  41, "low"],
  ["O+",  389, 78, "safe"],   ["O−",  12,   8, "low"],
  ["AB+", 175, 58, "safe"],   ["AB−", 88,  44, "moderate"],
];

const rows = [
  ["A+",  "412", "09:30 AM", "18",  "100", "Safe"],
  ["A−",  "48",  "08:15 AM", "6",   "60",  "Critical"],
  ["B+",  "234", "10:00 AM", "22",  "80",  "Safe"],
  ["B−",  "61",  "Yesterday","4",   "75",  "Low"],
  ["O+",  "389", "09:45 AM", "31",  "120", "Safe"],
  ["O−",  "12",  "07:50 AM", "9",   "50",  "Critical"],
  ["AB+", "175", "10:10 AM", "8",   "70",  "Safe"],
  ["AB−", "88",  "09:00 AM", "5",   "60",  "Low"],
];

export default function Inventory() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <KPICard label="Total on hand"      value="1,709" change="↑ 4% since yesterday" changeUp accent={C.red700} spark={0} />
        <KPICard label="Safe groups"        value="5 / 8" change="A+, B+, O+, AB+, A−"  changeUp accent={C.green}  spark={1} />
        <KPICard label="Below threshold"    value="3"     change="O−, B−, AB− need restocking" accent={C.red700} spark={2} />
        <KPICard label="Requests today"     value="87 u"  change="Across 6 hospitals"    changeUp accent={C.blue}   spark={3} />
      </div>

      <Card style={{ padding: "18px 20px" }}>
        <SectionTitle>Current stock by blood group</SectionTitle>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {badges.map(([g, u, pct, s]) => <BloodBadge key={g} group={g} units={u} pct={pct} status={s} />)}
        </div>
      </Card>

      <Card style={{ padding: "18px 20px" }}>
        <SectionTitle sub="live · updates every 5 min">Detailed inventory log</SectionTitle>
        <DataTable
          headers={["Group", "Units", "Last updated", "Requested today", "Minimum", "Status"]}
          rows={rows}
        />
      </Card>
    </div>
  );
}
