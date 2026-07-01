import { useState } from "react";
import { C } from "../../tokens";
import { Card } from "../shared/UI";

const donations = [
  { date: "14 Jun 2026", hosp: "City Hospital",   id: "HEMO-2026-0012-AK", type: "Whole Blood", vol: "450 ml", bg: "O+", no: "#0012", doctor: "Dr. S. Ramesh" },
  { date: "2 Mar 2026",  hosp: "Apollo Hospital", id: "HEMO-2026-0009-AK", type: "Whole Blood", vol: "450 ml", bg: "O+", no: "#0009", doctor: "Dr. K. Prabha" },
  { date: "18 Dec 2025", hosp: "Kovai Medical",   id: "HEMO-2025-0007-AK", type: "Platelets",   vol: "450 ml", bg: "O+", no: "#0007", doctor: "Dr. A. Venkat" },
  { date: "7 Sep 2025",  hosp: "Govt Hospital",   id: "HEMO-2025-0005-AK", type: "Whole Blood", vol: "450 ml", bg: "O+", no: "#0005", doctor: "Dr. S. Ramesh" },
  { date: "21 Jun 2025", hosp: "PSG Hospitals",   id: "HEMO-2025-0003-AK", type: "Whole Blood", vol: "450 ml", bg: "O+", no: "#0003", doctor: "Dr. R. Mohan" },
];

export default function Certificate() {
  const [idx, setIdx] = useState(0);
  const d = donations[idx];

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      {/* Certificate */}
      <div style={{ width: 520, flexShrink: 0, background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(17,21,39,0.10)", overflow: "hidden" }}>
        <div style={{ padding: 14, background: "#FEFAF2" }}>
          <div style={{ background: C.white, borderRadius: 10, border: `1.5px solid #E8CC7044` }}>
            {/* Header */}
            <div style={{ background: C.red700, padding: "14px 22px", display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.white, border: "1px solid rgba(255,255,255,0.25)" }}>H</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: "-0.2px" }}>HemoAI Blood Bank Platform</div>
                <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.7)" }}>Coimbatore District Health Department · Government of Tamil Nadu</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.6)", textAlign: "right" }}>
                <div>Certificate ID</div>
                <div style={{ fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{d.id}</div>
              </div>
            </div>

            <div style={{ padding: "22px 32px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.gray, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Certificate of Blood Donation</div>
              <div style={{ width: 60, height: 2, background: C.red700, margin: "0 auto 20px", opacity: 0.4 }} />

              <div style={{ fontSize: 11, color: C.gray }}>This certifies that</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, marginTop: 6, letterSpacing: "-0.5px" }}>Arjun Kumar</div>
              <div style={{ fontSize: 10, color: C.gray, marginTop: 3 }}>Donor ID · AK-2024-001 · Blood Group O+</div>

              <div style={{ height: 1, background: C.border, margin: "16px 40px" }} />
              <div style={{ fontSize: 11, color: C.gray }}>voluntarily donated blood on</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginTop: 6, letterSpacing: "-0.3px" }}>{d.date}</div>
              <div style={{ fontSize: 11, color: C.gray, marginTop: 10 }}>at <span style={{ fontWeight: 600, color: C.navy }}>{d.hosp}, Coimbatore</span></div>

              <div style={{ display: "flex", justifyContent: "center", gap: 28, margin: "18px 0 14px" }}>
                {[["Blood group", d.bg], ["Volume", d.vol], ["Component", d.type], ["Donation", d.no]].map(([lbl, val]) => (
                  <div key={lbl} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9.5, color: C.gray, textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.red700, marginTop: 2, letterSpacing: "-0.3px" }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#FFF5F6", borderRadius: 9, padding: "9px 16px", margin: "0 16px 16px", border: `1px solid ${C.red700}22` }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: C.red700 }}>This donation can save up to 3 lives</div>
                <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>Thank you for your generosity, Arjun.</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 24px", marginBottom: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 120, height: 1, background: `${C.navy}44`, marginBottom: 5 }} />
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.navy }}>{d.doctor}</div>
                  <div style={{ fontSize: 9.5, color: C.gray }}>Medical Officer</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 120, height: 1, background: `${C.navy}44`, marginBottom: 5 }} />
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.navy }}>HemoAI Platform</div>
                  <div style={{ fontSize: 9.5, color: C.green }}>✓ Digitally verified</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                <div style={{ width: 40, height: 40, background: C.fog, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.gray }}>QR</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 9, color: C.gray }}>Scan to verify authenticity</div>
                  <div style={{ fontSize: 8.5, color: C.gray, opacity: 0.7 }}>hemoai.gov.in/verify/{d.id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 13 }}>Share or download</div>
          {[["Download PDF", C.red700],["Share via WhatsApp", C.green],["Send by email", C.blue],["Add to LinkedIn", "#0A66C2"]].map(([lbl, col]) => (
            <button key={lbl} style={{ width: "100%", height: 38, borderRadius: 8, cursor: "pointer", background: `${col}10`, border: `1px solid ${col}44`, color: col, fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 9, padding: "0 14px", marginBottom: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: col, flexShrink: 0 }} />
              {lbl}
            </button>
          ))}
        </Card>

        <Card style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Select donation</div>
          <div style={{ fontSize: 10.5, color: C.gray, marginBottom: 12 }}>Certificate updates as you pick</div>
          <div style={{ height: 1, background: C.border, marginBottom: 11 }} />
          {donations.map((don, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{
              padding: "9px 11px", borderRadius: 8, marginBottom: 7, cursor: "pointer",
              background: idx===i ? C.red50 : C.white,
              border: `1.5px solid ${idx===i ? C.red700 : C.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: idx===i?600:400, color: idx===i?C.red700:C.navy }}>{don.date}</div>
                <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>{don.hosp} · {don.type}</div>
              </div>
              {idx===i && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.red700 }} />}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
