# HemoAI — 30-Minute Project Demo Video Script

Format: screen recording + voiceover. Each segment lists timing, what to show on screen, and talking points/narration you can read almost verbatim or paraphrase.

Total target: ~30:00. Pad/trim the demo segments (4–8) since they're the most flexible.

---

## 0. Pre-recording checklist

- [ ] Run `start.bat` beforehand and confirm all 6 services + frontend are up (http://localhost:5173)
- [ ] Have at least: 1 blood bank, 1 DHO, 1 hospital, a few donors, and some donation history seeded in the DB — empty screens demo poorly
- [ ] Ollama running with a model pulled, if you're showing the Chatbot
- [ ] Close unrelated tabs/notifications; set browser zoom to 100%
- [ ] Have a code editor window ready (VS Code/Eclipse) for the architecture segment
- [ ] Mic check — record 10s of silence + a test sentence, check levels

---

## 1. Intro (0:00 – 2:00)

**Show:** Title slide or the Landing page (http://localhost:5173)

**Narration:**
"Hi, I'm [name], and this is HemoAI — a full-stack blood bank management platform I built to connect blood banks, hospitals, and donors, with an AI layer for demand forecasting and a chatbot for quick queries.

In this video I'll walk through the problem it solves, the architecture, and then do a live demo of the core features — donor registration, inventory tracking, donation history, the map of nearby blood banks, ML-based donation forecasting, and the chatbot."

---

## 2. The problem (2:00 – 4:00)

**Show:** Landing page scroll, or a simple slide with bullet points

**Narration:**
"Blood banks need to track inventory across multiple blood groups, coordinate with hospitals requesting units, manage donor records, and predict shortages before they happen. Most of this is still spreadsheet-driven. HemoAI centralizes it: donors register once, blood banks manage stock and staff, hospitals request units, district health officers (DHOs) approve and oversee banks in their region, and an ML service forecasts donation trends per blood group."

---

## 3. Architecture overview (4:00 – 9:00)

**Show:** Open [README.md](../README.md) and/or a diagram; optionally show the folder structure in the editor

**Narration — walk through the architecture table:**
"HemoAI is a React frontend talking to five independent Spring Boot microservices, plus a Python ML service:

- **Auth service (8081)** — login, roles, JWT
- **Employee service (8082)** — staff management for blood banks
- **Inventory service (8083)** — blood unit stock per blood group per bank
- **Donation service (8084)** — donation records, donor history
- **Chatbot service (8085)** — talks to a local Ollama LLM for natural-language queries
- **ML service (8086)** — Flask + scikit-learn, trains a linear regression model per blood group on real donation history to forecast next week's donations, and logs each forecast to MongoDB

All the Java services share one MySQL database; the ML service reads from it and writes forecast logs to MongoDB. The frontend is Vite + React 18, with Leaflet for the donor/blood-bank map and jsPDF + html2canvas for exporting certificates and reports."

**Optional:** show `backend/` folder structure, one service's `pom.xml`, and `ml-service/app.py` briefly to prove it's real code, not just claims.

---

## 4. Roles & registration flow (9:00 – 13:00)

**Show:** Registration screens — [DonorReg.jsx](../frontend/src/components/screens/DonorReg.jsx), [BloodBankReg.jsx](../frontend/src/components/screens/BloodBankReg.jsx), [HospitalReg.jsx](../frontend/src/components/screens/HospitalReg.jsx), [DHOReg.jsx](../frontend/src/components/screens/DHOReg.jsx)

**Narration:**
"HemoAI has four main actor types: donors, blood banks, hospitals, and district health officers. Let me register one of each so you can see the onboarding flow."

- Register a donor → point out blood group, location fields (used later for the map)
- Register a blood bank → note it likely needs DHO/admin approval
- Show [PendingApprovals.jsx](../frontend/src/components/screens/PendingApprovals.jsx) — "New registrations land here for approval before they go live — this keeps the network verified."
- Log in as each role briefly to show how the dashboard/sidebar changes per role

---

## 5. Dashboard & inventory (13:00 – 17:00)

**Show:** [Dashboard.jsx](../frontend/src/components/screens/Dashboard.jsx), [Inventory.jsx](../frontend/src/components/screens/Inventory.jsx), [BloodBank.jsx](../frontend/src/components/screens/BloodBank.jsx)

**Narration:**
"Once logged in as a blood bank, the dashboard gives an at-a-glance view of current stock levels by blood group, recent activity, and alerts.

The Inventory screen is where staff update unit counts as blood comes in or goes out — [demonstrate adding/adjusting stock].

[Alerts.jsx](../frontend/src/components/screens/Alerts.jsx) surfaces low-stock warnings automatically, so banks know when a blood group is running low before it becomes a crisis."

---

## 6. Donor map & donation history (17:00 – 21:00)

**Show:** [DonorMap.jsx](../frontend/src/components/screens/DonorMap.jsx), [DonationHistory.jsx](../frontend/src/components/screens/DonationHistory.jsx), [DonorProfile.jsx](../frontend/src/components/screens/DonorProfile.jsx), [Certificate.jsx](../frontend/src/components/screens/Certificate.jsx)

**Narration:**
"This is the donor map, built with Leaflet — it plots nearby blood banks and donors geographically, so a hospital in need can see who's close by.

Donation History logs every donation per donor — [show a donor's record]. After a donation, HemoAI can generate a PDF certificate for the donor, using jsPDF and html2canvas — [click generate, show the PDF]. It's a small touch but donors like having proof of their contribution."

---

## 7. ML-powered forecasting (21:00 – 25:00)

**Show:** [Forecast.jsx](../frontend/src/components/screens/Forecast.jsx), then briefly `ml-service/app.py`

**Narration:**
"This is the part I'm most proud of. The ML service trains a separate linear regression model per blood group using real historical donation data pulled from the donation service. When a blood bank opens the Forecast screen, it calls the ML service, which predicts next week's expected donations for each blood group — [show the forecast chart/numbers].

Every forecast call is logged to MongoDB, best-effort, so we can track prediction accuracy over time and retrain later. This turns reactive stock management into proactive planning — a bank can see 'O-negative donations are trending down' and run a targeted donor drive before they run out."

---

## 8. Chatbot (25:00 – 27:30)

**Show:** [Chatbot.jsx](../frontend/src/components/screens/Chatbot.jsx)

**Narration:**
"For quick questions — 'how much O-positive blood do we have?' or 'when is my next eligible donation date?' — HemoAI has a chatbot backed by a locally-run Ollama LLM through the chatbot service. [Ask 2-3 sample questions live.] This keeps AI capability self-hosted rather than sending health data to a third-party API — important for a healthcare-adjacent app."

---

## 9. Reports & staff management (27:30 – 29:00)

**Show:** [Reports.jsx](../frontend/src/components/screens/Reports.jsx), [StaffManagement.jsx](../frontend/src/components/screens/StaffManagement.jsx), [DHO.jsx](../frontend/src/components/screens/DHO.jsx)

**Narration:**
"Blood banks manage their staff and roles here, DHOs get an oversight view across all banks in their district, and the Reports screen exports summarized activity — again using the jsPDF pipeline — for compliance or handoff to health authorities."

---

## 10. Wrap-up (29:00 – 30:00)

**Show:** Back to Landing page or architecture diagram

**Narration:**
"To recap: HemoAI is a React + Spring Boot microservices platform with a Python ML forecasting layer and a self-hosted LLM chatbot, built to take blood bank management from reactive spreadsheets to a connected, predictive system.

Code's on GitHub at [your repo URL] — thanks for watching."

---

## Shot list summary (quick reference while recording)

| # | Screen(s) | Approx. time |
|---|---|---|
| 1 | Landing / title | 0:00–2:00 |
| 2 | Landing / slide | 2:00–4:00 |
| 3 | README + folders | 4:00–9:00 |
| 4 | Reg screens + PendingApprovals | 9:00–13:00 |
| 5 | Dashboard, Inventory, Alerts | 13:00–17:00 |
| 6 | DonorMap, DonationHistory, Certificate | 17:00–21:00 |
| 7 | Forecast + ml-service code | 21:00–25:00 |
| 8 | Chatbot | 25:00–27:30 |
| 9 | Reports, StaffManagement, DHO | 27:30–29:00 |
| 10 | Wrap-up | 29:00–30:00 |

## Recording tips

- Use **OBS Studio** (free) or Windows' built-in **Xbox Game Bar** (Win+G) to capture the browser + editor window.
- Record narration live while screen-recording, or record silent footage first and voiceover after (easier to fix flubs).
- Keep mouse movements slow and deliberate; pause ~1s after each click before talking, easier to edit.
- Record each numbered segment as a **separate clip** — much easier to re-take one section than a full 30-minute take. Stitch in CapCut/DaVinci Resolve/Premiere.
