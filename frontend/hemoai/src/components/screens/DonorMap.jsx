import { useState } from "react";
import { C } from "../../tokens";

const donors = [
  { name: "Arjun Kumar",   group: "O−", dist: "1.2 km", avail: true,  note: "Last donated 3 months ago" },
  { name: "Priya Sharma",  group: "O−", dist: "2.8 km", avail: true,  note: "Donated 2 months ago" },
  { name: "Karthik Rajan", group: "O−", dist: "3.4 km", avail: false, note: "Too recent — 3 weeks ago" },
  { name: "Meena Devi",    group: "O−", dist: "4.9 km", avail: true,  note: "4 months since last donation" },
  { name: "Suresh Babu",   group: "O−", dist: "6.1 km", avail: true,  note: "Last donated 5 months ago" },
];

const pins = [
  { cx: "33%", cy: "38%", col: C.green, idx: 0 },
  { cx: "64%", cy: "31%", col: C.green, idx: 1 },
  { cx: "25%", cy: "60%", col: C.amber, idx: 2 },
  { cx: "71%", cy: "63%", col: C.green, idx: 3 },
  { cx: "57%", cy: "21%", col: C.green, idx: 4 },
];

function initials(n) { const p = n.split(" "); return (p[0][0]+(p[1]?p[1][0]:"")).toUpperCase(); }

export default function DonorMap() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ display: "flex", gap: 14, height: "calc(100vh - 114px)", minHeight: 460 }}>
      {/* Map */}
      <div style={{
        flex: 1, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", position: "relative",
        background: "#ECF4FD",
        backgroundImage: `repeating-linear-gradient(0deg, #C8DFFE 0px, #C8DFFE 1px, transparent 1px, transparent 52px), repeating-linear-gradient(90deg, #C8DFFE 0px, #C8DFFE 1px, transparent 1px, transparent 52px)`,
      }}>
        {/* Map label */}
        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 3, background: "rgba(255,255,255,0.94)", borderRadius: 8, padding: "8px 12px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Coimbatore · O− donors nearby</div>
          <div style={{ fontSize: 10.5, color: C.gray, marginTop: 2 }}>5 found within 7 km · 4 available</div>
        </div>

        {/* Legend */}
        <div style={{ position: "absolute", bottom: 14, left: 14, zIndex: 3, background: "rgba(255,255,255,0.94)", borderRadius: 8, padding: "7px 12px", display: "flex", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          {[[C.green,"Available"],[C.amber,"Ineligible"],[C.red700,"Hospital"]].map(([col,lbl]) => (
            <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: col }} />
              <span style={{ fontSize: 10, color: C.slate }}>{lbl}</span>
            </div>
          ))}
        </div>

        {/* Hospital pin */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 2 }}>
          <div style={{ width: 260, height: 260, borderRadius: "50%", border: `1.5px dashed ${C.red700}40`, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: C.red700, display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${C.white}`, boxShadow: "0 2px 8px rgba(190,0,24,0.4)" }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.white }}>H</span>
          </div>
        </div>

        {/* Donor pins */}
        {pins.map((p) => (
          <div key={p.idx} onClick={() => setSelected(selected === p.idx ? null : p.idx)} style={{ position: "absolute", left: p.cx, top: p.cy, transform: "translate(-50%,-50%)", zIndex: 2, cursor: "pointer" }}>
            <div style={{ width: selected === p.idx ? 40 : 34, height: selected === p.idx ? 40 : 34, borderRadius: "50%", background: p.col, border: `2.5px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 8px ${p.col}66`, transition: "all 0.15s" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: C.white }}>{initials(donors[p.idx].name)}</span>
            </div>
            {selected === p.idx && (
              <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 6, background: C.white, borderRadius: 8, padding: "7px 10px", whiteSpace: "nowrap", boxShadow: "0 3px 12px rgba(0,0,0,0.12)", zIndex: 10 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: C.navy }}>{donors[p.idx].name}</div>
                <div style={{ fontSize: 10, color: C.gray }}>{donors[p.idx].dist} · {donors[p.idx].group}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Donor list */}
      <div style={{ width: 312, border: `1px solid ${C.border}`, borderRadius: 12, background: C.white, padding: "16px 18px", overflowY: "auto", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(17,21,39,0.05)" }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, marginBottom: 3 }}>Nearby donors</div>
        <div style={{ fontSize: 11, color: C.gray, marginBottom: 14 }}>Searching for O− · 7 km radius</div>
        <div style={{ height: 1, background: C.border, marginBottom: 14 }} />

        <div style={{ flex: 1 }}>
          {donors.map((d, i) => (
            <div key={i} onClick={() => setSelected(selected===i?null:i)} style={{
              display: "flex", gap: 10, padding: "10px 8px",
              borderBottom: i < donors.length-1 ? `1px solid ${C.border}66` : "none",
              cursor: "pointer",
              background: selected===i ? C.blue50 : "transparent",
              borderRadius: selected===i ? 8 : 0,
              transition: "background 0.12s",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: d.avail ? C.red700 : "#C0C4D0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.white }}>{initials(d.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: d.avail ? C.navy : C.gray }}>{d.name}</div>
                <div style={{ fontSize: 10.5, color: C.gray, marginTop: 1 }}>{d.dist} · {d.group}</div>
                <div style={{ fontSize: 9.5, color: C.gray, marginTop: 2 }}>{d.note}</div>
              </div>
              <span style={{ fontSize: 9.5, fontWeight: 600, color: d.avail ? C.green : C.gray, background: d.avail ? C.green50 : C.fog, borderRadius: 5, padding: "2px 7px", whiteSpace: "nowrap", alignSelf: "flex-start" }}>{d.avail ? "Available" : "Not eligible"}</span>
            </div>
          ))}
        </div>

        <button style={{ width: "100%", height: 40, background: C.red700, color: C.white, border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 14 }}
          onMouseEnter={e => e.currentTarget.style.background = "#A80015"}
          onMouseLeave={e => e.currentTarget.style.background = C.red700}
        >SMS alert to 4 available donors</button>
      </div>
    </div>
  );
}
