import { C } from "../../tokens";
import { KPICard, LineChart, DataTable, Card, SectionTitle } from "../shared/UI";

const rows = [
  ["O+",  "520", "96%", "↑ High demand", "Sufficient"],
  ["A+",  "380", "94%", "→ Stable",      "Sufficient"],
  ["B+",  "290", "91%", "→ Moderate",    "Sufficient"],
  ["O−",  "85",  "97%", "↑ High demand", "Critical"],
  ["B−",  "60",  "89%", "↑ High demand", "Critical"],
  ["AB+", "210", "93%", "→ Stable",      "Sufficient"],
  ["A−",  "55",  "88%", "↓ Declining",   "Low"],
  ["AB−", "30",  "85%", "↑ Rising",      "Low"],
];

export default function Forecast() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <KPICard label="Predicted demand (7 days)"  value="1,840 u" change="↑ 12% vs last week"   changeUp accent={C.red700} spark={0} />
        <KPICard label="Model accuracy"             value="94.3%"   change="R² = 0.941, retrained 6h ago" changeUp accent={C.blue}   spark={1} />
        <KPICard label="Groups at risk"             value="O− · B−" change="Shortage likely in 2 days"    accent={C.red700} spark={2} />
        <KPICard label="Weekend surge (festival)"   value="+28%"    change="Fri–Sun predicted spike"      accent={C.amber}  spark={3} />
      </div>

      {/* Inline warning banner — feels human, not part of the grid */}
      <div style={{ background: "#FFF4E5", border: `1px solid ${C.amber}44`, borderLeft: `3px solid ${C.amber}`, borderRadius: "0 10px 10px 0", padding: "10px 16px", display: "flex", gap: 10, alignItems: "center" }}>
        <span aria-hidden="true" style={{ fontSize: 13 }}>⚠️</span>
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#92600A" }}>Festival weekend alert — </span>
          <span style={{ fontSize: 12, color: "#92600A" }}>Pongal demand surge expected Saturday. Pre-stock O+ and A+ by Friday evening.</span>
        </div>
      </div>

      <Card style={{ padding: "18px 20px" }}>
        <SectionTitle sub="next 7 days · Mon–Sun">Demand forecast</SectionTitle>
        <LineChart values={[320, 390, 360, 450, 410, 520, 510]} labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]} color={C.red700} height={170} />
      </Card>

      <Card style={{ padding: "18px 20px" }}>
        <SectionTitle>Per group breakdown</SectionTitle>
        <DataTable headers={["Group", "Units needed", "Confidence", "Trend", "Stock status"]} rows={rows} />
      </Card>
    </div>
  );
}
