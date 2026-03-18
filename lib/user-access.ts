import type { AppUser, AppUserRole, UserSession } from "@/types/auth";

export const getUserPrimaryHref = (
  user: Pick<AppUser, "role"> | Pick<UserSession, "role"> | null | undefined,
): string => (user?.role === "admin" ? "/admin" : "/mi-cuenta");

export const getUserPrimaryLabel = (
  user: Pick<AppUser, "role" | "username"> | null | undefined,
): string => (user?.role === "admin" ? "Admin" : user?.username ?? "Mi cuenta");
