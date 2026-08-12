// src/components/screens/DonorMap.jsx
// Donor list is real data from auth-service's GET /api/users/donors.
// Pin positions are just a hash of each donor's email, not real
// geocoding - no map library/coordinates in this project yet.
import { useEffect, useState } from "react";
import { C } from "../../tokens";
import { listDonors, getToken } from "../../api";

function initials(n) { const p = n.split(" "); return (p[0][0] + (p[1] ? p[1][0] : "")).toUpperCase(); }

// Pre-filled "we need your blood" outreach message - opens the donor's own
// SMS/mail app with this text ready to send, addressed to their real
// phone/email from auth-service. Nothing is sent from our servers - the
// staff member sends it themselves from their own device, same as
// tapping a phone number to call, just via message instead.
function smsLink(phone, bloodGroup) {
  const body = `Hi, this is HemoAI Blood Bank. We urgently need ${bloodGroup || "your blood group"} donors - can you donate soon? Reply to confirm.`;
  return `sms:${phone}?body=${encodeURIComponent(body)}`;
}
function mailLink(email, name, bloodGroup) {
  const subject = "Urgent blood donation request - HemoAI";
  const body = `Hi ${name},\n\nWe urgently need ${bloodGroup || "your blood group"} donors at our blood bank. Could you donate in the next few days?\n\nThank you,\nHemoAI Blood Bank`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// A simple deterministic hash so the same donor always gets the same pin
// position on the map, without needing any real coordinates.
function hashPosition(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return { cx: `${15 + (h % 70)}%`, cy: `${15 + ((h >> 8) % 70)}%` };
}

export default function DonorMap() {
  const token = getToken();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("You're not signed in. Please log in again.");
      setLoading(false);
      return;
    }
    listDonors(token)
      .then(data => setDonors(data))
      .catch(err => setError(err.message || "Could not load donors"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div style={{ fontSize: 12, color: C.gray, padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ fontSize: 12, color: C.red700, padding: 24 }}>{error}</div>;

  const pins = donors.map(d => ({ ...d, ...hashPosition(d.email) }));

  return (
    <div style={{ display: "flex", gap: 14, height: "calc(100vh - 114px)", minHeight: 460 }}>
      {/* "Map" - see the file comment above for what's real vs illustrative here */}
      <div style={{
        flex: 1, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", position: "relative",
        background: "#ECF4FD",
        backgroundImage: `repeating-linear-gradient(0deg, #C8DFFE 0px, #C8DFFE 1px, transparent 1px, transparent 52px), repeating-linear-gradient(90deg, #C8DFFE 0px, #C8DFFE 1px, transparent 1px, transparent 52px)`,
      }}>
        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 3, background: "rgba(255,255,255,0.94)", borderRadius: 8, padding: "8px 12px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{donors.length} registered donors</div>
          <div style={{ fontSize: 10.5, color: C.gray, marginTop: 2 }}>Pin positions are illustrative, not real geocoding</div>
        </div>

        {pins.map((p, i) => (
          <div key={p.id} onClick={() => setSelected(selected === i ? null : i)} style={{ position: "absolute", left: p.cx, top: p.cy, transform: "translate(-50%,-50%)", zIndex: 2, cursor: "pointer" }}>
            <div style={{ width: selected === i ? 40 : 34, height: selected === i ? 40 : 34, borderRadius: "50%", background: C.red700, border: `2.5px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 8px ${C.red700}66`, transition: "all 0.15s" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: C.white }}>{initials(p.name)}</span>
            </div>
            {selected === i && (
              <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 6, background: C.white, borderRadius: 8, padding: "8px 11px", whiteSpace: "nowrap", boxShadow: "0 3px 12px rgba(0,0,0,0.12)", zIndex: 10 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: C.navy }}>{p.name}</div>
                <div style={{ fontSize: 10, color: C.gray, marginBottom: 6 }}>{p.city || "City not provided"} · {p.bloodGroup || "—"}</div>
                <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                  {p.phone ? (
                    <a href={smsLink(p.phone, p.bloodGroup)} style={{ fontSize: 10, fontWeight: 600, color: C.white, background: C.green, borderRadius: 5, padding: "4px 8px", textDecoration: "none" }}>Message</a>
                  ) : (
                    <span style={{ fontSize: 10, color: C.gray }}>No phone on file</span>
                  )}
                  <a href={mailLink(p.email, p.name, p.bloodGroup)} style={{ fontSize: 10, fontWeight: 600, color: C.white, background: C.blue, borderRadius: 5, padding: "4px 8px", textDecoration: "none" }}>Email</a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Donor list */}
      <div style={{ width: 312, border: `1px solid ${C.border}`, borderRadius: 12, background: C.white, padding: "16px 18px", overflowY: "auto", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(17,21,39,0.05)" }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, marginBottom: 3 }}>All registered donors</div>
        <div style={{ fontSize: 11, color: C.gray, marginBottom: 14 }}>Live from auth-service</div>
        <div style={{ height: 1, background: C.border, marginBottom: 14 }} />

        <div style={{ flex: 1 }}>
          {donors.length === 0 ? (
            <div style={{ fontSize: 12, color: C.gray, textAlign: "center", padding: "20px 0" }}>No donors registered yet.</div>
          ) : donors.map((d, i) => (
            <div key={d.id} onClick={() => setSelected(selected === i ? null : i)} style={{
              display: "flex", gap: 10, padding: "10px 8px",
              borderBottom: i < donors.length - 1 ? `1px solid ${C.border}66` : "none",
              cursor: "pointer",
              background: selected === i ? C.blue50 : "transparent",
              borderRadius: selected === i ? 8 : 0,
              transition: "background 0.12s",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: C.red700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.white }}>{initials(d.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{d.name}</div>
                <div style={{ fontSize: 10.5, color: C.gray, marginTop: 1 }}>{d.city || "City not provided"}{d.state ? `, ${d.state}` : ""}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }} onClick={e => e.stopPropagation()}>
                  {d.phone && <a href={smsLink(d.phone, d.bloodGroup)} title={d.phone} style={{ fontSize: 10, color: C.green, textDecoration: "none", fontWeight: 600 }}>Message</a>}
                  <a href={mailLink(d.email, d.name, d.bloodGroup)} title={d.email} style={{ fontSize: 10, color: C.blue, textDecoration: "none", fontWeight: 600 }}>Email</a>
                </div>
              </div>
              <span style={{ fontSize: 9.5, fontWeight: 600, color: C.red700, background: C.red50, borderRadius: 5, padding: "2px 7px", whiteSpace: "nowrap", alignSelf: "flex-start" }}>{d.bloodGroup || "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
