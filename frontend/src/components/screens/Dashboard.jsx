import { C } from "../../tokens";
import { KPICard, AlertRow, BarChart, Card, SectionTitle } from "../shared/UI";

const groups = [
  { g: "O+", pct: 38, col: C.red700 },
  { g: "A+", pct: 28, col: C.blue },
  { g: "B+", pct: 20, col: C.green },
  { g: "AB+", pct: 8, col: C.amber },
  { g: "O−", pct: 4, col: "#E05252" },
  { g: "A−", pct: 2, col: C.gray },
];

export default function Dashboard({ onNavigate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* KPIs — intentionally not all same flex, last one is slightly narrower */}
      <div style={{ display: "flex", gap: 12 }}>
        <KPICard label="Blood units on hand" value="2,847" change="↑ 12% vs last week" changeUp accent={C.red700} spark={0} />
        <KPICard label="Active donors"        value="1,293" change="↑ 8% this month"    changeUp accent={C.blue}   spark={1} />
        <KPICard label="Open alerts"          value="7"     change="3 need attention now"         accent={C.red700} spark={2} />
        <KPICard label="Fulfilled today"      value="34"    change="↑ 5 since morning"  changeUp accent={C.green}  spark={3} />
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Bar chart — slightly taller than the side panel */}
        <Card style={{ flex: 3, padding: "18px 20px 14px" }}>
          <SectionTitle sub="units requested">Blood requests this week</SectionTitle>
          <BarChart values={[320, 450, 280, 510, 390, 460, 420]} labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]} color={C.red700} />
        </Card>

        {/* Stock breakdown — different padding, narrower */}
        <Card style={{ flex: 2, padding: "18px 18px 16px" }}>
          <SectionTitle>Stock breakdown</SectionTitle>
          {groups.map(({ g, pct, col }) => (
            <div key={g} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.navy, width: 28, letterSpacing: "-0.3px" }}>{g}</span>
              <div style={{ flex: 1, height: 6, background: C.fog, borderRadius: 3 }}>
                <div style={{ height: 6, width: `${Math.min(100, pct * 2.2)}%`, background: col, borderRadius: 3 }} />
              </div>
              <span style={{ fontSize: 10, color: C.gray, width: 26, textAlign: "right" }}>{pct}%</span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: "9px 12px", background: C.red50, borderRadius: 8, borderLeft: `3px solid ${C.red700}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.red700 }}>O− and B− critically low</div>
            <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>Donor alerts sent · 4 responses pending</div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card style={{ padding: "18px 20px" }}>
        <SectionTitle action="See all alerts →" onAction={() => onNavigate?.("alerts")}>Recent alerts</SectionTitle>
        <AlertRow type="critical" title="O− critically low at City Hospital" desc="Only 12 units left. Daily demand is 9. SMS alerts sent to 4 nearby donors." time="2m ago" />
        <AlertRow type="low"      title="B− nearing threshold — Apollo Hospital" desc="61 units remaining vs threshold of 75. 3 donors were notified." time="18m ago" />
        <AlertRow type="resolved" title="A+ request fulfilled — Kovai Medical Centre" desc="18 units delivered. Request closed at 09:55 AM." time="1h ago" />
      </Card>
    </div>
  );
}
