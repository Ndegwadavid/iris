import { ADMIN_USERS } from "../types"

export function validateAdminCredentials(username: string, password: string) {
  const user = ADMIN_USERS.find((u) => u.username === username && u.password === password)
  return !!user
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false
  return localStorage.getItem("adminAuthenticated") === "true"
}

