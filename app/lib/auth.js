export function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "/login"; // force full redirect to clean state
}
