import { useState } from "react";
import { C } from "../../tokens";

const roles = ["Hospital Admin", "Blood Bank Officer", "DHO", "Donor"];

const roleHints = {
  "Hospital Admin":     "Manage stock, requests & reports for your hospital",
  "Blood Bank Officer": "Handle requests, dispatches and donor coordination",
  "DHO":                "District-level oversight across all facilities",
  "Donor":              "View your donation history and certificates",
};

const roleEmails = {
  "Hospital Admin":     "sathya.bala@cityhospital.gov.in",
  "Blood Bank Officer": "rajan.k@cityhospital.gov.in",
  "DHO":                "p.selvam@coimbatore.tn.gov.in",
  "Donor":              "arjun.kumar@gmail.com",
};

export default function Login({ onLogin }) {
  const [role, setRole] = useState("Hospital Admin");

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Roboto', sans-serif", background: "#0F1322" }}>
      {/* Left */}
      <div style={{
        flex: "0 0 54%", padding: "52px 48px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(190,0,24,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 40, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,121,240,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: C.red700, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, color: C.white }}>H</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white, letterSpacing: "-0.3px" }}>HemoAI</div>
            <div style={{ fontSize: 10, color: "#5C6480" }}>Blood Bank Platform</div>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, color: C.red500, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Built for Coimbatore District</div>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: C.white, lineHeight: 1.15, margin: 0, letterSpacing: "-1px" }}>
            Smarter blood<br />
            <span style={{ color: C.red500 }}>bank management.</span>
          </h1>
          <p style={{ fontSize: 14, color: "#6B7290", marginTop: 16, lineHeight: 1.65, maxWidth: 380 }}>
            Forecast shortages before they happen, match donors in minutes, and keep every hospital stocked — all from one dashboard.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            {[["ML Forecast", C.blue], ["Live Alerts", C.red700], ["Donor Match", C.green]].map(([l, col]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, background: `${col}18`, border: `1px solid ${col}30` }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: col }} />
                <span style={{ fontSize: 11, color: col, fontWeight: 500 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 36, position: "relative" }}>
          {[["2,847", "units tracked"], ["1,293", "registered donors"], ["94.3%", "forecast accuracy"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.white, letterSpacing: "-0.5px" }}>{v}</div>
              <div style={{ fontSize: 10.5, color: "#5C6480", marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, background: "#F4F5F8", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 28px" }}>
        <div style={{ width: "100%", maxWidth: 400, background: C.white, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(17,21,39,0.10)" }}>
          <div style={{ height: 4, background: C.red700 }} />
          <div style={{ padding: "28px 32px 34px" }}>
            <div style={{ fontSize: 13, color: C.gray, marginBottom: 6 }}>Welcome back</div>
            <div style={{ fontSize: 21, fontWeight: 700, color: C.navy, marginBottom: 22, letterSpacing: "-0.3px" }}>Sign in to your account</div>

            <div style={{ fontSize: 11, fontWeight: 600, color: C.slate, marginBottom: 9, textTransform: "uppercase", letterSpacing: "0.05em" }}>I'm a...</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
              {roles.map(r => (
                <button key={r} onClick={() => setRole(r)} style={{
                  padding: "9px 13px", borderRadius: 9, cursor: "pointer", textAlign: "left",
                  border: `1.5px solid ${role === r ? C.red700 : C.border}`,
                  background: role === r ? "#FFF5F6" : C.white,
                  display: "flex", alignItems: "center", gap: 11, transition: "border-color 0.12s",
                }}>
                  <div style={{ width: 15, height: 15, borderRadius: "50%", border: `2px solid ${role === r ? C.red700 : C.silver}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {role === r && <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.red700 }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: role === r ? 600 : 400, color: role === r ? C.navy : C.slate }}>{r}</div>
                    <div style={{ fontSize: 10.5, color: C.gray, marginTop: 1 }}>{roleHints[r]}</div>
                  </div>
                </button>
              ))}
            </div>

            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.slate, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
            <input
              key={role}
              defaultValue={roleEmails[role]}
              style={{ width: "100%", height: 38, borderRadius: 7, border: `1.5px solid ${C.border}`, background: C.fog, padding: "0 12px", fontSize: 12.5, color: C.navy, outline: "none", boxSizing: "border-box", marginBottom: 14 }}
              onFocus={e => e.target.style.borderColor = C.blue}
              onBlur={e => e.target.style.borderColor = C.border}
            />

            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.slate, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
            <input
              type="password" defaultValue="••••••••"
              style={{ width: "100%", height: 38, borderRadius: 7, border: `1.5px solid ${C.border}`, background: C.fog, padding: "0 12px", fontSize: 12.5, color: C.navy, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = C.blue}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <div style={{ textAlign: "right", marginTop: 6, marginBottom: 18 }}>
              <span style={{ fontSize: 11, color: C.blue, cursor: "pointer" }}>Forgot password?</span>
            </div>

            <button
              onClick={() => onLogin(role)}
              style={{ width: "100%", height: 42, background: C.red700, color: C.white, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.1px" }}
              onMouseEnter={e => e.currentTarget.style.background = "#A80015"}
              onMouseLeave={e => e.currentTarget.style.background = C.red700}
            >
              Continue →
            </button>

            <div style={{ textAlign: "center", marginTop: 16, fontSize: 10.5, color: C.gray }}>
              HemoAI v2.4 · Coimbatore District Health Dept
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
