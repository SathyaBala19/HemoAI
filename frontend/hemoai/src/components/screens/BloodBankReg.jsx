// src/components/screens/BloodBankReg.jsx
import { useState } from "react";
import { C } from "../../tokens";
import { Card, Field } from "../shared/UI";
import { districts, getDHOsForDistrict, submitRegistration } from "../../data/orgStore";

const EMPTY_FORM = {
  officerName: "", email: "", phone: "",
  bloodBankName: "", licenseNo: "", district: "", address: "",
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

  return errs;
}

export default function BloodBankReg() {
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

    const dhos = getDHOsForDistrict(form.district);
    if (dhos.length === 0) {
      setErrors({ district: "No active DHO found for this district yet — contact the health department directly" });
      return;
    }

    const newUser = submitRegistration({
      name: form.officerName,
      email: form.email,
      role: "Blood Bank Officer",
      district: form.district,
      facilityName: form.bloodBankName,
      facilityType: "bloodbank",
      licenseNo: form.licenseNo,
      reportsTo: dhos[0].id,
    });

    setSubmitted(newUser);
  }

  if (submitted) {
    return (
      <Card accent={C.amber} style={{ maxWidth: 520, margin: "40px auto", padding: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.amber50, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 20, color: C.amber }}>⏳</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Registration submitted</div>
        <div style={{ fontSize: 12.5, color: C.gray, lineHeight: 1.6 }}>
          Your blood bank officer account for <strong style={{ color: C.navy }}>{form.bloodBankName}</strong> is now <strong style={{ color: C.amber }}>pending approval</strong> from your District Health Officer. You'll get an email once it's reviewed — this usually takes 1–2 business days while your license number is verified.
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