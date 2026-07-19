// src/roles.js
// Role definitions — controls nav, home screen, and user info shown in sidebar/topbar

export const ROLES = {
  "Hospital Admin": {
    key: "hospitaladmin",
    home: "dashboard",
    user: { initials: "SB", name: "Sathya Bala",   role: "Hospital Admin" },
    mainNav: [
      { key: "dashboard",  label: "Dashboard",       abbr: "D" },
      { key: "inventory",  label: "Blood Inventory", abbr: "I" },
      { key: "donormap",   label: "Donor Map",       abbr: "M" },
      { key: "forecast",   label: "AI Forecast",     abbr: "F" },
      { key: "chatbot",    label: "AI Chatbot",      abbr: "C" },
      { key: "alerts",     label: "Alerts",          abbr: "A" },
      { key: "reports",    label: "Reports",         abbr: "R" },
      { key: "donorreg",   label: "Donor Registration", abbr: "+" },
      { key: "staff",      label: "Blood Bank Staff", abbr: "S" },
    ],
    donorNav: [],
  },

  "Blood Bank Officer": {
    key: "bloodbankofficer",
    home: "bloodbank",
    user: { initials: "RK", name: "Rajan Kumar",    role: "Blood Bank Officer" },
    mainNav: [
      { key: "bloodbank",  label: "Officer Dashboard", abbr: "O" },
      { key: "inventory",  label: "Blood Inventory",   abbr: "I" },
      { key: "donormap",   label: "Donor Map",         abbr: "M" },
      { key: "alerts",     label: "Alerts",            abbr: "A" },
      { key: "chatbot",    label: "AI Chatbot",        abbr: "C" },
      { key: "reports",    label: "Reports",           abbr: "R" },
    ],
    donorNav: [],
  },

  "DHO": {
    key: "dho",
    home: "dho",
    user: { initials: "PS", name: "P. Selvam",      role: "District Health Officer" },
    mainNav: [
      { key: "dho",        label: "DHO Dashboard",     abbr: "D" },
      { key: "approvals",  label: "Pending Approvals", abbr: "✓" },
      { key: "inventory",  label: "Blood Inventory",   abbr: "I" },
      { key: "forecast",   label: "AI Forecast",       abbr: "F" },
      { key: "alerts",     label: "Alerts",            abbr: "A" },
      { key: "reports",    label: "Reports",           abbr: "R" },
      { key: "chatbot",    label: "AI Chatbot",        abbr: "C" },
    ],
    donorNav: [],
  },

  "Donor": {
    key: "donor",
    home: "donorprofile",
    user: { initials: "AK", name: "Arjun Kumar",    role: "Blood Donor · O+" },
    mainNav: [
      { key: "chatbot",    label: "AI Chatbot",       abbr: "C" },
    ],
    donorNav: [
      { key: "donorprofile",    label: "My Profile",       abbr: "P" },
      { key: "donationhistory", label: "Donation History", abbr: "H" },
      { key: "certificate",     label: "Certificate",      abbr: "Ct" },
    ],
  },
};

export const SCREEN_META = {
  dashboard:       { title: "Dashboard",                       subtitle: "Good morning, {name} — here is today's overview" },
  inventory:       { title: "Blood Inventory",                 subtitle: "Real-time stock levels across all blood groups" },
  donormap:        { title: "Donor Map",                       subtitle: "Finding nearest compatible O- donors — Coimbatore" },
  forecast:        { title: "AI Demand Forecast",              subtitle: "Random Forest model · 94.3% accuracy · Last trained 6 hours ago" },
  chatbot:         { title: "AI Chatbot",                      subtitle: "Claude-powered assistant for hospital staff and donors" },
  alerts:          { title: "Alerts and Notifications",        subtitle: "7 active alerts · 3 critical · Last updated just now" },
  reports:         { title: "Reports and Analytics",           subtitle: "Monthly summary · June 2026 · All hospitals" },
  donorreg:        { title: "Donor Registration",              subtitle: "Register new donors with blood group, location and health history" },
  bloodbank:       { title: "Blood Bank Officer Dashboard",    subtitle: "Manage incoming requests, update stock and track donor availability" },
  dho:             { title: "District Health Officer Dashboard", subtitle: "District-wide blood supply · Coimbatore District" },
  approvals:       { title: "Pending Approvals",               subtitle: "Review and approve new hospital, blood bank and DHO registrations" },
  staff:           { title: "Blood Bank Staff",                subtitle: "Give your hospital staff access to run your blood bank" },
  donorprofile:    { title: "My Donor Profile",                subtitle: "Your personal blood donation profile and achievements" },
  donationhistory: { title: "Donation History",                subtitle: "Track your full donation journey and impact" },
  certificate:     { title: "Donation Certificate",            subtitle: "Official blood donation certificate — shareable and downloadable" },
};