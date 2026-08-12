// src/components/screens/Login.jsx
//
// This is the sign-in screen. It calls the REAL backend (auth-service,
// POST /api/auth/login - see src/api.js) to check the email/password and
// get back a JWT token. auth-service must be running on port 8081 for
// this to work (start.bat in the project root starts it automatically).
//
// Sign-in only asks for email/password - the role isn't picked here, it
// comes back from the backend's login response (see BACKEND_ROLE_TO_DISPLAY
// in roles.js) and is used to route to the right dashboard.
import { useState } from "react";
import { C } from "../../tokens";
import { loginUser, saveSession } from "../../api";
import { BACKEND_ROLE_TO_DISPLAY } from "../../roles";

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
          Track blood stock in real time, log donations, and keep every hospital's inventory up to date — all from one dashboard.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          {[["Live Inventory", C.blue], ["Stock Alerts", C.red700], ["Donor Directory", C.green]].map(([l, col]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, background: `${col}18`, border: `1px solid ${col}30` }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: col }} />
              <span style={{ fontSize: 11, color: col, fontWeight: 500 }}>{l}</span>
            </div>
          ))}
        </div>
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

// There's no password-reset endpoint anywhere in auth-service (no email
// sending infra exists in this project), so this deliberately does NOT
// pretend to send a reset link - that would tell someone "check your
// email" when nothing was ever sent. Points them to a real DHO instead.
function ForgotPasswordCard({ onBack }) {
  return (
    <CardShell>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.amber50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 20, color: C.amber }}>i</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Password reset isn't available yet</div>
      <div style={{ fontSize: 12.5, color: C.gray, lineHeight: 1.6, marginBottom: 20 }}>
        Self-service password reset hasn't been built for HemoAI yet. Contact your District Health Officer to have your password reset manually.
      </div>
      <button onClick={onBack} style={{ width: "100%", height: 40, background: C.fog, color: C.navy, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
        ← Back to sign in
      </button>
    </CardShell>
  );
}

// Status-specific banners shown when an account exists but can't sign in yet.
function StatusBanner({ status, reason }) {
  const map = {
    pending: {
      bg: C.amber50, fg: C.amber,
      title: "Account pending approval",
      body: "Your registration is still being reviewed by your District Health Officer. You'll get an email once it's approved.",
    },
    rejected: {
      bg: C.red50, fg: C.red700,
      title: "Registration was rejected",
      body: reason ? `Reason: ${reason}` : "Contact your District Health Officer for details.",
    },
    suspended: {
      bg: C.red50, fg: C.red700,
      title: "Account suspended",
      body: "Your access has been suspended. Contact your administrator to resolve this.",
    },
  };
  const cfg = map[status];
  if (!cfg) return null;
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.fg}30`, borderLeft: `3px solid ${cfg.fg}`, borderRadius: "0 8px 8px 0", padding: "10px 12px", marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: cfg.fg, marginBottom: 2 }}>{cfg.title}</div>
      <div style={{ fontSize: 11, color: C.slate, lineHeight: 1.5 }}>{cfg.body}</div>
    </div>
  );
}

export default function Login({ onLogin }) {
  // Keeps track of everything typed into the form.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [view, setView] = useState("signin"); // "signin" | "forgot"
  // { status, reason } | null - set from a real 403 response when the
  // account is PENDING or REJECTED (see AccountApprovalController on the
  // backend and postJson()'s accountStatus/accountReason handling below).
  const [blocked, setBlocked] = useState(null);

  // True while we're waiting for the backend to respond, so we can
  // disable the button and avoid double-submits.
  const [submitting, setSubmitting] = useState(false);

  // Runs when the user clicks "Continue" to sign in.
  async function submit() {
    // Basic form validation before we even talk to the backend.
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!EMAIL_RE.test(email.trim())) errs.email = "Enter a valid email address";
    if (!password.trim()) errs.password = "Password is required";
    setErrors(errs);
    setBlocked(null);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      // Ask auth-service (real backend, port 8081) to check the
      // email/password and hand back a signed JWT token.
      const result = await loginUser({ email: email.trim(), password });

      // Remember the token + user info so other screens/services could
      // use it later (e.g. calling employee-service with it).
      saveSession(result);

      // The backend returns a role like "HOSPITAL_ADMIN" - translate it
      // into the display name ("Hospital Admin") the rest of the app uses.
      const displayRole = BACKEND_ROLE_TO_DISPLAY[result.role];
      onLogin(displayRole);
    } catch (err) {
      if (err.accountStatus) {
        // Correct password, but the account is PENDING or REJECTED -
        // show the status banner instead of a generic error.
        setBlocked({ status: err.accountStatus.toLowerCase(), reason: err.accountReason });
      } else {
        // The backend sends a 401 for wrong credentials - show that
        // (or a network-error message) right under the password field.
        setErrors({ password: err.message || "Invalid email or password" });
      }
    } finally {
      setSubmitting(false);
    }
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

          {blocked && <StatusBanner status={blocked.status} reason={blocked.reason} />}

          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.slate, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
          <input
            value={email}
            onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(er => ({ ...er, email: undefined })); setBlocked(null); }}
            placeholder="you@example.com"
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
            disabled={submitting}
            style={{ width: "100%", height: 42, background: C.red700, color: C.white, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: submitting ? "default" : "pointer", letterSpacing: "-0.1px", opacity: submitting ? 0.7 : 1 }}
            onMouseEnter={e => e.currentTarget.style.background = "#A80015"}
            onMouseLeave={e => e.currentTarget.style.background = C.red700}
          >
            {submitting ? "Signing in…" : "Continue →"}
          </button>

          <div style={{ textAlign: "center", marginTop: 16, fontSize: 10.5, color: C.gray }}>
            HemoAI v2.4 · Coimbatore District Health Dept
          </div>
        </CardShell>
      )}
    </div>
  );
}