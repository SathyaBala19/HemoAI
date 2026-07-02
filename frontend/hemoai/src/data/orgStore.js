// src/data/orgStore.js
// Mock "database" — in a real backend this would be Postgres tables.
// Encodes the org hierarchy: SuperAdmin -> DHO -> Hospital/BloodBank -> Donor

export const ACCOUNT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
};

// Districts are owned/created by the platform super-admin
export const districts = [
  { id: "d1", name: "Coimbatore" },
  { id: "d2", name: "Salem" },
  { id: "d3", name: "Erode" },
];

// Facilities (hospitals / blood banks) — created when their admin registers,
// but the facility itself isn't "live" until approved.
export const facilities = [
  { id: "f1", type: "hospital",  name: "City General Hospital", district: "d1", licenseNo: "TN-HOS-2291", status: ACCOUNT_STATUS.APPROVED },
  { id: "f2", type: "bloodbank", name: "Coimbatore Central Blood Bank", district: "d1", licenseNo: "TN-BB-0417", status: ACCOUNT_STATUS.APPROVED },
];

// Users — every non-donor user has reportsTo pointing at the account
// that approves them. Donors have no reportsTo; they're tagged to a facility.
export let users = [
  {
    id: "u_superadmin",
    name: "State Health Dept",
    email: "admin@tn.gov.in",
    role: "SuperAdmin",
    district: null,
    facilityId: null,
    reportsTo: null,
    status: ACCOUNT_STATUS.APPROVED,
  },
  {
    id: "u_dho1",
    name: "P. Selvam",
    email: "p.selvam@coimbatore.tn.gov.in",
    role: "DHO",
    district: "d1",
    facilityId: null,
    reportsTo: "u_superadmin",
    status: ACCOUNT_STATUS.APPROVED,
  },
  {
    id: "u_hosp1",
    name: "Sathya Bala",
    email: "sathya.bala@cityhospital.gov.in",
    role: "Hospital Admin",
    district: "d1",
    facilityId: "f1",
    reportsTo: "u_dho1",
    status: ACCOUNT_STATUS.APPROVED,
  },
  {
    id: "u_bb1",
    name: "Rajan Kumar",
    email: "rajan.k@cityhospital.gov.in",
    role: "Blood Bank Officer",
    district: "d1",
    facilityId: "f2",
    reportsTo: "u_dho1",
    status: ACCOUNT_STATUS.APPROVED,
  },
  {
    id: "u_donor1",
    name: "Arjun Kumar",
    email: "arjun.kumar@gmail.com",
    role: "Donor",
    district: "d1",
    facilityId: "f1",
    reportsTo: null,
    status: ACCOUNT_STATUS.APPROVED,
  },
];

// --- Mock "API" functions (swap these for real fetch() calls later) ---

export function getPendingApprovals(approverId) {
  return users.filter(u => u.reportsTo === approverId && u.status === ACCOUNT_STATUS.PENDING);
}

export function submitRegistration({ name, email, role, district, facilityName, facilityType, licenseNo, reportsTo }) {
  const facilityId = facilityType ? `f_${Date.now()}` : null;

  if (facilityType) {
    facilities.push({
      id: facilityId,
      type: facilityType,
      name: facilityName,
      district,
      licenseNo,
      status: ACCOUNT_STATUS.PENDING,
    });
  }

  const newUser = {
    id: `u_${Date.now()}`,
    name,
    email,
    role,
    district,
    facilityId,
    reportsTo,
    status: ACCOUNT_STATUS.PENDING,
  };
  users.push(newUser);
  return newUser;
}

export function approveUser(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  user.status = ACCOUNT_STATUS.APPROVED;
  if (user.facilityId) {
    const facility = facilities.find(f => f.id === user.facilityId);
    if (facility) facility.status = ACCOUNT_STATUS.APPROVED;
  }
  return user;
}

export function rejectUser(userId, reason) {
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  user.status = ACCOUNT_STATUS.REJECTED;
  user.rejectionReason = reason || "Not specified";
  return user;
}

export function findUserByEmail(email) {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getDHOsForDistrict(district) {
  return users.filter(u => u.role === "DHO" && u.district === district && u.status === ACCOUNT_STATUS.APPROVED);
}