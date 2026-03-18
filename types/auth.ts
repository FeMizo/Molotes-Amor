import type { UserAccountProfile } from "@/types/account";

export type AppUserRole = "admin" | "user";

export interface AppUser extends UserAccountProfile {
  username: string;
  password: string;
  role: AppUserRole;
  isActive: boolean;
}

export type User = AppUser;

export interface UserSession {
  userId: string;
  username: string;
  role: AppUserRole;
  startedAt: string;
}
