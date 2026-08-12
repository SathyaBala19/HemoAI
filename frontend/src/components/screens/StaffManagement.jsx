// src/components/screens/StaffManagement.jsx
//
// This screen manages REAL employee records through employee-service
// (port 8082) - list/add/edit/delete all go over the network with the JWT
// token saved at login (see src/api.js). employee-service must be
// running for this screen to work.
//
// Who can do what here is enforced on the BACKEND, not just hidden in
// this UI (see backend/employee-service/.../SecurityConfig.java):
//   - HOSPITAL_ADMIN, BLOOD_BANK_OFFICER, DHO can all view the list
//   - HOSPITAL_ADMIN and DHO can add and edit employees
//   - only DHO can delete one
import { useEffect, useState } from "react";
import { C } from "../../tokens";
import { Card, Field } from "../shared/UI";
import { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, getToken, getStoredUser } from "../../api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = { name: "", email: "", department: "", salary: "", joinDate: "" };

function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = "Name is required";
  if (!form.email.trim()) errs.email = "Email is required";
  else if (!EMAIL_RE.test(form.email)) errs.email = "Enter a valid email address";
  if (!form.department.trim()) errs.department = "Department is required";
  if (!form.salary.trim() || Number(form.salary) <= 0) errs.salary = "Enter a salary greater than zero";
  if (!form.joinDate.trim()) errs.joinDate = "Join date is required";
  return errs;
}

function toFormShape(employee) {
  return {
    name: employee.name,
    email: employee.email,
    department: employee.department,
    salary: String(employee.salary),
    joinDate: employee.joinDate,
  };
}

export default function StaffManagement() {
  const token = getToken();
  const currentUser = getStoredUser(); // { userId, email, role } from the last login
  const canEdit = currentUser?.role === "HOSPITAL_ADMIN" || currentUser?.role === "DHO";
  const canDelete = currentUser?.role === "DHO";

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [justAdded, setJustAdded] = useState(null);

  // editingId is null when adding a new employee, or an employee's id
  // when the form below is being used to edit that employee instead.
  const [editingId, setEditingId] = useState(null);

  // Load the employee list once when this screen first opens.
  useEffect(() => {
    if (!token) {
      setLoadError("You're not signed in. Please log in again.");
      setLoading(false);
      return;
    }
    listEmployees(token)
      .then(data => setEmployees(data))
      .catch(err => setLoadError(err.message || "Could not load employees"))
      .finally(() => setLoading(false));
  }, [token]);

  function update(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  }

  // Starts editing an employee - fetches that one record fresh from the
  // server (GET /api/employees/:id) instead of just reusing whatever's
  // already sitting in the list, so the edit form always starts from the
  // latest data.
  async function startEdit(id) {
    try {
      const employee = await getEmployee(token, id);
      setForm(toFormShape(employee));
      setErrors({});
      setEditingId(id);
    } catch (err) {
      setLoadError(err.message || "Could not load employee");
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }

  async function submit() {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      name: form.name,
      email: form.email,
      department: form.department,
      salary: Number(form.salary),
      joinDate: form.joinDate,
    };

    setSubmitting(true);
    try {
      if (editingId) {
        const updated = await updateEmployee(token, editingId, payload);
        setEmployees(list => list.map(e => (e.id === editingId ? updated : e)));
        setJustAdded(`${updated.name} was updated`);
        cancelEdit();
      } else {
        const created = await createEmployee(token, payload);
        setEmployees(list => [...list, created]);
        setJustAdded(`${created.name} was added`);
        setForm(EMPTY_FORM);
      }
      setTimeout(() => setJustAdded(null), 4000);
    } catch (err) {
      setErrors({ email: err.message || "Could not save employee" });
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id) {
    try {
      await deleteEmployee(token, id);
      setEmployees(list => list.filter(e => e.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setLoadError(err.message || "Could not delete employee");
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
          {editingId ? "Edit Staff Member" : "Add Staff Member"}
        </div>
        <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5, marginBottom: 18 }}>
          {editingId
            ? "Updates a real employee record via employee-service."
            : "Adds a real employee record via employee-service. Requires HOSPITAL_ADMIN or DHO access."}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Full name" name="name" value={form.name} onChange={update} error={errors.name} required />
          <Field label="Email" name="email" value={form.email} onChange={update} error={errors.email} required />
          <Field label="Department" name="department" value={form.department} onChange={update} error={errors.department} required placeholder="Blood Bank" />
          <Field label="Salary" name="salary" type="number" value={form.salary} onChange={update} error={errors.salary} required placeholder="45000" />
          <Field label="Join date" name="joinDate" type="date" value={form.joinDate} onChange={update} error={errors.joinDate} required />

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={submit}
              disabled={submitting}
              style={{ flex: 1, marginTop: 4, height: 40, background: C.red700, color: C.white, border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? "Saving…" : editingId ? "Save changes" : "Add employee"}
            </button>
            {editingId && (
              <button
                onClick={cancelEdit}
                style={{ marginTop: 4, height: 40, padding: "0 16px", background: C.fog, color: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
            )}
          </div>

          {justAdded && (
            <div style={{ fontSize: 11.5, color: C.green, background: C.green50, borderRadius: 7, padding: "8px 12px" }}>
              {justAdded}.
            </div>
          )}
        </div>
      </Card>

      <Card style={{ padding: 24 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginBottom: canDelete ? 12 : 2 }}>
          Employees ({employees.length})
        </div>
        {!canDelete && (
          <div style={{ fontSize: 10.5, color: C.gray, marginBottom: 10 }}>
            Only a DHO can remove staff records - you can still add and edit.
          </div>
        )}

        {loading && <div style={{ fontSize: 12, color: C.gray, padding: "16px 0", textAlign: "center" }}>Loading…</div>}

        {loadError && (
          <div style={{ fontSize: 11.5, color: C.red700, background: C.red50, borderRadius: 7, padding: "8px 12px", marginBottom: 12 }}>
            {loadError}
          </div>
        )}

        {!loading && !loadError && employees.length === 0 && (
          <div style={{ fontSize: 12, color: C.gray, padding: "16px 0", textAlign: "center" }}>
            No employees yet.
          </div>
        )}

        {!loading && employees.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {employees.map(e => (
              <div
                key={e.id}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: `1px solid ${editingId === e.id ? C.red700 : C.border}`, borderRadius: 8 }}
              >
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: C.gray }}>{e.email} · {e.department}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {canEdit && (
                    <button
                      onClick={() => startEdit(e.id)}
                      style={{ fontSize: 10.5, fontWeight: 600, color: C.blue, background: C.blue50, border: "none", borderRadius: 5, padding: "5px 10px", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => canDelete && remove(e.id)}
                    disabled={!canDelete}
                    title={canDelete ? undefined : "Only a DHO can remove staff records"}
                    style={{
                      fontSize: 10.5, fontWeight: 600, border: "none", borderRadius: 5, padding: "5px 10px",
                      color: canDelete ? C.red700 : C.gray,
                      background: canDelete ? C.red50 : C.fog,
                      cursor: canDelete ? "pointer" : "not-allowed",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
