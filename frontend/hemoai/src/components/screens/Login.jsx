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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function BrandPanel() {
  return (
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
  );
}

function CardShell({ children }) {
  return (
    <div style={{ flex: 1, background: "#F4F5F8", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 28px" }}>
      <div style={{ width: "100%", maxWidth: 400, background: C.white, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(17,21,39,0.10)" }}>
        <div style={{ height: 4, background: C.red700 }} />
        <div style={{ padding: "28px 32px 34px" }}>{children}</div>
      </div>
    </div>
  );
}

function ForgotPasswordCard({ onBack }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function submit() {
    if (!email.trim()) return setError("Enter your email address");
    if (!EMAIL_RE.test(email.trim())) return setError("Enter a valid email address");
    setError("");
    setSent(true);
  }

  if (sent) {
    return (
      <CardShell>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.green50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 20, color: C.green }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Check your email</div>
        <div style={{ fontSize: 12.5, color: C.gray, lineHeight: 1.6, marginBottom: 20 }}>
          If an account exists for <strong style={{ color: C.navy }}>{email}</strong>, we've sent a link to reset your password.
        </div>
        <button onClick={onBack} style={{ width: "100%", height: 40, background: C.fog, color: C.navy, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
          ← Back to sign in
        </button>
      </CardShell>
    );
  }

  return (
    <CardShell>
      <div style={{ fontSize: 13, color: C.gray, marginBottom: 6 }}>Reset password</div>
      <div style={{ fontSize: 21, fontWeight: 700, color: C.navy, marginBottom: 10, letterSpacing: "-0.3px" }}>Forgot your password?</div>
      <div style={{ fontSize: 12, color: C.gray, marginBottom: 20, lineHeight: 1.5 }}>
        Enter the email tied to your account and we'll send a reset link.
      </div>

      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.slate, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
      <input
        value={email}
        onChange={e => { setEmail(e.target.value); if (error) setError(""); }}
        placeholder="you@example.com"
        style={{ width: "100%", height: 38, borderRadius: 7, border: `1.5px solid ${error ? C.red700 : C.border}`, background: C.fog, padding: "0 12px", fontSize: 12.5, color: C.navy, outline: "none", boxSizing: "border-box", marginBottom: error ? 4 : 18 }}
      />
      {error && <div style={{ fontSize: 10.5, color: C.red700, marginBottom: 14 }}>{error}</div>}

      <button
        onClick={submit}
        style={{ width: "100%", height: 42, background: C.red700, color: C.white, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.1px" }}
      >
        Send reset link
      </button>

      <div style={{ textAlign: "center", marginTop: 16, fontSize: 11.5 }}>
        <span onClick={onBack} style={{ color: C.blue, cursor: "pointer" }}>← Back to sign in</span>
      </div>
    </CardShell>
  );
}

export default function Login({ onLogin }) {
  const [role, setRole] = useState("Hospital Admin");
  const [email, setEmail] = useState(roleEmails["Hospital Admin"]);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [view, setView] = useState("signin"); // "signin" | "forgot"

  function selectRole(r) {
    setRole(r);
    setEmail(roleEmails[r]);
    setErrors({});
  }

  function submit() {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!EMAIL_RE.test(email.trim())) errs.email = "Enter a valid email address";
    if (!password.trim()) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length === 0) onLogin(role);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Roboto', sans-serif", background: "#0F1322" }}>
      <BrandPanel />

      {view === "forgot" ? (
        <ForgotPasswordCard onBack={() => setView("signin")} />
      ) : (
        <CardShell>
          <div style={{ fontSize: 13, color: C.gray, marginBottom: 6 }}>Welcome back</div>
          <div style={{ fontSize: 21, fontWeight: 700, color: C.navy, marginBottom: 22, letterSpacing: "-0.3px" }}>Sign in to your account</div>

          <div style={{ fontSize: 11, fontWeight: 600, color: C.slate, marginBottom: 9, textTransform: "uppercase", letterSpacing: "0.05em" }}>I'm a...</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
            {roles.map(r => (
              <button key={r} type="button" onClick={() => selectRole(r)} style={{
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
            value={email}
            onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(er => ({ ...er, email: undefined })); }}
            style={{ width: "100%", height: 38, borderRadius: 7, border: `1.5px solid ${errors.email ? C.red700 : C.border}`, background: C.fog, padding: "0 12px", fontSize: 12.5, color: C.navy, outline: "none", boxSizing: "border-box", marginBottom: errors.email ? 4 : 14 }}
          />
          {errors.email && <div style={{ fontSize: 10.5, color: C.red700, marginBottom: 10 }}>{errors.email}</div>}

          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.slate, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(er => ({ ...er, password: undefined })); }}
            placeholder="Enter your password"
            style={{ width: "100%", height: 38, borderRadius: 7, border: `1.5px solid ${errors.password ? C.red700 : C.border}`, background: C.fog, padding: "0 12px", fontSize: 12.5, color: C.navy, outline: "none", boxSizing: "border-box" }}
          />
          {errors.password && <div style={{ fontSize: 10.5, color: C.red700, marginTop: 5 }}>{errors.password}</div>}

          <div style={{ textAlign: "right", marginTop: 6, marginBottom: 18 }}>
            <span onClick={() => setView("forgot")} style={{ fontSize: 11, color: C.blue, cursor: "pointer" }}>Forgot password?</span>
          </div>

          <button
            onClick={submit}
            style={{ width: "100%", height: 42, background: C.red700, color: C.white, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.1px" }}
            onMouseEnter={e => e.currentTarget.style.background = "#A80015"}
            onMouseLeave={e => e.currentTarget.style.background = C.red700}
          >
            Continue →
          </button>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 10.5, color: C.gray }}>
            HemoAI v2.4 · Coimbatore District Health Dept
          </div>
        </CardShell>
      )}
    </div>
  );
}