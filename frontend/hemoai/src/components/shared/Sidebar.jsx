import { C } from "../../tokens";

function NavItem({ item, active, onClick }) {
  return (
    <div
      onClick={() => onClick(item.key)}
      style={{
        position: "relative", display: "flex", alignItems: "center", gap: 9,
        padding: "8px 10px", marginBottom: 1, borderRadius: 8, cursor: "pointer",
        background: active ? `${C.red700}22` : "transparent",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      {active && (
        <div style={{
          position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
          width: 3, height: 22, background: C.red700, borderRadius: "0 2px 2px 0",
        }} />
      )}
      <div style={{
        width: 26, height: 26, borderRadius: 6,
        background: active ? C.red700 : "rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: active ? C.white : C.gray }}>{item.abbr}</span>
      </div>
      <span style={{ fontSize: 12.5, color: active ? C.white : "#9298AE", fontWeight: active ? 600 : 400, flex: 1, lineHeight: 1 }}>
        {item.label}
      </span>
      {active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.red500, flexShrink: 0 }} />}
    </div>
  );
}

export default function Sidebar({ active, onNavigate, mainNav, donorNav, user }) {
  return (
    <div style={{
      width: 232, height: "100vh", background: "#0F1322",
      display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto",
      borderRight: "1px solid rgba(255,255,255,0.05)",
    }}>
      {/* Logo — slightly off-centre padding to feel human */}
      <div style={{ padding: "18px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 29, height: 29, borderRadius: 7, background: C.red700, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: C.white, letterSpacing: "-0.5px", flexShrink: 0 }}>H</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.white, letterSpacing: "-0.2px" }}>HemoAI</div>
          <div style={{ fontSize: 9.5, color: "#5C6480", marginTop: 1 }}>Blood Bank Platform</div>
        </div>
      </div>

      {mainNav.length > 0 && (
        <>
          <div style={{ padding: "14px 16px 5px", fontSize: 9, fontWeight: 700, color: "#454C6A", letterSpacing: "0.1em", textTransform: "uppercase" }}>Menu</div>
          <div style={{ padding: "0 8px" }}>
            {mainNav.map(item => <NavItem key={item.key} item={item} active={active === item.key} onClick={onNavigate} />)}
          </div>
        </>
      )}

      {donorNav.length > 0 && (
        <>
          <div style={{ margin: "10px 16px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }} />
          <div style={{ padding: "12px 16px 5px", fontSize: 9, fontWeight: 700, color: "#454C6A", letterSpacing: "0.1em", textTransform: "uppercase" }}>Account</div>
          <div style={{ padding: "0 8px" }}>
            {donorNav.map(item => <NavItem key={item.key} item={item} active={active === item.key} onClick={onNavigate} />)}
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 8px 6px" }}>
        <div
          onClick={() => onNavigate("__logout__")}
          style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 8, cursor: "pointer", opacity: 0.55 }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
          onMouseLeave={e => e.currentTarget.style.opacity = "0.55"}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5.5 7H12M9.5 4.5L12 7l-2.5 2.5M5.5 2.5H3a1 1 0 00-1 1v7a1 1 0 001 1h2.5" stroke="#9298AE" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 12, color: "#9298AE" }}>Sign out</span>
        </div>
      </div>

      {/* User */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "11px 16px 14px", display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.red700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.white, flexShrink: 0 }}>{user.initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#D8DBE8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
          <div style={{ fontSize: 10, color: "#5C6480", marginTop: 1 }}>{user.role}</div>
        </div>
      </div>
    </div>
  );
}
