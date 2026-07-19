import { useState } from "react";
import { C } from "../../tokens";
import { AlertRow, Card } from "../shared/UI";

const allAlerts = [
  { type: "critical", title: "O− critically low at City Hospital",         desc: "12 units left. Daily demand is 9. SMS sent to 4 nearby donors.",          time: "2m ago" },
  { type: "critical", title: "B− below threshold — Apollo Hospital",        desc: "61 units vs minimum 75. 3 eligible donors alerted within 5 km.",          time: "14m ago" },
  { type: "critical", title: "A− emergency — Kovai Medical Centre",         desc: "10 units requested urgently. Donor matching underway.",                   time: "28m ago" },
  { type: "low",      title: "AB− shortage likely in 3 days",               desc: "AI model flags 79% probability of stockout. Recommend proactive alert.",   time: "1h ago" },
  { type: "low",      title: "O+ demand spike this weekend",                desc: "Festival surge expected — +28%. Consider pre-stocking today.",             time: "2h ago" },
  { type: "low",      title: "B+ approaching minimum — Govt Hospital",      desc: "Current 88 units, threshold is 90. Keep watching.",                        time: "3h ago" },
  { type: "low",      title: "A+ request volume high today",                desc: "17 units requested so far, above the daily average of 12.",                time: "4h ago" },
  { type: "resolved", title: "B+ shortage cleared — Govt Hospital",         desc: "3 donors came in. 60 units collected. Back to safe level.",                time: "5h ago" },
  { type: "resolved", title: "A+ emergency request closed",                 desc: "18 units delivered to City Hospital.",                                     time: "6h ago" },
  { type: "resolved", title: "O+ SMS campaign — 12 donor responses",        desc: "Stock replenished. Campaign closed.",                                      time: "7h ago" },
  { type: "resolved", title: "AB− units transferred from regional reserve", desc: "24 units received. Stock now at safe level.",                              time: "9h ago" },
  { type: "resolved", title: "Pre-stock completed ahead of festival",        desc: "200 units staged for weekend demand.",                                    time: "11h ago" },
];

const tabs = [
  { label: `All`,                                              filter: null },
  { label: `Critical (${allAlerts.filter(a=>a.type==="critical").length})`, filter: "critical" },
  { label: `Warnings (${allAlerts.filter(a=>a.type==="low").length})`,      filter: "low" },
  { label: `Resolved (${allAlerts.filter(a=>a.type==="resolved").length})`, filter: "resolved" },
];

export default function Alerts() {
  const [tab, setTab] = useState(0);
  const shown = tabs[tab].filter ? allAlerts.filter(a => a.type === tabs[tab].filter) : allAlerts;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Alert feed</span>
          <span style={{ fontSize: 11, color: C.gray, marginLeft: 8 }}>auto-refreshing</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: "5px 14px", borderRadius: 7, cursor: "pointer",
              border: `1px solid ${tab === i ? C.navy : C.border}`,
              background: tab === i ? C.navy : C.white,
              color: tab === i ? C.white : C.slate,
              fontSize: 11, fontWeight: 500,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <Card style={{ padding: "16px 18px" }}>
        {shown.map((a, i) => <AlertRow key={i} type={a.type} title={a.title} desc={a.desc} time={a.time} />)}
      </Card>
    </div>
  );
}
