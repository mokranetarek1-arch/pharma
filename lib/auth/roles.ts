import type { UserRole } from "@/lib/types";

export function getDashboardPath(role?: string | null) {
  switch (role as UserRole | undefined) {
    case "doctor":
      return "/doctor/profile";
    case "pharmacist":
      return "/pharmacy/profile";
    case "admin":
      return "/admin";
    case "user":
    default:
      return "/search";
  }
}
