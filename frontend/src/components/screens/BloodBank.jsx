import { useState } from "react";
import { C } from "../../tokens";
import { KPICard, DataTable, Card, SectionTitle } from "../shared/UI";

const reqRows = [
  ["City Hospital",   "O−",  "8",  "9:12 AM",  "Urgent",  "Critical"],
  ["Apollo Hospital", "A+",  "12", "9:28 AM",  "Routine", "Active"],
  ["Kovai Medical",   "B+",  "6",  "9:41 AM",  "Urgent",  "Active"],
  ["Govt Hospital",   "AB−", "4",  "9:55 AM",  "Routine", "Safe"],
  ["PSG Hospital",    "O+",  "10", "10:02 AM", "Urgent",  "Active"],
];

const donorRows = [
  ["Arjun Kumar",  "O−",  "1.2 km", "3 months ago", "Active"],
  ["Priya Sharma", "O−",  "2.8 km", "2 months ago", "Active"],
  ["Meena Devi",   "AB−", "4.1 km", "4 months ago", "Active"],
  ["Suresh Babu",  "B−",  "5.3 km", "5 months ago", "Active"],
];

const stockGroups = [
  ["A+", 412, C.green], ["A−", 48,  C.red700], ["B+", 234, C.green],  ["B−", 61,  C.amber],
  ["O+", 389, C.green], ["O−", 12,  C.red700], ["AB+",175, C.green],  ["AB−",88,  C.amber],
];

const log = [
  ["09:12", "O−",  "8 units",  "City Hospital",  C.red700],
  ["09:28", "A+",  "12 units", "Apollo Hospital", C.blue],
  ["09:41", "B+",  "6 units",  "Kovai Medical",   C.green],
  ["09:55", "AB−", "4 units",  "Govt Hospital",   C.amber],
];

export default function BloodBank() {
  const [stock, setStock] = useState(Object.fromEntries(stockGroups.map(([g, u]) => [g, u])));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <KPICard label="Incoming requests" value="12"   change="4 urgent right now"       accent={C.red700} spark={0} />
        <KPICard label="Dispatched today"  value="184"  change="↑ 9% vs yesterday"         changeUp accent={C.green}  spark={1} />
        <KPICard label="Donors nearby"     value="47"   change="within 10 km"              changeUp accent={C.blue}   spark={2} />
        <KPICard label="Stock health"      value="74%"  change="2 groups need attention"   accent={C.amber}  spark={3} />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Card style={{ flex: 3, padding: "18px 20px" }}>
          <SectionTitle sub="live">Incoming requests</SectionTitle>
          <DataTable headers={["Hospital", "Group", "Units", "Received", "Priority", "Status"]} rows={reqRows} />
        </Card>

        <Card style={{ flex: 2, padding: "18px 20px" }}>
          <SectionTitle sub="tap +/− to adjust">Update stock levels</SectionTitle>
          <div style={{ height: 1, background: C.border, marginBottom: 12 }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            {stockGroups.map(([g,, col]) => (
              <div key={g} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.fog, borderRadius: 8, padding: "7px 10px" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: col, letterSpacing: "-0.3px" }}>{g}</div>
                  <div style={{ fontSize: 10, color: C.slate }}>{stock[g]} u</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => setStock(s => ({...s, [g]: Math.max(0, s[g]-1)})) } style={{ width: 20, height: 20, borderRadius: 4, border: `1px solid ${C.border}`, background: C.white, cursor: "pointer", fontSize: 12, color: C.slate, lineHeight: 1 }}>−</button>
                  <button onClick={() => setStock(s => ({...s, [g]: s[g]+1}))} style={{ width: 20, height: 20, borderRadius: 4, border: "none", background: C.red700, cursor: "pointer", fontSize: 12, color: C.white, lineHeight: 1 }}>+</button>
                </div>
              </div>
            ))}
          </div>
          <button style={{ width: "100%", height: 38, background: C.green, color: C.white, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 12 }}>Save changes</button>
        </Card>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Card style={{ flex: 3, padding: "18px 20px" }}>
          <SectionTitle>Nearby eligible donors</SectionTitle>
          <DataTable headers={["Name","Group","Distance","Last donation","Status"]} rows={donorRows} />
        </Card>

        <Card style={{ flex: 2, padding: "18px 20px" }}>
          <SectionTitle>Dispatched today</SectionTitle>
          {log.map(([time, grp, units, hosp, col], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, background: C.fog, borderRadius: "0 7px 7px 0", borderLeft: `3px solid ${col}`, padding: "8px 11px", marginBottom: 7 }}>
              <span style={{ fontSize: 10, color: C.gray, minWidth: 38 }}>{time}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: col, minWidth: 28 }}>{grp}</span>
              <span style={{ fontSize: 11, color: C.slate, flex: 1 }}>{units} → {hosp}</span>
              <span style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>✓ sent</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
