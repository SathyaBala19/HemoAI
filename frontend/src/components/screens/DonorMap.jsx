// src/components/screens/DonorMap.jsx
// Donor list is real data from auth-service's GET /api/users/donors.
// The map itself is a real, scrollable/zoomable Leaflet map using
// OpenStreetMap tiles (no API key needed). Donor pins are placed at the
// real coordinates of their registered city - the backend only stores
// city/state text, not per-address lat/lng, so donors sharing a city
// cluster near that city's real point (each nudged slightly so they
// don't sit exactly on top of each other) rather than at a precise
// street address.
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

// Real coordinates for the towns/cities that show up in this district's
// data. Not exhaustive - anything not listed falls back to the district
// center (Coimbatore) rather than being dropped from the map.
const CITY_COORDS = {
  coimbatore: [11.0168, 76.9558],
  erode: [11.3410, 77.7172],
  tiruppur: [11.1085, 77.3411],
  pollachi: [10.6600, 77.0090],
  salem: [11.6643, 78.1460],
  chennai: [13.0827, 80.2707],
};
const DEFAULT_CENTER = CITY_COORDS.coimbatore;

// Deterministic small offset (roughly a few hundred metres to ~1-2km)
// so donors in the same city don't stack exactly on top of each other -
// derived from the donor's own email, so it's stable across reloads
// rather than jittering around randomly on every render.
function jitter(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const dx = ((h % 200) - 100) / 10000;       // ~ -0.01..0.01 deg
  const dy = (((h >> 8) % 200) - 100) / 10000;
  return [dx, dy];
}

function coordsFor(donor) {
  const key = (donor.city || "").trim().toLowerCase();
  const base = CITY_COORDS[key] || DEFAULT_CENTER;
  const [dx, dy] = jitter(donor.email);
  return [base[0] + dx, base[1] + dy];
}

export default function DonorMap() {
  const token = getToken();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

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

  // Create the Leaflet map once, real OSM tiles, fully pannable/zoomable/
  // scroll-to-zoom - a real map, not a static illustration.
  useEffect(() => {
    if (loading || error || !mapElRef.current || mapRef.current) return;
    const map = L.map(mapElRef.current, { scrollWheelZoom: true }).setView(DEFAULT_CENTER, 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [loading, error]);

  // Keep markers in sync with the live donor list.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = donors.map((d, i) => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:32px;height:32px;border-radius:50%;background:${C.red700};border:2.5px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px ${C.red700}66;font-size:10px;font-weight:700;color:#fff;font-family:sans-serif;">${initials(d.name)}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const marker = L.marker(coordsFor(d), { icon }).addTo(map);
      const contact = d.phone
        ? `<a href="${smsLink(d.phone, d.bloodGroup)}" style="font-size:10px;font-weight:600;color:#fff;background:${C.green};border-radius:5px;padding:4px 8px;text-decoration:none;margin-right:6px;">Message</a>`
        : `<span style="font-size:10px;color:${C.gray};margin-right:6px;">No phone on file</span>`;
      marker.bindPopup(
        `<div style="font-size:11.5px;font-weight:600;color:${C.navy};">${d.name}</div>` +
        `<div style="font-size:10px;color:${C.gray};margin-bottom:6px;">${d.city || "City not provided"} · ${d.bloodGroup || "—"}</div>` +
        `<div>${contact}<a href="${mailLink(d.email, d.name, d.bloodGroup)}" style="font-size:10px;font-weight:600;color:#fff;background:${C.blue};border-radius:5px;padding:4px 8px;text-decoration:none;">Email</a></div>`
      );
      marker.on("click", () => setSelected(i));
      return marker;
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
    };
  }, [donors]);

  // Clicking a donor in the sidebar pans the real map to them and opens
  // their popup, instead of just highlighting a static illustration.
  useEffect(() => {
    if (selected == null) return;
    const marker = markersRef.current[selected];
    const map = mapRef.current;
    if (marker && map) {
      map.panTo(marker.getLatLng());
      marker.openPopup();
    }
  }, [selected]);

  if (loading) return <div style={{ fontSize: 12, color: C.gray, padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ fontSize: 12, color: C.red700, padding: 24 }}>{error}</div>;

  return (
    <div style={{ display: "flex", gap: 14, height: "calc(100vh - 114px)", minHeight: 460 }}>
      <div style={{ flex: 1, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 1000, background: "rgba(255,255,255,0.94)", borderRadius: 8, padding: "8px 12px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{donors.length} registered donors</div>
          <div style={{ fontSize: 10.5, color: C.gray, marginTop: 2 }}>Pinned at their registered city - real map, scroll/drag to explore</div>
        </div>
        <div ref={mapElRef} style={{ width: "100%", height: "100%" }} />
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
            <div key={d.id} onClick={() => setSelected(i)} style={{
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
