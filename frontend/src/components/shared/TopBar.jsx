import { useEffect, useRef, useState } from "react";
import { C } from "../../tokens";

const NOTIFICATIONS = [
  { id: 1, title: "O− critically low at City Hospital", desc: "Only 12 units left. SMS alerts sent to 4 nearby donors.", time: "2m ago", unread: true },
  { id: 2, title: "B− nearing threshold — Apollo Hospital", desc: "61 units remaining vs threshold of 75.", time: "18m ago", unread: true },
  { id: 3, title: "A+ request fulfilled — Kovai Medical Centre", desc: "18 units delivered. Request closed.", time: "1h ago", unread: false },
];

export default function TopBar({ title, subtitle, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(NOTIFICATIONS);
  const wrapRef = useRef(null);
  const unreadCount = items.filter(n => n.unread).length;

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function markAllRead() {
    setItems(items.map(n => ({ ...n, unread: false })));
  }

  return (
    <div style={{
      height: 58, background: C.white,
      borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", flexShrink: 0,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, letterSpacing: "-0.2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: C.gray, marginTop: 1 }}>{subtitle}</div>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 16 }}>
        <div style={{ display: "flex", alignItems: "center", background: C.fog, border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 11px", gap: 7, width: 176 }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="5.5" cy="5.5" r="4" stroke={C.gray} strokeWidth="1.3"/>
            <path d="M9 9l2.5 2.5" stroke={C.gray} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 11.5, color: C.gray }}>Search...</span>
        </div>

        <div ref={wrapRef} style={{ position: "relative" }}>
          <div
            onClick={() => setOpen(o => !o)}
            role="button"
            tabIndex={0}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 8, background: open ? C.red50 : C.fog, border: `1px solid ${open ? C.red700 + "55" : C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5A4.75 4.75 0 003.25 6.25c0 2.52-.76 4.1-1.5 5-.27.33.03.75.5.75h11.5c.47 0 .77-.42.5-.75-.74-.9-1.5-2.48-1.5-5A4.75 4.75 0 008 1.5z" stroke={C.slate} strokeWidth="1.3"/>
                <path d="M6.5 13a1.5 1.5 0 003 0" stroke={C.slate} strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            {unreadCount > 0 && (
              <div style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: C.red700, border: `1.5px solid ${C.white}` }} />
            )}
          </div>

          {open && (
            <div style={{
              position: "absolute", top: 42, right: 0, width: 320,
              background: C.white, border: `1px solid ${C.border}`, borderRadius: 12,
              boxShadow: "0 10px 28px rgba(17,21,39,0.16)", overflow: "hidden", zIndex: 50,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>Notifications</span>
                {unreadCount > 0 && (
                  <span onClick={markAllRead} style={{ fontSize: 10.5, color: C.blue, cursor: "pointer", fontWeight: 500 }}>Mark all read</span>
                )}
              </div>
              <div style={{ maxHeight: 280, overflowY: "auto" }}>
                {items.map(n => (
                  <div key={n.id} style={{ padding: "11px 14px", borderBottom: `1px solid ${C.border}66`, background: n.unread ? "#FFF9F9" : C.white, display: "flex", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: n.unread ? C.red700 : "transparent", marginTop: 5, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, lineHeight: 1.3 }}>{n.title}</div>
                      <div style={{ fontSize: 10.5, color: C.gray, marginTop: 2, lineHeight: 1.4 }}>{n.desc}</div>
                      <div style={{ fontSize: 9.5, color: C.gray, marginTop: 4 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ width: 1, height: 22, background: C.border }} />

        <div
          onClick={onLogout}
          title={`${user.name} · click to sign out`}
          style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", padding: "3px 6px", borderRadius: 8 }}
          onMouseEnter={e => e.currentTarget.style.background = C.fog}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.red700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.white }}>{user.initials}</div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: C.navy, lineHeight: 1.2 }}>{user.name.split(" ")[0]}</div>
            <div style={{ fontSize: 9.5, color: C.gray }}>{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}