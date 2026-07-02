import { C } from "../../tokens";

function IconTrendingUp({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2.5 14.5l5-5.5 3.5 3 6-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 4.5h4v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBell({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2.2A5.3 5.3 0 004.7 7.5c0 3.1-.9 4.9-1.8 5.9-.3.4 0 .9.6.9h13c.6 0 .9-.5.6-.9-.9-1-1.8-2.8-1.8-5.9A5.3 5.3 0 0010 2.2z" stroke={color} strokeWidth="1.6" />
      <path d="M8 16.2a2 2 0 004 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconHeartHandshake({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 16.5s-6-3.7-6-8.2A3.3 3.3 0 0110 6a3.3 3.3 0 016 2.3c0 4.5-6 8.2-6 8.2z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

const FEATURES = [
  ["ML Forecast", C.blue, "Predicts shortages days before they happen, so hospitals can act early instead of reacting to a crisis.", IconTrendingUp],
  ["Live Alerts", C.red700, "Automatic SMS pings to nearby eligible donors the moment stock drops below a safe threshold.", IconBell],
  ["Donor Match", C.green, "Finds and ranks compatible donors by distance and eligibility in seconds, not phone calls.", IconHeartHandshake],
];

const STATS = [
  ["2,847", "units tracked"],
  ["1,293", "registered donors"],
  ["94.3%", "forecast accuracy"],
  ["18 min", "avg. donor response"],
];

const STEPS = [
  ["1", "A hospital's stock drops below its safe threshold"],
  ["2", "HemoAI forecasts the shortfall and flags it instantly"],
  ["3", "Nearby eligible donors get an SMS alert automatically"],
  ["4", "Staff track responses and fulfilment in one dashboard"],
];

function NavBar({ onSignIn }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", position: "relative", zIndex: 2 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: C.red700, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: C.white }}>H</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.white, letterSpacing: "-0.3px" }}>HemoAI</div>
      </div>
      <button
        onClick={onSignIn}
        style={{ height: 38, padding: "0 20px", background: "rgba(255,255,255,0.08)", color: C.white, border: "1px solid rgba(255,255,255,0.18)", borderRadius: 9, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.16)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
      >
        Sign in →
      </button>
    </div>
  );
}

export default function Landing({ onGetStarted, onSignIn }) {
  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", background: "#F2F3F6" }}>
      {/* Hero */}
      <div style={{ background: "#0F1322", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: -80, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(190,0,24,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -120, right: -100, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,121,240,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />

        <NavBar onSignIn={onSignIn} />

        <div style={{ position: "relative", padding: "56px 48px 80px", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", fontSize: 11, color: C.red500, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, padding: "5px 14px", border: `1px solid ${C.red500}44`, borderRadius: 999 }}>
            Built for Coimbatore District
          </div>
          <h1 style={{ fontSize: 46, fontWeight: 800, color: C.white, lineHeight: 1.15, margin: 0, letterSpacing: "-1.2px" }}>
            Never run out of<br />
            <span style={{ color: C.red500 }}>blood, when it matters most.</span>
          </h1>
          <p style={{ fontSize: 15, color: "#8890AC", marginTop: 20, lineHeight: 1.7, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            HemoAI forecasts shortages before they happen, matches donors to hospitals in minutes,
            and keeps every facility in the district stocked — all from one dashboard.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32 }}>
            <button
              onClick={onSignIn}
              style={{ height: 46, padding: "0 26px", background: C.red700, color: C.white, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.1px" }}
              onMouseEnter={e => e.currentTarget.style.background = "#A80015"}
              onMouseLeave={e => e.currentTarget.style.background = C.red700}
            >
              Sign in to dashboard →
            </button>
            <button
              onClick={onGetStarted}
              style={{ height: 46, padding: "0 26px", background: "transparent", color: C.white, border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Register as a donor
            </button>
          </div>

          <div style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
            {STATS.map(([v, l]) => (
              <div key={l}>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.white, letterSpacing: "-0.5px" }}>{v}</div>
                <div style={{ fontSize: 11, color: "#6B7290", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "64px 48px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: C.red700, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Why HemoAI</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.navy, letterSpacing: "-0.5px" }}>Three tools, one platform</div>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {FEATURES.map(([title, col, desc, Icon]) => (
            <div key={title} style={{ flex: "1 1 260px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 22px 24px", boxShadow: "0 1px 3px rgba(17,21,39,0.05)" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${col}18`, border: `1px solid ${col}30`, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon color={col} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 12.5, color: C.gray, lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 48px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: C.red700, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>How it works</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.navy, letterSpacing: "-0.5px" }}>From low stock to donor response, automatically</div>
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {STEPS.map(([num, text]) => (
            <div key={num} style={{ flex: "1 1 200px", background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.red50, border: `1.5px solid ${C.red700}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.red700, marginBottom: 12 }}>{num}</div>
              <div style={{ fontSize: 12.5, color: C.slate, lineHeight: 1.5 }}>{text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 48px 72px" }}>
        <div style={{ background: C.navy, borderRadius: 18, padding: "40px 36px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(190,0,24,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ fontSize: 22, fontWeight: 700, color: C.white, letterSpacing: "-0.4px", marginBottom: 10, position: "relative" }}>Ready to keep your district stocked?</div>
          <div style={{ fontSize: 12.5, color: "#8890AC", marginBottom: 24, position: "relative" }}>Sign in as a hospital admin, blood bank officer, DHO, or donor.</div>
          <button
            onClick={onSignIn}
            style={{ height: 44, padding: "0 26px", background: C.red700, color: C.white, border: "none", borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: "pointer", position: "relative" }}
            onMouseEnter={e => e.currentTarget.style.background = "#A80015"}
            onMouseLeave={e => e.currentTarget.style.background = C.red700}
          >
            Sign in →
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 28, fontSize: 10.5, color: C.gray }}>
          HemoAI v2.4 · Coimbatore District Health Dept
        </div>
      </div>
    </div>
  );
}