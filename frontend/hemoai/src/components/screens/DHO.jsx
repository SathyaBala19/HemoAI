import { C } from "../../tokens";
import { KPICard, LineChart, DataTable, Card, SectionTitle } from "../shared/UI";

const taluks = [
  { name: "Coimbatore North", col: C.green,  units: "2,840", note: "Well stocked" },
  { name: "Coimbatore South", col: C.green,  units: "2,210", note: "Adequate" },
  { name: "Pollachi",         col: C.amber,  units: "1,640", note: "Watch closely" },
  { name: "Mettupalayam",     col: C.red700, units: "820",   note: "Needs restock" },
  { name: "Valparai",         col: C.red700, units: "410",   note: "Critical" },
  { name: "Kinathukadavu",    col: C.amber,  units: "1,100", note: "Low" },
];

const hospRows = [
  ["City Hospital",          "Coimbatore N", "2,840", "—",      "94/100", "Safe"],
  ["Apollo Hospital",        "Coimbatore S", "2,210", "AB−",    "81/100", "Safe"],
  ["Kovai Medical Centre",   "Coimbatore N", "1,980", "O−",     "72/100", "Low"],
  ["Govt District Hospital", "Mettupalayam", "820",   "O−, B−", "41/100", "Critical"],
  ["PSG Hospitals",          "Coimbatore S", "1,640", "B−",     "68/100", "Low"],
];

export default function DHO() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <KPICard label="Hospitals covered"   value="18"     change="Across 6 taluks"         changeUp accent={C.blue}   spark={0} />
        <KPICard label="District total"      value="14,820" change="↑ 3% this month"          changeUp accent={C.red700} spark={1} />
        <KPICard label="Shortages right now" value="3"      change="O−, B−, AB− below minimum" accent={C.red700} spark={2} />
        <KPICard label="Registered donors"   value="6,420"  change="↑ 142 joined this week"   changeUp accent={C.green}  spark={3} />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Card style={{ flex: 1, padding: "18px 20px" }}>
          <SectionTitle sub="by taluk · June 2026">Supply heatmap</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9 }}>
            {taluks.map(t => (
              <div key={t.name} style={{ padding: "11px 12px", borderRadius: 10, background: `${t.col}14`, border: `1.5px solid ${t.col}44` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: t.col, marginBottom: 5, lineHeight: 1.2 }}>{t.name}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, letterSpacing: "-0.5px" }}>{t.units}</div>
                <div style={{ fontSize: 9.5, color: t.col, marginTop: 3 }}>{t.note}</div>
              </div>
            ))}
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
          <SectionTitle sub="all hospitals combined">Monthly collection trend</SectionTitle>
          <LineChart values={[11200,12400,11800,13200,13800,14820]} labels={["Jan","Feb","Mar","Apr","May","Jun"]} color={C.red700} height={165} />
        </Card>
      </div>

      <Card style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>Hospital stock summary</span>
          <button style={{ padding: "5px 13px", background: C.navy, color: C.white, border: "none", borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>Export</button>
        </div>
        <DataTable headers={["Hospital","Taluk","Total units","Short on","Score","Status"]} rows={hospRows} />
      </Card>
    </div>
  );
}
