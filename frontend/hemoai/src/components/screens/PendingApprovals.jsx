// src/components/screens/PendingApprovals.jsx
import { useState, useMemo } from "react";
import { C } from "../../tokens";
import { Card, SectionTitle, StatusPill } from "../shared/UI";
import Pagination from "../shared/Pagination";
import {
  users, districts, facilities,
  getPendingApprovals, approveUser, rejectUser,
} from "../../data/orgStore";

const PAGE_SIZE = 5;

// currentUser would normally come from auth/session context — hardcoded here
// to match the rest of the mock-role pattern in roles.js
function useCurrentApprover() {
  return users.find(u => u.role === "DHO") || users.find(u => u.role === "SuperAdmin");
}

function districtName(id) {
  return districts.find(d => d.id === id)?.name || "—";
}

function facilityFor(user) {
  return facilities.find(f => f.id === user.facilityId);
}

export default function PendingApprovals() {
  const approver = useCurrentApprover();
  const [page, setPage] = useState(1);
  const [rejecting, setRejecting] = useState(null); // userId currently being rejected
  const [reason, setReason] = useState("");
  const [, forceRefresh] = useState(0); // mock store mutates in place — bump this to re-render

  const pending = useMemo(
    () => getPendingApprovals(approver.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [approver.id, forceRefresh]
  );

  const totalPages = Math.max(1, Math.ceil(pending.length / PAGE_SIZE));
  const pageItems = pending.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleApprove(userId) {
    approveUser(userId);
    forceRefresh(n => n + 1);
    // clamp page if this was the last item on the current page
    setPage(p => Math.min(p, Math.max(1, Math.ceil((pending.length - 1) / PAGE_SIZE))));
  }

  function openReject(userId) {
    setRejecting(userId);
    setReason("");
  }

  function confirmReject() {
    rejectUser(rejecting, reason.trim() || "Not specified");
    setRejecting(null);
    forceRefresh(n => n + 1);
    setPage(p => Math.min(p, Math.max(1, Math.ceil((pending.length - 1) / PAGE_SIZE))));
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <Card style={{ padding: 24 }}>
        <SectionTitle sub={`Reviewing as ${approver.name} (${approver.role})`}>
          Pending Approvals
        </SectionTitle>

        {pending.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: C.gray, fontSize: 12.5 }}>
            No pending registrations right now.
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pageItems.map(u => {
                const fac = facilityFor(u);
                return (
                  <div key={u.id} style={{
                    border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px",
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{u.name}</span>
                        <StatusPill value="Pending" />
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: C.blue, background: C.blue50, borderRadius: 5, padding: "2px 8px" }}>
                          {u.role}
                        </span>
                      </div>
                      <div style={{ fontSize: 11.5, color: C.gray, lineHeight: 1.6 }}>
                        {u.email} · {districtName(u.district)}
                        {fac && <> · {fac.name} <span style={{ color: C.slate }}>(License: {fac.licenseNo})</span></>}
                        {!fac && u.licenseNo && <> · Employee ID: {u.licenseNo}</>}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => handleApprove(u.id)}
                        style={{ height: 32, padding: "0 14px", background: C.green, color: C.white, border: "none", borderRadius: 7, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openReject(u.id)}
                        style={{ height: 32, padding: "0 14px", background: C.white, color: C.red700, border: `1px solid ${C.red700}`, borderRadius: 7, fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination
              page={page}
              totalItems={pending.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      {rejecting && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(17,21,39,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
        }}>
          <Card style={{ width: 380, padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 10 }}>Reject registration</div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.slate, marginBottom: 5 }}>Reason (shown to applicant)</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. License number could not be verified"
              style={{ width: "100%", borderRadius: 7, border: `1px solid ${C.border}`, padding: 10, fontSize: 12, color: C.navy, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={() => setRejecting(null)}
                style={{ flex: 1, height: 38, background: C.fog, color: C.navy, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                style={{ flex: 1, height: 38, background: C.red700, color: C.white, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >
                Confirm reject
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}