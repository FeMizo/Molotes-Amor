import type { UserAccountProfile } from "@/types/account";

export type AppUserRole = "admin" | "user";

export interface AppUser extends UserAccountProfile {
  username: string;
  password: string;
  role: AppUserRole;
}

export interface UserSession {
  userId: string;
  username: string;
  role: AppUserRole;
  startedAt: string;
}
