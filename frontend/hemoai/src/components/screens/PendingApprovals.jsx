// src/components/screens/PendingApprovals.jsx
//
// Real data from auth-service: GET /api/users/pending lists staff
// accounts (HOSPITAL_ADMIN, BLOOD_BANK_OFFICER, DHO) still waiting on a
// decision, and Approve/Reject call POST /api/users/:id/approve or
// /reject. All three endpoints are DHO-only on the backend - see
// AccountApprovalController.
import { useEffect, useState } from "react";
import { C } from "../../tokens";
import { Card, SectionTitle, StatusPill } from "../shared/UI";
import Pagination from "../shared/Pagination";
import { listPendingApprovals, approveAccount, rejectAccount, getToken, getStoredUser } from "../../api";

const PAGE_SIZE = 5;

export default function PendingApprovals() {
  const token = getToken();
  const approver = getStoredUser();

  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [rejecting, setRejecting] = useState(null); // account id currently being rejected
  const [reason, setReason] = useState("");

  function load() {
    if (!token) {
      setError("You're not signed in. Please log in again.");
      setLoading(false);
      return;
    }
    listPendingApprovals(token)
      .then(data => setPending(data))
      .catch(err => setError(err.message || "Could not load pending approvals"))
      .finally(() => setLoading(false));
  }

  useEffect(load, [token]);

  const pageItems = pending.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleApprove(id) {
    try {
      await approveAccount(token, id);
      setPending(list => list.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message || "Could not approve that account");
    }
  }

  function openReject(id) {
    setRejecting(id);
    setReason("");
  }

  async function confirmReject() {
    try {
      await rejectAccount(token, rejecting, reason.trim() || "Not specified");
      setPending(list => list.filter(u => u.id !== rejecting));
      setRejecting(null);
    } catch (err) {
      setError(err.message || "Could not reject that account");
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <Card style={{ padding: 24 }}>
        <SectionTitle sub={approver ? `Reviewing as ${approver.name} (${approver.role})` : ""}>
          Pending Approvals
        </SectionTitle>

        {error && (
          <div style={{ fontSize: 11.5, color: C.red700, background: C.red50, borderRadius: 7, padding: "8px 12px", marginBottom: 12 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: C.gray, fontSize: 12.5 }}>Loading…</div>
        ) : pending.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: C.gray, fontSize: 12.5 }}>
            No pending registrations right now.
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pageItems.map(u => (
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
                      {u.email}
                      {u.city && <> · {u.city}{u.state ? `, ${u.state}` : ""}</>}
                      {u.createdAt && <> · Registered {new Date(u.createdAt).toLocaleDateString()}</>}
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
              ))}
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
