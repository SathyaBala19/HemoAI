// src/components/screens/Certificate.jsx
//
// Renders a certificate for one of the donor's REAL donations (from
// donation-service, GET /api/donations/mine). Fields this backend
// doesn't track (volume, component type, doctor's name) have been
// dropped rather than left as fabricated placeholder text.
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { C } from "../../tokens";
import { Card } from "../shared/UI";
import { listMyDonations, getToken, getStoredUser } from "../../api";

export default function Certificate() {
  const token = getToken();
  const currentUser = getStoredUser();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [idx, setIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setError("You're not signed in. Please log in again.");
      setLoading(false);
      return;
    }
    listMyDonations(token)
      .then(data => setDonations(data))
      .catch(err => setError(err.message || "Could not load donations"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div style={{ fontSize: 12, color: C.gray, padding: 24 }}>Loading…</div>;
  if (error) return <div style={{ fontSize: 12, color: C.red700, padding: 24 }}>{error}</div>;
  if (donations.length === 0) {
    return (
      <Card style={{ maxWidth: 480, margin: "40px auto", padding: 28, textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 8 }}>No donations yet</div>
        <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.6 }}>
          Log your first donation on the Donation History screen to generate a certificate.
        </div>
      </Card>
    );
  }

  const d = donations[idx];

  // Renders just the certificate card to an image and drops it into a
  // single properly-sized PDF page - a real file download, not the old
  // window.print() approach which printed the whole app (sidebar, topbar,
  // side panel and all) instead of just the certificate.
  async function handleDownload() {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`HemoAI-Certificate-${d.certificateId}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      {/* Certificate */}
      <div ref={certRef} style={{ width: 520, flexShrink: 0, background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 2px 12px rgba(17,21,39,0.10)", overflow: "hidden" }}>
        <div style={{ padding: 14, background: "#FEFAF2" }}>
          <div style={{ background: C.white, borderRadius: 10, border: `1.5px solid #E8CC7044` }}>
            {/* Header */}
            <div style={{ background: C.red700, padding: "14px 22px", display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: C.white, border: "1px solid rgba(255,255,255,0.25)" }}>H</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white, letterSpacing: "-0.2px" }}>HemoAI Blood Bank Platform</div>
                <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.7)" }}>Coimbatore District Health Department</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.6)", textAlign: "right" }}>
                <div>Certificate ID</div>
                <div style={{ fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{d.certificateId}</div>
              </div>
            </div>

            <div style={{ padding: "22px 32px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.gray, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Certificate of Blood Donation</div>
              <div style={{ width: 60, height: 2, background: C.red700, margin: "0 auto 20px", opacity: 0.4 }} />

              <div style={{ fontSize: 11, color: C.gray }}>This certifies that</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, marginTop: 6, letterSpacing: "-0.5px" }}>{d.donorName}</div>
              <div style={{ fontSize: 10, color: C.gray, marginTop: 3 }}>Blood Group {d.bloodGroup}</div>

              <div style={{ height: 1, background: C.border, margin: "16px 40px" }} />
              <div style={{ fontSize: 11, color: C.gray }}>voluntarily donated blood on</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginTop: 6, letterSpacing: "-0.3px" }}>{d.donationDate}</div>
              <div style={{ fontSize: 11, color: C.gray, marginTop: 10 }}>at <span style={{ fontWeight: 600, color: C.navy }}>{d.location}</span></div>

              <div style={{ background: "#FFF5F6", borderRadius: 9, padding: "9px 16px", margin: "18px 16px 16px", border: `1px solid ${C.red700}22` }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: C.red700 }}>This donation can save up to 3 lives</div>
                <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>Thank you for your generosity, {d.donorName?.split(" ")[0]}.</div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                <div style={{ width: 40, height: 40, background: C.fog, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.gray }}>QR</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 9, color: C.gray }}>Scan to verify authenticity</div>
                  <div style={{ fontSize: 8.5, color: C.gray, opacity: 0.7 }}>hemoai.gov.in/verify/{d.certificateId}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 13 }}>Share or download</div>
          {[
            [downloading ? "Preparing PDF…" : "Download PDF", C.red700, handleDownload, downloading],
            ["Share via WhatsApp", C.green, () => window.open(
              `https://wa.me/?text=${encodeURIComponent(`I donated blood on ${d.donationDate} at ${d.location} — certificate ${d.certificateId}, via HemoAI.`)}`,
              "_blank"
            )],
            ["Send by email", C.blue, () => {
              window.location.href = `mailto:?subject=${encodeURIComponent(`HemoAI donation certificate ${d.certificateId}`)}&body=${encodeURIComponent(`Certificate ${d.certificateId} for a blood donation on ${d.donationDate} at ${d.location}.`)}`;
            }],
          ].map(([lbl, col, onClick, disabled]) => (
            <button key={lbl} type="button" onClick={onClick} disabled={disabled} style={{ width: "100%", height: 38, borderRadius: 8, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.7 : 1, background: `${col}10`, border: `1px solid ${col}44`, color: col, fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 9, padding: "0 14px", marginBottom: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: col, flexShrink: 0 }} />
              {lbl}
            </button>
          ))}
          <div style={{ fontSize: 9.5, color: C.gray, marginTop: 2, lineHeight: 1.4 }}>
            Downloads just the certificate as a PDF file - no print dialog, no rest of the page included.
          </div>
        </Card>

        <Card style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Select donation</div>
          <div style={{ fontSize: 10.5, color: C.gray, marginBottom: 12 }}>Certificate updates as you pick</div>
          <div style={{ height: 1, background: C.border, marginBottom: 11 }} />
          {donations.map((don, i) => (
            <div key={don.id} onClick={() => setIdx(i)} style={{
              padding: "9px 11px", borderRadius: 8, marginBottom: 7, cursor: "pointer",
              background: idx === i ? C.red50 : C.white,
              border: `1.5px solid ${idx === i ? C.red700 : C.border}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: idx === i ? 600 : 400, color: idx === i ? C.red700 : C.navy }}>{don.donationDate}</div>
                <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>{don.location}</div>
              </div>
              {idx === i && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.red700 }} />}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
