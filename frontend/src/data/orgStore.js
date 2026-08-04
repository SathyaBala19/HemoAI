// src/data/orgStore.js
//
// What's left here is just district data and a "does this district
// already have a DHO" lookup - used by HospitalReg/BloodBankReg/DHOReg
// to route a new registration to a district. The backend doesn't model
// districts at all, so this stays as plain in-memory data.
//
// Everything else that used to live here (mock users, facilities,
// approve/reject functions) has been replaced by the real backend - see
// src/api.js and backend/auth-service's AccountApprovalController.

export const districts = [
  { id: "d1", name: "Coimbatore" },
  { id: "d2", name: "Salem" },
  { id: "d3", name: "Erode" },
];

// Which districts already have an approved DHO - DHOReg.jsx uses this to
// stop a district from getting a second one. Coimbatore always has one
// (matches the seeded demo DHO account, P. Selvam) so the demo works
// out of the box; Salem and Erode are left open so you can actually
// register a DHO for them to try the flow.
const districtsWithDho = new Set(["d1"]);

export function getDHOsForDistrict(districtId) {
  return districtsWithDho.has(districtId) ? [{ id: "demo-dho" }] : [];
}

export function districtAlreadyHasDho(districtId) {
  return districtsWithDho.has(districtId);
}
