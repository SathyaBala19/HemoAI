// src/components/screens/BloodBankReg.jsx
//
// districts/getDHOsForDistrict still come from the frontend-only mock
// store (orgStore.js) - no backend concept of districts/routing yet.
// submit() below creates a REAL account via auth-service (role
// BLOOD_BANK_OFFICER), usable to sign in right afterwards.
import { useState } from "react";
import { C } from "../../tokens";
import { Card, Field } from "../shared/UI";
import { districts, getDHOsForDistrict } from "../../data/orgStore";
import { registerUser } from "../../api";

const EMPTY_FORM = {
  officerName: "", email: "", phone: "",
  bloodBankName: "", licenseNo: "", district: "", address: "",
  password: "", confirmPassword: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/;

function validate(form) {
  const errs = {};
  if (!form.officerName.trim()) errs.officerName = "Officer name is required";

  if (!form.email.trim()) errs.email = "Email is required";
  else if (!EMAIL_RE.test(form.email)) errs.email = "Enter a valid email address";

  if (!form.phone.trim()) errs.phone = "Phone number is required";
  else if (!PHONE_RE.test(form.phone.replace(/\s/g, ""))) errs.phone = "Enter a valid 10-digit Indian mobile number";

  if (!form.bloodBankName.trim()) errs.bloodBankName = "Blood bank name is required";

  if (!form.licenseNo.trim()) errs.licenseNo = "License number is required";
  else if (form.licenseNo.trim().length < 5) errs.licenseNo = "Enter a valid license number";

  if (!form.district) errs.district = "District is required";
  if (!form.address.trim()) errs.address = "Blood bank address is required";

  if (!form.password.trim()) errs.password = "Password is required";
  else if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
  if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match";

  return errs;
}

export default function BloodBankReg() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  }

  async function submit() {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const dhos = getDHOsForDistrict(form.district);
    if (dhos.length === 0) {
      setErrors({ district: "No active DHO found for this district yet — contact the health department directly" });
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({
        name: form.officerName,
        email: form.email,
        password: form.password,
        role: "BLOOD_BANK_OFFICER",
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ email: err.message || "Registration failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Card accent={C.amber} style={{ maxWidth: 520, margin: "40px auto", padding: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.amber50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 20, color: C.amber }}>⏳</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Registration submitted</div>
        <div style={{ fontSize: 12.5, color: C.gray, lineHeight: 1.6 }}>
          Your blood bank officer account for <strong style={{ color: C.navy }}>{form.bloodBankName}</strong> is now <strong style={{ color: C.amber }}>pending approval</strong> from a District Health Officer.
          You'll be able to sign in with {form.email} once it's approved.
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 560, margin: "0 auto", padding: 28 }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
          Register Your Blood Bank
        </div>
        <div style={{ fontSize: 12, color: C.gray, lineHeight: 1.5 }}>
          We'll verify your license and get you access within 1–2 business days.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Officer full name" name="officerName" value={form.officerName} onChange={update} error={errors.officerName} required />
        <Field label="Work email" name="email" value={form.email} onChange={update} error={errors.email} required />
        <Field label="Phone number" name="phone" value={form.phone} onChange={update} error={errors.phone} required placeholder="9876543210" />
        <Field label="Blood bank name" name="bloodBankName" value={form.bloodBankName} onChange={update} error={errors.bloodBankName} required />
        <Field label="Blood bank license number" name="licenseNo" value={form.licenseNo} onChange={update} error={errors.licenseNo} required hint="As issued under the Drugs & Cosmetics Act" />

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

        <Field label="Blood bank address" name="address" value={form.address} onChange={update} error={errors.address} required />
        <Field label="Password" name="password" type="password" value={form.password} onChange={update} error={errors.password} required placeholder="At least 8 characters" />
        <Field label="Confirm password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={update} error={errors.confirmPassword} required placeholder="Re-type your password" />

        <button
          onClick={submit}
          disabled={submitting}
          style={{ marginTop: 6, width: "100%", height: 42, background: C.red700, color: C.white, border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </div>
    </Card>
  );
}