// src/components/screens/DHOReg.jsx
import { useState } from "react";
import { C } from "../../tokens";
import { Card, Field, SectionTitle } from "../shared/UI";
import { districts, users, submitRegistration } from "../../data/orgStore";

const EMPTY_FORM = {
  officerName: "", email: "", phone: "",
  district: "", govtIdNo: "", designation: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/;

function validate(form) {
  const errs = {};
  if (!form.officerName.trim()) errs.officerName = "Name is required";

  if (!form.email.trim()) errs.email = "Email is required";
  else if (!EMAIL_RE.test(form.email)) errs.email = "Enter a valid government email address";
  else if (!form.email.trim().endsWith(".gov.in")) errs.email = "Must be a .gov.in email address";

  if (!form.phone.trim()) errs.phone = "Phone number is required";
  else if (!PHONE_RE.test(form.phone.replace(/\s/g, ""))) errs.phone = "Enter a valid 10-digit Indian mobile number";

  if (!form.district) errs.district = "District is required";

  if (!form.govtIdNo.trim()) errs.govtIdNo = "Government employee ID is required";
  else if (form.govtIdNo.trim().length < 4) errs.govtIdNo = "Enter a valid employee ID";

  if (!form.designation.trim()) errs.designation = "Designation is required";

  return errs;
}

// Only one active DHO per district — a district shouldn't have two people
// both claiming district-wide authority at once.
function districtAlreadyHasDHO(districtId) {
  return users.some(u => u.role === "DHO" && u.district === districtId && u.status === "approved");
}

export default function DHOReg() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  function update(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  }

  function submit() {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (districtAlreadyHasDHO(form.district)) {
      setErrors({ district: "This district already has an active DHO. Contact the State Health Dept to request a transfer." });
      return;
    }

    const superAdmin = users.find(u => u.role === "SuperAdmin");

    const newUser = submitRegistration({
      name: form.officerName,
      email: form.email,
      role: "DHO",
      district: form.district,
      facilityName: null,
      facilityType: null, // DHOs aren't tied to a single facility
      licenseNo: form.govtIdNo,
      reportsTo: superAdmin.id,
    });

    setSubmitted(newUser);
  }

  if (submitted) {
    return (
      <Card accent={C.amber} style={{ maxWidth: 520, margin: "40px auto", padding: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.amber50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 20, color: C.amber }}>⏳</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Registration submitted</div>
        <div style={{ fontSize: 12.5, color: C.gray, lineHeight: 1.6 }}>
          Your DHO account request for <strong style={{ color: C.navy }}>{districts.find(d => d.id === form.district)?.name}</strong> district is now <strong style={{ color: C.amber }}>pending approval</strong> from the State Health Department. Since this role has district-wide oversight, verification includes confirming your government employee ID before activation.
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 560, margin: "0 auto", padding: 28 }}>
      <SectionTitle sub="Highest-trust role — request is reviewed directly by the State Health Dept">
        Register as District Health Officer
      </SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Full name" name="officerName" value={form.officerName} onChange={update} error={errors.officerName} required />
        <Field label="Government email" name="email" value={form.email} onChange={update} error={errors.email} required placeholder="name@tn.gov.in" />
        <Field label="Phone number" name="phone" value={form.phone} onChange={update} error={errors.phone} required placeholder="9876543210" />
        <Field label="Designation" name="designation" value={form.designation} onChange={update} error={errors.designation} required placeholder="e.g. District Health Officer" />
        <Field label="Government employee ID" name="govtIdNo" value={form.govtIdNo} onChange={update} error={errors.govtIdNo} required />

        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.slate, marginBottom: 4 }}>
            District <span style={{ color: C.red700 }}>*</span>
          </label>
          <select
            name="district" value={form.district} onChange={update}
            style={{ width: "100%", height: 38, borderRadius: 7, border: `1px solid ${errors.district ? C.red700 : C.border}`, background: C.white, padding: "0 12px", fontSize: 12.5, color: C.navy, outline: "none" }}
          >
            <option value="">Select district</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          {errors.district && <div style={{ fontSize: 10, color: C.red700, marginTop: 3 }}>{errors.district}</div>}
        </div>

        <button
          onClick={submit}
          style={{ marginTop: 6, width: "100%", height: 42, background: C.red700, color: C.white, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
        >
          Submit for approval
        </button>
      </div>
    </Card>
  );
}