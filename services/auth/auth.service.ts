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

  if (!user.isActive) {
    throw new Error("Esta cuenta esta inactiva.");
  }

  return user;
};

export const createSession = (user: AppUser): UserSession => ({
  userId: user.id,
  username: user.username,
  role: user.role,
  startedAt: new Date().toISOString(),
});

export const createAppUser = (input: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}): AppUser => {
  const now = new Date().toISOString();

  return {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    username: input.username.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.replace(/\D/g, ""),
    password: input.password,
    role: "user",
    isActive: true,
    preferredContact: "whatsapp",
    marketingOptIn: true,
    memberSince: now,
    passwordUpdatedAt: now,
    addresses: [],
  };
};

export const assertUserCanRegister = (
  users: AppUser[],
  input: { username: string; email: string },
): void => {
  const normalizedUsername = input.username.trim().toLowerCase();
  const normalizedEmail = input.email.trim().toLowerCase();

  if (users.some((user) => user.username.toLowerCase() === normalizedUsername)) {
    throw new Error("Ese username ya esta en uso.");
  }

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error("Ese correo ya esta registrado.");
  }
};

export const findUserByUsernameOrEmail = (
  users: AppUser[],
  identity: string,
): AppUser | undefined => {
  const normalizedIdentity = identity.trim().toLowerCase();

  return users.find(
    (user) =>
      user.username.toLowerCase() === normalizedIdentity ||
      user.email.toLowerCase() === normalizedIdentity,
  );
};
