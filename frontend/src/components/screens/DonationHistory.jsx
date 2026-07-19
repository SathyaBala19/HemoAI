import { useState } from "react";
import { C } from "../../tokens";
import { Card } from "../shared/UI";

const all = [
  { date: "14 Jun 2026", hosp: "City Hospital, Coimbatore",   bg: "O+", vol: "450 ml", type: "Whole Blood", year: "2026" },
  { date: "2 Mar 2026",  hosp: "Apollo Hospital, Coimbatore", bg: "O+", vol: "450 ml", type: "Whole Blood", year: "2026" },
  { date: "18 Dec 2025", hosp: "Kovai Medical Centre",        bg: "O+", vol: "450 ml", type: "Platelets",   year: "2025" },
  { date: "7 Sep 2025",  hosp: "Govt District Hospital",      bg: "O+", vol: "450 ml", type: "Whole Blood", year: "2025" },
  { date: "21 Jun 2025", hosp: "PSG Hospitals",               bg: "O+", vol: "450 ml", type: "Whole Blood", year: "2025" },
  { date: "14 Mar 2025", hosp: "City Hospital, Coimbatore",   bg: "O+", vol: "350 ml", type: "Plasma",      year: "2025" },
];

const years = ["All", "2026", "2025", "2024"];
const types = ["All types", "Whole Blood", "Platelets", "Plasma"];

export default function DonationHistory() {
  const [yr, setYr] = useState("All");
  const [tp, setTp] = useState("All types");

  const shown = all.filter(r => (yr === "All" || r.year === yr) && (tp === "All types" || r.type === tp));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Stats */}
      <div style={{ display: "flex", gap: 11 }}>
        {[["12", "donations", C.red700], ["4.8 L", "blood given", C.blue], ["~48", "lives impacted", C.green], ["5 mo", "current streak", C.amber]].map(([v,l,col]) => (
          <div key={l} style={{ flex: 1, background: C.white, borderRadius: 11, border: `1px solid ${C.border}`, padding: "14px 16px", boxShadow: "0 1px 3px rgba(17,21,39,0.05)" }}>
            <div style={{ width: 32, height: 3, background: col, borderRadius: 2, marginBottom: 9 }} />
            <div style={{ fontSize: 22, fontWeight: 700, color: col, letterSpacing: "-0.5px" }}>{v}</div>
            <div style={{ fontSize: 10.5, color: C.gray, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "10px 16px", background: C.white, borderRadius: 10, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 10.5, color: C.gray, fontWeight: 500, marginRight: 3 }}>Year</span>
          {years.map(f => <button key={f} onClick={() => setYr(f)} style={{ padding: "4px 11px", borderRadius: 6, cursor: "pointer", background: yr===f ? C.navy : C.white, border: `1px solid ${yr===f ? C.navy : C.border}`, color: yr===f ? C.white : C.slate, fontSize: 11, fontWeight: 500 }}>{f}</button>)}
        </div>
        <div style={{ width: 1, height: 20, background: C.border }} />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 10.5, color: C.gray, fontWeight: 500, marginRight: 3 }}>Type</span>
          {types.map(f => <button key={f} onClick={() => setTp(f)} style={{ padding: "4px 11px", borderRadius: 6, cursor: "pointer", background: tp===f ? C.navy : C.white, border: `1px solid ${tp===f ? C.navy : C.border}`, color: tp===f ? C.white : C.slate, fontSize: 11, fontWeight: 500 }}>{f}</button>)}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 10.5, color: C.gray }}>{shown.length} records</div>
      </div>

      {/* Table */}
      <Card style={{ overflow: "hidden" }}>
        <div style={{ height: 3, background: C.red700 }} />
        <div style={{ padding: "16px 18px" }}>
          {shown.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: C.gray, fontSize: 13 }}>No records for that filter.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["Date","Hospital","Group","Volume","Type",""].map((h,i) => (
                    <th key={i} style={{ textAlign: "left", padding: "8px 12px", fontSize: 10.5, fontWeight: 700, color: C.gray, background: C.warmgray, borderBottom: `1px solid ${C.border}`, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}66`, background: i%2===0 ? "#FAFBFC" : C.white }}>
                    <td style={{ padding: "10px 12px", color: C.navy, fontWeight: 500, whiteSpace: "nowrap" }}>{r.date}</td>
                    <td style={{ padding: "10px 12px", color: C.slate }}>{r.hosp}</td>
                    <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 12, fontWeight: 700, color: C.red700 }}>{r.bg}</span></td>
                    <td style={{ padding: "10px 12px", color: C.slate }}>{r.vol}</td>
                    <td style={{ padding: "10px 12px", color: C.slate }}>{r.type}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <button style={{ padding: "4px 10px", borderRadius: 6, background: C.white, border: `1px solid ${C.border}`, color: C.slate, fontSize: 10.5, cursor: "pointer" }}
                        onMouseEnter={e => { e.currentTarget.style.background=C.blue50; e.currentTarget.style.borderColor=C.blue; e.currentTarget.style.color=C.blue; }}
                        onMouseLeave={e => { e.currentTarget.style.background=C.white; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.slate; }}
                      >Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
