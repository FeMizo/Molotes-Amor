import type { UserAccountProfile } from "@/types/account";

export interface AppUser extends UserAccountProfile {
  username: string;
  password: string;
}

export interface UserSession {
  userId: string;
  username: string;
  startedAt: string;
}
