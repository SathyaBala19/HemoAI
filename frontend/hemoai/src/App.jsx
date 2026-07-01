import { useState } from "react";
import { ROLES, SCREEN_META } from "./roles";
import Sidebar from "./components/shared/Sidebar";
import TopBar from "./components/shared/TopBar";
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
  donorprofile:    DonorProfile,
  donationhistory: DonationHistory,
  certificate:     Certificate,
};

export default function App() {
  const [roleKey, setRoleKey] = useState(null);
  const [page, setPage]       = useState(null);

  // ── Login screen ─────────────────────────────────
  if (!roleKey) {
    return (
      <Login
        onLogin={(selectedRole) => {
          const def = ROLES[selectedRole];
          setRoleKey(selectedRole);
          setPage(def.home);
        }}
      />
    );
  }

  const roleDef = ROLES[roleKey];

  // Guard: redirect to home if page not accessible for this role
  const allAllowed = [
    ...roleDef.mainNav.map(i => i.key),
    ...roleDef.donorNav.map(i => i.key),
  ];
  const safePage      = allAllowed.includes(page) ? page : roleDef.home;
  const SafeComponent = SCREEN_COMPONENTS[safePage] || SCREEN_COMPONENTS[roleDef.home];
  const rawMeta       = SCREEN_META[safePage] || SCREEN_META[roleDef.home];

  // Personalise subtitle with logged-in user's first name
  const firstName = roleDef.user.name.split(" ")[0];
  const meta = {
    ...rawMeta,
    subtitle: rawMeta.subtitle.replace("{name}", firstName),
  };

  function handleNavigate(key) {
    if (key === "__logout__") {
      setRoleKey(null);
      setPage(null);
      return;
    }
    setPage(key);
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
          {/* Pass navigate so screens can link to other pages */}
          <SafeComponent role={roleKey} onNavigate={handleNavigate} />
        </div>
      </div>
    </div>
  );
}
