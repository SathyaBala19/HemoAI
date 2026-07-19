// src/App.jsx
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { C } from "./tokens";
import { ROLES, SCREEN_META } from "./roles";
import Sidebar from "./components/shared/Sidebar";
import TopBar from "./components/shared/TopBar";
import Landing from "./components/screens/Landing";
import Login from "./components/screens/Login";
import Dashboard from "./components/screens/Dashboard";
import Inventory from "./components/screens/Inventory";
import DonorMap from "./components/screens/DonorMap";
import Forecast from "./components/screens/Forecast";
import Chatbot from "./components/screens/Chatbot";
import Alerts from "./components/screens/Alerts";
import Reports from "./components/screens/Reports";
import DonorReg from "./components/screens/DonorReg";
import BloodBank from "./components/screens/BloodBank";
import DHO from "./components/screens/DHO";
import DonorProfile from "./components/screens/DonorProfile";
import DonationHistory from "./components/screens/DonationHistory";
import Certificate from "./components/screens/Certificate";
import HospitalReg from "./components/screens/HospitalReg";
import BloodBankReg from "./components/screens/BloodBankReg";
import DHOReg from "./components/screens/DHOReg";
import PendingApprovals from "./components/screens/PendingApprovals";
import StaffManagement from "./components/screens/StaffManagement";

const SCREEN_COMPONENTS = {
  dashboard:       Dashboard,
  inventory:       Inventory,
  donormap:        DonorMap,
  forecast:        Forecast,
  chatbot:         Chatbot,
  alerts:          Alerts,
  reports:         Reports,
  donorreg:        DonorReg,
  bloodbank:       BloodBank,
  dho:             DHO,
  approvals:       PendingApprovals,
  staff:           StaffManagement,
  donorprofile:    DonorProfile,
  donationhistory: DonationHistory,
  certificate:     Certificate,
};

function LandingRoute() {
  const navigate = useNavigate();
  return (
    <Landing
      onSignIn={() => navigate("/login")}
      onGetStarted={() => navigate("/register")}
    />
  );
}

function LoginRoute({ onLogin }) {
  const navigate = useNavigate();
  return (
    <Login
      onLogin={(selectedRole) => {
        const def = ROLES[selectedRole];
        onLogin(selectedRole);
        navigate(`/app/${def.home}`);
      }}
    />
  );
}

const REGISTER_TABS = [
  { key: "donor",     label: "Donor",              component: DonorReg,     hint: "Instant — start donating right away" },
  { key: "hospital",  label: "Hospital Admin",     component: HospitalReg,  hint: "Requires DHO approval" },
  { key: "bloodbank", label: "Blood Bank Officer", component: BloodBankReg, hint: "Requires DHO approval" },
  { key: "dho",       label: "District Health Officer", component: DHOReg,  hint: "Requires State Health Dept approval" },
];

function PublicRegisterRoute() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("donor");
  const ActiveForm = REGISTER_TABS.find(t => t.key === tab).component;

  return (
    <div style={{ minHeight: "100vh", background: "#F2F3F6", fontFamily: "'Roboto', sans-serif" }}>
      <div style={{
        height: 58, background: C.white, borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px",
      }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: C.red700, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: C.white }}>H</div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy, letterSpacing: "-0.2px" }}>HemoAI</span>
        </div>
        <span onClick={() => navigate("/login")} style={{ fontSize: 12, color: C.blue, cursor: "pointer", fontWeight: 600 }}>
          Already have an account? Sign in →
        </span>
      </div>

      <div style={{ padding: "24px 24px 0", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {REGISTER_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "9px 16px", borderRadius: 9, cursor: "pointer",
                border: `1.5px solid ${tab === t.key ? C.red700 : C.border}`,
                background: tab === t.key ? "#FFF5F6" : C.white,
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2,
              }}
            >
              <span style={{ fontSize: 12.5, fontWeight: 600, color: tab === t.key ? C.navy : C.slate }}>{t.label}</span>
              <span style={{ fontSize: 10, color: C.gray }}>{t.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 24px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <ActiveForm />
      </div>
    </div>
  );
}

function AppShell({ roleKey, onLogout }) {
  const { page } = useParams();
  const navigate = useNavigate();

  if (!roleKey) return <Navigate to="/" replace />;

  const roleDef = ROLES[roleKey];

  const allAllowed = [
    ...roleDef.mainNav.map(i => i.key),
    ...roleDef.donorNav.map(i => i.key),
  ];
  const safePage      = allAllowed.includes(page) ? page : roleDef.home;
  const SafeComponent = SCREEN_COMPONENTS[safePage] || SCREEN_COMPONENTS[roleDef.home];
  const rawMeta       = SCREEN_META[safePage] || SCREEN_META[roleDef.home];

  const firstName = roleDef.user.name.split(" ")[0];
  const meta = {
    ...rawMeta,
    subtitle: rawMeta.subtitle.replace("{name}", firstName),
  };

  function handleNavigate(key) {
    if (key === "__logout__") {
      onLogout();
      navigate("/");
      return;
    }
    navigate(`/app/${key}`);
  }

  return (
    <div style={{
      display: "flex", height: "100vh",
      background: "#F2F3F6", fontFamily: "'Roboto', sans-serif", overflow: "hidden",
    }}>
      <Sidebar
        active={safePage}
        onNavigate={handleNavigate}
        mainNav={roleDef.mainNav}
        donorNav={roleDef.donorNav}
        user={roleDef.user}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          user={roleDef.user}
          onLogout={() => handleNavigate("__logout__")}
        />
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <SafeComponent role={roleKey} onNavigate={handleNavigate} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [roleKey, setRoleKey] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      <Route path="/login" element={<LoginRoute onLogin={setRoleKey} />} />
      <Route path="/register" element={<PublicRegisterRoute />} />
      <Route path="/app/:page" element={<AppShell roleKey={roleKey} onLogout={() => setRoleKey(null)} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}