import { useState } from "react";
import { C } from "../../tokens";
import { Card, Field } from "../shared/UI";

const bloodGroups = ["A+", "A−", "B+", "B−", "O+", "O−", "AB+", "AB−"];
const genders = ["Male", "Female", "Prefer not to say"];

const criteria = [
  [true,  "Age between 18 and 65"],
  [true,  "Weight over 50 kg"],
  [true,  "Haemoglobin ≥ 12.5 g/dL"],
  [true,  "No blood donation in last 3 months"],
  [false, "No chronic illness or ongoing medication"],
  [false, "No surgery in the past 6 months"],
  [false, "Not pregnant or breastfeeding"],
];

const steps = [
  ["1", "We verify your profile within 24 hours",    C.blue],
  ["2", "You're added to the donor matching pool",   C.green],
  ["3", "You'll get SMS alerts for urgent needs",    C.amber],
  ["4", "Track every donation and its impact",       C.red700],
];

const EMPTY_FORM = {
  fullName: "", city: "", email: "", state: "",
  phone: "", pin: "", dob: "", aadhaar: "",
};

const SAMPLE_DATA = {
  fullName: "Biryani Kumar",
  city: "Coimbatore",
  email: "biryani.kumar@email.com",
  state: "Tamil Nadu",
  phone: "9876543210",
  pin: "641004",
  dob: "1998-04-12",
  aadhaar: "7788",
};

const HEALTH_LABELS = [
  "I haven't donated blood in the last 3 months",
  "I'm over 18 and weigh at least 50 kg",
  "I don't have a chronic illness or recent surgery",
  "I consent to my data being used for donor matching",
];

function validate(form, checks) {
  const errs = {};
  if (!form.fullName.trim()) errs.fullName = "Full name is required";
  if (!form.city.trim()) errs.city = "City is required";

  if (!form.email.trim()) errs.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";

  if (!form.state.trim()) errs.state = "State is required";

  if (!form.phone.trim()) errs.phone = "Phone number is required";
  else if (!/^(\+91[\s-]?)?[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) errs.phone = "Enter a valid 10-digit Indian mobile number";

  if (!form.pin.trim()) errs.pin = "PIN code is required";
  else if (!/^\d{6}$/.test(form.pin.trim())) errs.pin = "PIN code must be 6 digits";

  if (!form.dob.trim()) errs.dob = "Date of birth is required";
  else {
    const dob = new Date(form.dob);
    if (Number.isNaN(dob.getTime())) {
      errs.dob = "Enter a valid date";
    } else {
      const age = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) errs.dob = "You must be at least 18 years old";
      if (age > 65) errs.dob = "Donors must be 65 or under";
    }
  }

  if (!form.aadhaar.trim()) errs.aadhaar = "Required for verification";
  else if (!/^\d{4}$/.test(form.aadhaar.trim())) errs.aadhaar = "Enter exactly 4 digits";

  if (!checks[0] || !checks[1] || !checks[2]) errs.health = "All eligibility declarations must be checked";
  if (!checks[3]) errs.consent = "You must consent to data use to register";

  return errs;
}

export default function DonorReg() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [bg, setBg] = useState("O+");
  const [gender, setGender] = useState("Male");
  const [checks, setChecks] = useState([false, false, false, false]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function update(field) {
    return (e) => {
      const v = e.target.value;
      setForm(f => ({ ...f, [field]: v }));
      setErrors(errs => (errs[field] ? { ...errs, [field]: undefined } : errs));
    };
  }

  function fillSample() {
    setForm(SAMPLE_DATA);
    setChecks([true, true, true, true]);
    setErrors({});
  }

  function handleSubmit() {
    const errs = validate(form, checks);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  }

  function startOver() {
    setForm(EMPTY_FORM);
    setBg("O+");
    setGender("Male");
    setChecks([false, false, false, false]);
    setErrors({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <Card style={{ maxWidth: 480, margin: "40px auto", padding: "36px 32px", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.green50, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24, color: C.green }}>✓</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Registration submitted</div>
        <div style={{ fontSize: 12.5, color: C.gray, lineHeight: 1.6, marginBottom: 22 }}>
          Thanks, {form.fullName.split(" ")[0] || "there"} — we've received your details for blood group {bg}.
          You'll be verified within 24 hours and added to the donor matching pool.
        </div>
        <button onClick={startOver} style={{ height: 40, padding: "0 20px", background: C.red700, color: C.white, border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Register another donor
        </button>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ height: 3, background: C.red700 }} />
          <div style={{ padding: "22px 26px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 3, letterSpacing: "-0.2px" }}>Register as a donor</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontSize: 11.5, color: C.gray }}>Takes about 2 minutes. Your information is kept private.</div>
              <button type="button" onClick={fillSample} style={{ fontSize: 10.5, color: C.blue, background: "transparent", border: "none", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 }}>
                🍛 Fill sample data
              </button>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Personal info</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px", marginBottom: 20 }}>
              <Field label="Full name"        placeholder="Sathya Bala"      required name="fullName" value={form.fullName} onChange={update("fullName")} error={errors.fullName} />
              <Field label="City"             placeholder="Coimbatore"       required name="city"     value={form.city}     onChange={update("city")}     error={errors.city} />
              <Field label="Email"            placeholder="sathya@email.com" required type="email" name="email" value={form.email} onChange={update("email")} error={errors.email} />
              <Field label="State"            placeholder="Tamil Nadu"       required name="state"    value={form.state}    onChange={update("state")}    error={errors.state} />
              <Field label="Phone"            placeholder="+91 98765 43210" required type="tel"   name="phone"   value={form.phone}   onChange={update("phone")}   error={errors.phone} />
              <Field label="PIN code"         placeholder="641004"          required name="pin"     value={form.pin}     onChange={update("pin")}     error={errors.pin} />
              <Field label="Date of birth"    placeholder="YYYY-MM-DD"      required type="date"  name="dob"     value={form.dob}     onChange={update("dob")}     error={errors.dob} />
              <Field label="Aadhaar (last 4)" placeholder="4521" hint="We only store the last 4 digits" required name="aadhaar" value={form.aadhaar} onChange={update("aadhaar")} error={errors.aadhaar} />
            </div>

            <div style={{ height: 1, background: C.border, marginBottom: 18 }} />

            <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 11 }}>Blood group</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
              {bloodGroups.map(g => (
                <button key={g} type="button" onClick={() => setBg(g)} style={{ minWidth: 52, height: 34, borderRadius: 7, cursor: "pointer", background: bg === g ? C.red700 : C.white, border: `1.5px solid ${bg === g ? C.red700 : C.border}`, color: bg === g ? C.white : C.slate, fontSize: 12, fontWeight: bg === g ? 700 : 400 }}>{g}</button>
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 11 }}>Gender</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {genders.map(g => (
                <button key={g} type="button" onClick={() => setGender(g)} style={{ padding: "7px 16px", borderRadius: 7, cursor: "pointer", background: gender === g ? C.red50 : C.white, border: `1.5px solid ${gender === g ? C.red700 : C.border}`, fontSize: 12, color: gender === g ? C.navy : C.slate, fontWeight: gender === g ? 600 : 400, display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${gender === g ? C.red700 : C.silver}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {gender === g && <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.red700 }} />}
                  </div>
                  {g}
                </button>
              ))}
            </div>

            <div style={{ height: 1, background: C.border, marginBottom: 18 }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
              Health declaration<span style={{ color: C.red700 }}> *</span>
            </div>
            {HEALTH_LABELS.map((lbl, i) => (
              <div key={i} onClick={() => setChecks(c => c.map((v, j) => (j === i ? !v : v)))} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 11, cursor: "pointer" }}>
                <div style={{ width: 17, height: 17, borderRadius: 4, flexShrink: 0, marginTop: 1, background: checks[i] ? C.red700 : C.white, border: `1.5px solid ${checks[i] ? C.red700 : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.white }}>{checks[i] ? "✓" : ""}</div>
                <span style={{ fontSize: 12, color: checks[i] ? C.navy : C.gray, lineHeight: 1.4 }}>{lbl}</span>
              </div>
            ))}
            {(errors.health || errors.consent) && (
              <div style={{ fontSize: 10.5, color: C.red700, marginTop: -2, marginBottom: 10 }}>
                {errors.health || errors.consent}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              style={{ width: "100%", height: 42, background: C.red700, color: C.white, border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 16, letterSpacing: "-0.1px" }}
              onMouseEnter={e => e.currentTarget.style.background = "#A80015"}
              onMouseLeave={e => e.currentTarget.style.background = C.red700}
            >Register →</button>
          </div>
        </Card>
      </div>

      <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Eligibility checklist</div>
          {criteria.map(([ok, text], i) => (
            <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 9 }}>
              <span style={{ fontSize: 11, color: ok ? C.green : C.red700, flexShrink: 0, marginTop: 0.5 }}>{ok ? "✓" : "✗"}</span>
              <span style={{ fontSize: 11.5, color: C.slate, lineHeight: 1.4 }}>{text}</span>
            </div>
          ))}
        </Card>

        <Card style={{ padding: "16px 18px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>What happens next</div>
          {steps.map(([num, text, col], i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${col}18`, border: `1.5px solid ${col}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: col, flexShrink: 0, marginTop: 1 }}>{num}</div>
              <span style={{ fontSize: 11.5, color: C.slate, lineHeight: 1.4 }}>{text}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}