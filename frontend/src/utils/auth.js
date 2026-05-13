export function isAdminLoggedIn() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("adminToken"));
}

export function logoutAdmin() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("adminToken");
}
