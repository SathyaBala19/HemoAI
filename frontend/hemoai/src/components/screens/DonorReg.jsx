import { useState } from "react";
import { C } from "../../tokens";
import { Card, Field } from "../shared/UI";

const bloodGroups = ["A+", "A−", "B+", "B−", "O+", "O−", "AB+", "AB−"];
const genders = ["Male", "Female", "Prefer not to say"];

const criteria = [
  [true,  "Age between 18 and 65"],
  [true,  "Weight over 50 kg"],
  [true,  "Haemoglobin ≥ 12.5 g/dL"],
  [true,  "No blood donation in last 3 months"],
  [false, "No chronic illness or ongoing medication"],
  [false, "No surgery in the past 6 months"],
  [false, "Not pregnant or breastfeeding"],
];

const steps = [
  ["1", "We verify your profile within 24 hours",    C.blue],
  ["2", "You're added to the donor matching pool",   C.green],
  ["3", "You'll get SMS alerts for urgent needs",    C.amber],
  ["4", "Track every donation and its impact",       C.red700],
];

export default function DonorReg() {
  const [bg, setBg] = useState("O+");
  const [gender, setGender] = useState("Male");
  const [checks, setChecks] = useState([true, true, true, false]);

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      {/* Form */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ height: 3, background: C.red700 }} />
          <div style={{ padding: "22px 26px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 3, letterSpacing: "-0.2px" }}>Register as a donor</div>
            <div style={{ fontSize: 11.5, color: C.gray, marginBottom: 18 }}>Takes about 2 minutes. Your information is kept private.</div>

            <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Personal info</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px", marginBottom: 20 }}>
              <Field label="Full name"       placeholder="Arjun Kumar" />
              <Field label="City"            placeholder="Coimbatore" />
              <Field label="Email"           placeholder="arjun@email.com" />
              <Field label="State"           placeholder="Tamil Nadu" />
              <Field label="Phone"           placeholder="+91 98765 43210" />
              <Field label="PIN code"        placeholder="641004" />
              <Field label="Date of birth"   placeholder="15 / 03 / 1995" />
              <Field label="Aadhaar (last 4)" placeholder="4521" hint="We only store the last 4 digits" />
            </div>

            <div style={{ height: 1, background: C.border, marginBottom: 18 }} />

            <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 11 }}>Blood group</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
              {bloodGroups.map(g => (
                <button key={g} onClick={() => setBg(g)} style={{ minWidth: 52, height: 34, borderRadius: 7, cursor: "pointer", background: bg === g ? C.red700 : C.white, border: `1.5px solid ${bg === g ? C.red700 : C.border}`, color: bg === g ? C.white : C.slate, fontSize: 12, fontWeight: bg === g ? 700 : 400 }}>{g}</button>
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 11 }}>Gender</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {genders.map(g => (
                <button key={g} onClick={() => setGender(g)} style={{ padding: "7px 16px", borderRadius: 7, cursor: "pointer", background: gender === g ? C.red50 : C.white, border: `1.5px solid ${gender === g ? C.red700 : C.border}`, fontSize: 12, color: gender === g ? C.navy : C.slate, fontWeight: gender === g ? 600 : 400, display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${gender === g ? C.red700 : C.silver}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {gender === g && <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.red700 }} />}
                  </div>
                  {g}
                </button>
              ))}
            </div>

            <div style={{ height: 1, background: C.border, marginBottom: 18 }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Health declaration</div>
            {["I haven't donated blood in the last 3 months","I'm over 18 and weigh at least 50 kg","I don't have a chronic illness or recent surgery","I consent to my data being used for donor matching"].map((lbl, i) => (
              <div key={i} onClick={() => setChecks(c => c.map((v,j) => j===i?!v:v))} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 11, cursor: "pointer" }}>
                <div style={{ width: 17, height: 17, borderRadius: 4, flexShrink: 0, marginTop: 1, background: checks[i] ? C.red700 : C.white, border: `1.5px solid ${checks[i] ? C.red700 : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.white }}>{checks[i] ? "✓" : ""}</div>
                <span style={{ fontSize: 12, color: checks[i] ? C.navy : C.gray, lineHeight: 1.4 }}>{lbl}</span>
              </div>
            ))}

            <button style={{ width: "100%", height: 42, background: C.red700, color: C.white, border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 16, letterSpacing: "-0.1px" }}
              onMouseEnter={e => e.currentTarget.style.background = "#A80015"}
              onMouseLeave={e => e.currentTarget.style.background = C.red700}
            >Register →</button>
          </div>
        </Card>
      </div>

      {/* Info panel */}
      <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Eligibility checklist</div>
          {criteria.map(([ok, text], i) => (
            <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 9 }}>
              <span style={{ fontSize: 11, color: ok ? C.green : C.red700, flexShrink: 0, marginTop: 0.5 }}>{ok ? "✓" : "✗"}</span>
              <span style={{ fontSize: 11.5, color: C.slate, lineHeight: 1.4 }}>{text}</span>
            </div>
          ))}
        </Card>

        <Card style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>What happens next</div>
          {steps.map(([num, text, col], i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${col}18`, border: `1.5px solid ${col}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: col, flexShrink: 0, marginTop: 1 }}>{num}</div>
              <span style={{ fontSize: 11.5, color: C.slate, lineHeight: 1.4 }}>{text}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
