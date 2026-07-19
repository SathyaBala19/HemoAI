// src/components/screens/StaffManagement.jsx
import { useState } from "react";
import { C } from "../../tokens";
import { Card, Field } from "../shared/UI";
import { users, addHospitalStaff, getStaffForHospitalAdmin } from "../../data/orgStore";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// currentUser would come from auth/session context — hardcoded to match
// the existing mock-role pattern used throughout the app.
function useCurrentHospitalAdmin() {
  return users.find(u => u.role === "Hospital Admin");
}

export default function StaffManagement() {
  const admin = useCurrentHospitalAdmin();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [justAdded, setJustAdded] = useState(null);
  const [, forceRefresh] = useState(0);

  const staff = getStaffForHospitalAdmin(admin.id);

  function submit() {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!EMAIL_RE.test(email)) errs.email = "Enter a valid email address";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newUser = addHospitalStaff({ name, email, hospitalAdminId: admin.id });
    setJustAdded(newUser.name);
    setName("");
    setEmail("");
    forceRefresh(n => n + 1);
    setTimeout(() => setJustAdded(null), 4000);
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
          Add Blood Bank Officer
        </div>
        <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5, marginBottom: 18 }}>
          Give one of your hospital's own staff access to run your blood bank. They get access right away — no separate approval needed since they're part of your hospital.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field
            label="Staff member's full name"
            value={name}
            onChange={e => { setName(e.target.value); if (errors.name) setErrors(er => ({ ...er, name: undefined })); }}
            error={errors.name}
            required
          />
          <Field
            label="Staff member's email"
            value={email}
            onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(er => ({ ...er, email: undefined })); }}
            error={errors.email}
            required
          />

          <button
            onClick={submit}
            style={{ marginTop: 4, height: 40, background: C.red700, color: C.white, border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
          >
            Give access
          </button>

          {justAdded && (
            <div style={{ fontSize: 11.5, color: C.green, background: C.green50, borderRadius: 7, padding: "8px 12px" }}>
              {justAdded} now has Blood Bank Officer access.
            </div>
          )}
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginBottom: 12 }}>
          Your blood bank staff ({staff.length})
        </div>
        {staff.length === 0 ? (
          <div style={{ fontSize: 12, color: C.gray, padding: "16px 0", textAlign: "center" }}>
            No staff added yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {staff.map(s => (
              <div
                key={s.id}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 8 }}
              >
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: C.gray }}>{s.email}</div>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: C.green, background: C.green50, borderRadius: 5, padding: "3px 9px" }}>
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}