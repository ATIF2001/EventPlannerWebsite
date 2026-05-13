export function isAdminLoggedIn() {
  return Boolean(localStorage.getItem("adminToken"));
}

export function logoutAdmin() {
  localStorage.removeItem("adminToken");
}

