// src/components/screens/DonorProfile.jsx
//
// Personal details come from auth-service (GET /api/users/profile).
// Donation stats and "last donated" come from donation-service
// (GET /api/donations/mine). Achievement badges are still a fixed list -
// this backend doesn't track badge/achievement unlocks, so which ones
// are "earned" is computed here from the donation count instead of
// being hardcoded per user.
import { useEffect, useState } from "react";
import { C } from "../../tokens";
import { Card } from "../shared/UI";
import { getMyProfile, listMyDonations, getToken } from "../../api";

function initials(n) {
  if (!n) return "?";
  const p = n.split(" ");
  return (p[0][0] + (p[1] ? p[1][0] : "")).toUpperCase();
}

export default function DonorProfile({ role }) {
  const token = getToken();
  const isDonor = role === "donor";

  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("You're not signed in. Please log in again.");
      setLoading(false);
      return;
    }
    Promise.all([getMyProfile(token), listMyDonations(token)])
      .then(([profileData, donationData]) => {
        setProfile(profileData);
        setDonations(donationData);
      })
      .catch(err => setError(err.message || "Could not load profile"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div style={{ fontSize: 12, color: C.gray, padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ fontSize: 12, color: C.red700, padding: 24 }}>{error}</div>;

  const donationCount = donations.length;
  const litresGiven = ((donationCount * 450) / 1000).toFixed(1);
  const livesTouched = donationCount * 3;
  const lastDonation = donations[0]; // listMyDonations returns newest first

  const details = [
    ["Name", profile.name],
    ["Email", profile.email],
    ["Location", [profile.city, profile.state].filter(Boolean).join(", ") || "Not provided"],
    ["Joined", profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"],
    ["Last donated", lastDonation ? `${lastDonation.donationDate} · ${lastDonation.location}` : "No donations yet"],
  ];

  // Badges are computed live from the real donation count, not stored
  // per-user on the backend - simple milestone thresholds.
  const badges = [
    ["First Drop",     "Donated for the first time", C.blue,   donationCount >= 1],
    ["Life Saver",     "Reached 5 donations",        C.green,  donationCount >= 5],
    ["Hero Donor",     "10 donations milestone",     C.red700, donationCount >= 10],
    ["Blood Champion", "20 donations",               C.amber,  donationCount >= 20],
  ];
  const earnedCount = badges.filter(b => b[3]).length;

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      {/* Left column */}
      <div style={{ width: 248, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ height: 56, background: `linear-gradient(135deg, #1a1f32 0%, #BE0018 100%)` }} />
          <div style={{ padding: "0 18px 20px", marginTop: -28, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.red700, border: `3px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: C.white, margin: "0 auto 10px", letterSpacing: "-0.5px" }}>{initials(profile.name)}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, letterSpacing: "-0.3px" }}>{profile.name}</div>
            <div style={{ fontSize: 10.5, color: C.gray, marginTop: 2 }}>
              {profile.createdAt ? `Donor since ${new Date(profile.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}` : ""}
            </div>
          </div>
        </Card>

        <Card style={{ padding: "14px 18px" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.red50, border: `1.5px solid ${C.red700}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.red700, letterSpacing: "-1px" }}>{profile.bloodGroup || "—"}</span>
            </div>
            <div style={{ fontSize: 11, color: C.gray, lineHeight: 1.3 }}>Blood<br/>group</div>
          </div>
          <div style={{ height: 1, background: C.border, marginBottom: 12 }} />
          {[[String(donationCount), "donations"], [`${litresGiven}L`, "blood given (est.)"], [String(livesTouched), "lives touched (est.)"]].map(([v, l], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 2 ? `1px solid ${C.border}80` : "none" }}>
              <span style={{ fontSize: 10.5, color: C.gray }}>{l}</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: C.navy, letterSpacing: "-0.3px" }}>{v}</span>
            </div>
          ))}
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
          <div style={{ fontSize: 10.5, color: C.gray, marginBottom: 13 }}>{earnedCount} of {badges.length} earned</div>
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
