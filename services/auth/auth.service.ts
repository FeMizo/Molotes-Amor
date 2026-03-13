import { authUserSeed } from "@/data/account";
import type { AppUser, UserSession } from "@/types/auth";

export const getAuthUsersSeed = (): AppUser[] => authUserSeed;

export const findUserBySession = (
  users: AppUser[],
  session: UserSession | null,
): AppUser | null => {
  if (!session) {
    return null;
  }

  return users.find((user) => user.id === session.userId) ?? null;
};

export const authenticateUser = (
  users: AppUser[],
  credentials: { username: string; password: string },
): AppUser => {
  const normalizedUsername = credentials.username.trim().toLowerCase();
  const user = users.find(
    (candidate) => candidate.username.toLowerCase() === normalizedUsername,
  );

  if (!user || user.password !== credentials.password) {
    throw new Error("Usuario o contrasena incorrectos.");
  }

  return user;
};

export const createSession = (user: AppUser): UserSession => ({
  userId: user.id,
  username: user.username,
  role: user.role,
  startedAt: new Date().toISOString(),
});
