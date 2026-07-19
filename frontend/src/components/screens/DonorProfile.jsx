import { C } from "../../tokens";
import { Card } from "../shared/UI";

const details = [
  ["Name",          "Arjun Kumar"],
  ["Phone",         "+91 98765 43210"],
  ["Email",         "arjun.kumar@gmail.com"],
  ["Location",      "Coimbatore, Tamil Nadu"],
  ["Joined",        "12 Jan 2024"],
  ["Last donated",  "14 Jun 2026 · City Hospital"],
];

const badges = [
  ["First Drop",     "Donated for the first time",  C.blue,   true],
  ["Life Saver",     "Reached 5 donations",          C.green,  true],
  ["Hero Donor",     "10 donations milestone",        C.red700, true],
  ["Blood Champion", "20 donations",                  C.amber,  false],
  ["Regular",        "Donated for 6 months straight", C.green,  true],
  ["SOS Hero",       "Responded to an emergency",     C.red700, true],
];

export default function DonorProfile({ role }) {
  const isDonor = role === "Donor";
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      {/* Left column */}
      <div style={{ width: 248, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ height: 56, background: `linear-gradient(135deg, #1a1f32 0%, #BE0018 100%)` }} />
          <div style={{ padding: "0 18px 20px", marginTop: -28, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.red700, border: `3px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: C.white, margin: "0 auto 10px", letterSpacing: "-0.5px" }}>AK</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, letterSpacing: "-0.3px" }}>Arjun Kumar</div>
            <div style={{ fontSize: 10.5, color: C.gray, marginTop: 2 }}>Active donor since Jan 2024</div>
            <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 5, background: C.green50, border: `1px solid ${C.green}44`, borderRadius: 6, padding: "3px 10px" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: C.green }}>Verified donor</span>
            </div>
          </div>
        </Card>

        <Card style={{ padding: "14px 18px" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.red50, border: `1.5px solid ${C.red700}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.red700, letterSpacing: "-1px" }}>O+</span>
            </div>
            <div style={{ fontSize: 11, color: C.gray, lineHeight: 1.3 }}>Blood<br/>group</div>
          </div>
          <div style={{ height: 1, background: C.border, marginBottom: 12 }} />
          {[["12", "donations"], ["4.8L", "blood given"], ["48", "lives touched"]].map(([v, l], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 2 ? `1px solid ${C.border}80` : "none" }}>
              <span style={{ fontSize: 10.5, color: C.gray }}>{l}</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: C.navy, letterSpacing: "-0.3px" }}>{v}</span>
            </div>
          ))}
        </Card>

        <Card style={{ padding: "13px 16px", background: C.green50, border: `1px solid ${C.green}44` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.green, marginBottom: 2 }}>Eligible to donate</div>
          <div style={{ fontSize: 10, color: "#1A7A52" }}>Next window opens Aug 14, 2026</div>
          {isDonor && (
            <button style={{ width: "100%", height: 32, background: C.green, color: C.white, border: "none", borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: "pointer", marginTop: 10 }}>Book a slot →</button>
          )}
        </Card>
      </div>

      {/* Right column */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 13 }}>Personal details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 28px" }}>
            {details.map(([lbl, val], i) => (
              <div key={i} style={{ paddingBottom: 10, borderBottom: `1px solid ${C.border}66` }}>
                <div style={{ fontSize: 10, color: C.gray, marginBottom: 2 }}>{lbl}</div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: C.navy }}>{val}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Achievements</div>
          <div style={{ fontSize: 10.5, color: C.gray, marginBottom: 13 }}>5 of 6 earned</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            {badges.map(([name, desc, col, earned], i) => (
              <div key={i} style={{
                padding: "11px 13px", borderRadius: 9,
                background: earned ? `${col}12` : C.fog,
                border: `1px solid ${earned ? `${col}44` : C.border}`,
                opacity: earned ? 1 : 0.45,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: earned ? col : C.gray }}>{name}</div>
                <div style={{ fontSize: 10, color: C.gray, marginTop: 2, lineHeight: 1.3 }}>{desc}</div>
                {earned && <div style={{ fontSize: 9, fontWeight: 600, color: col, background: `${col}18`, borderRadius: 4, padding: "1px 6px", display: "inline-block", marginTop: 6 }}>✓ Earned</div>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
