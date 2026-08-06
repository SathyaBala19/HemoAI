// src/api.js
//
// This file is the ONLY place in the frontend that talks to the real
// backend (auth-service). Every other file that needs to log in or
// register a user should call the functions exported here instead of
// using fetch() directly - that way, if the backend URL or response
// shape ever changes, we only have to fix it in one spot.
//
// auth-service must be running on port 8081 (see backend/auth-service)
// for any of this to work - start.bat in the project root starts it
// automatically along with everything else.

const AUTH_HOST = "http://localhost:8081";
const AUTH_BASE_URL = `${AUTH_HOST}/api/auth`;
const USERS_BASE_URL = `${AUTH_HOST}/api/users`;
const EMPLOYEE_BASE_URL = "http://localhost:8082/api/employees";
const INVENTORY_BASE_URL = "http://localhost:8083/api/inventory";
const DONATION_BASE_URL = "http://localhost:8084/api/donations";
const CHATBOT_BASE_URL = "http://localhost:8085/api/chatbot";
const ML_BASE_URL = "http://localhost:8086/api";

// Small helper so every function below doesn't have to repeat the same
// fetch + error-handling boilerplate.
async function postJson(url, body) {
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (networkError) {
    // fetch() itself throws when it can't even reach the server - e.g.
    // auth-service isn't running, or CORS is misconfigured.
    throw new Error("Could not reach the server. Is auth-service running on port 8081?");
  }

  // auth-service sometimes replies with plain text ("Email already
  // registered") and sometimes with JSON ({ token, userId, ... }) -
  // read it as text first, then try to parse it as JSON.
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    // Login on a PENDING/REJECTED account gets a structured
    // { status, reason } body (see AccountStatusResponse on the
    // backend) instead of a plain message - attach it to the thrown
    // Error so callers (Login.jsx) can show the right banner instead of
    // just a generic message.
    if (data && typeof data === "object" && data.status) {
      const error = new Error(`Account is ${data.status.toLowerCase()}`);
      error.accountStatus = data.status;
      error.accountReason = data.reason;
      throw error;
    }
    const message = typeof data === "string" ? data : "Request failed";
    throw new Error(message);
  }

  return data;
}

// Calls POST /api/auth/register. role must be one of "DONOR",
// "BLOOD_BANK_OFFICER", "HOSPITAL_ADMIN", "DHO" (matches com.auth.entity.Role
// on the backend). city/state/bloodGroup are optional and only really
// used for DONOR accounts. Returns the success message string on
// success, or throws an Error with the backend's message on failure.
export function registerUser({ name, email, password, role, city, state, bloodGroup }) {
  return postJson(`${AUTH_BASE_URL}/register`, { name, email, password, role, city, state, bloodGroup });
}

// Calls POST /api/auth/login. On success, returns
// { token, tokenType, userId, email, role }. On failure (wrong password,
// unknown email, etc.) throws an Error - the backend returns 401/403 for
// bad credentials, which postJson() turns into a thrown error here.
export function loginUser({ email, password }) {
  return postJson(`${AUTH_BASE_URL}/login`, { email, password });
}

// --- employee-service calls (port 8082) ---
// Every one of these needs a JWT token in the Authorization header, since
// employee-service's SecurityConfig requires a logged-in, correctly-roled
// user for every endpoint. Get that token with getToken() (see below)
// after a successful loginUser() call.

async function authFetch(url, token, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  } catch (networkError) {
    throw new Error(`Could not reach the server at ${url}. Is the right backend service running?`);
  }

  if (response.status === 401) {
    // Token missing/expired - clear the stale session and send the user
    // back to login instead of leaving them stuck on a broken screen.
    clearSession();
    window.location.href = "/login";
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (response.status === 403) {
    throw new Error("You do not have permission for this action.");
  }

  // DELETE succeeds with a 204 No Content - there's no body to read.
  if (response.status === 204) return null;

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(typeof data === "string" ? data : "Request failed");
  }

  return data;
}

// GET /api/employees - list every employee record.
export function listEmployees(token) {
  return authFetch(EMPLOYEE_BASE_URL, token);
}

// GET /api/employees/:id - one employee record, fetched fresh from the
// server (not just read out of an already-loaded list).
export function getEmployee(token, id) {
  return authFetch(`${EMPLOYEE_BASE_URL}/${id}`, token);
}

// POST /api/employees - add a new employee record.
export function createEmployee(token, employee) {
  return authFetch(EMPLOYEE_BASE_URL, token, {
    method: "POST",
    body: JSON.stringify(employee),
  });
}

// PUT /api/employees/:id - update an existing employee record.
export function updateEmployee(token, id, employee) {
  return authFetch(`${EMPLOYEE_BASE_URL}/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(employee),
  });
}

// DELETE /api/employees/:id - remove an employee record (DHO role only -
// see backend/employee-service/.../EmployeeController.deleteEmployee()).
export function deleteEmployee(token, id) {
  return authFetch(`${EMPLOYEE_BASE_URL}/${id}`, token, { method: "DELETE" });
}

// --- more auth-service calls (profile / donor directory) ---

// GET /api/users/profile - the logged-in user's own full profile.
export function getMyProfile(token) {
  return authFetch(`${USERS_BASE_URL}/profile`, token);
}

// GET /api/users/donors - every donor's name/city/state/blood group.
// Staff-only on the backend (HOSPITAL_ADMIN/BLOOD_BANK_OFFICER/DHO).
export function listDonors(token) {
  return authFetch(`${USERS_BASE_URL}/donors`, token);
}

// --- account approval calls (DHO only on the backend) ---

// GET /api/users/pending - every staff account waiting on a decision.
export function listPendingApprovals(token) {
  return authFetch(`${USERS_BASE_URL}/pending`, token);
}

// POST /api/users/:id/approve
export function approveAccount(token, id) {
  return authFetch(`${USERS_BASE_URL}/${id}/approve`, token, { method: "POST" });
}

// POST /api/users/:id/reject
export function rejectAccount(token, id, reason) {
  return authFetch(`${USERS_BASE_URL}/${id}/reject`, token, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// --- inventory-service calls (port 8083) ---
// Same authenticated-fetch pattern as the employee-service calls above.

// GET /api/inventory - one row per blood group (units on hand, minimum threshold).
export function listInventory(token) {
  return authFetch(INVENTORY_BASE_URL, token);
}

// GET /api/inventory/:id - one blood group's row, fetched fresh from the server.
export function getInventoryById(token, id) {
  return authFetch(`${INVENTORY_BASE_URL}/${id}`, token);
}

// PUT /api/inventory/:id - update units/threshold for one blood group.
export function updateInventory(token, id, inventory) {
  return authFetch(`${INVENTORY_BASE_URL}/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(inventory),
  });
}

// DELETE /api/inventory/:id - remove a blood group's row entirely
// (DHO role only - see backend/inventory-service/.../InventoryController).
export function deleteInventory(token, id) {
  return authFetch(`${INVENTORY_BASE_URL}/${id}`, token, { method: "DELETE" });
}

// --- donation-service calls (port 8084) ---

// GET /api/donations/mine - the logged-in donor's own donation history.
export function listMyDonations(token) {
  return authFetch(`${DONATION_BASE_URL}/mine`, token);
}

// GET /api/donations - every donation (staff only - used for Reports).
export function listAllDonations(token) {
  return authFetch(DONATION_BASE_URL, token);
}

// POST /api/donations - log a new donation for the logged-in donor.
// donorEmail/donorName are filled in server-side from the JWT, not sent
// here - see backend/donation-service/.../DonationController.
export function createDonation(token, { bloodGroup, donationDate, location }) {
  return authFetch(DONATION_BASE_URL, token, {
    method: "POST",
    body: JSON.stringify({ bloodGroup, donationDate, location }),
  });
}

// --- chatbot-service calls (port 8085) ---
// Requires Ollama running locally (see backend/chatbot-service/README-ish
// comments in application.properties) - if it's not running, this call
// fails and the error message says so.

// POST /api/chatbot/message - sends the whole conversation so far
// ([{role: "user"|"assistant", content: "..."}]) and gets the next
// assistant reply back as a plain string.
export async function sendChatMessage(token, messages) {
  const data = await authFetch(`${CHATBOT_BASE_URL}/message`, token, {
    method: "POST",
    body: JSON.stringify({ messages }),
  });
  return data.reply;
}

// --- ml-service calls (port 8086) ---
// A real scikit-learn model, not a formula - see backend/../ml-service.
// Staff-only on the backend (HOSPITAL_ADMIN/BLOOD_BANK_OFFICER/DHO).

// GET /api/forecast - next week's predicted donation count per blood
// group. Returns { "O+": { predictedUnits, weeksOfData, method }, ... }.
export async function getMlForecast(token) {
  const data = await authFetch(`${ML_BASE_URL}/forecast`, token);
  return data.predictions;
}

// --- Simple helpers for storing the logged-in user's session in the browser ---
// localStorage keeps this data even if the page is refreshed (unlike plain
// React state, which resets on refresh).

const TOKEN_KEY = "hemoai_token";
const USER_KEY = "hemoai_user";

export function saveSession({ token, userId, email, name, role }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ userId, email, name, role }));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
