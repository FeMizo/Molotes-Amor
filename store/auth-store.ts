"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  authenticateUser,
  assertUserCanRegister,
  createAppUser,
  createSession,
  findUserByUsernameOrEmail,
  getAuthUsersSeed,
} from "@/services/auth/auth.service";
import { normalizeLoyaltyProfile } from "@/lib/loyalty";
import type { AppUser, UserSession } from "@/types/auth";
import type { UserAddress } from "@/types/account";

interface AuthStoreState {
  users: AppUser[];
  session: UserSession | null;
  authModalOpen: boolean;
  authModalReason?: string;
  login: (credentials: { username: string; password: string }) => AppUser;
  register: (input: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
  }) => AppUser;
  resetPassword: (input: { identity: string; nextPassword: string }) => AppUser;
  setUsers: (users: AppUser[]) => void;
  setSession: (session: UserSession | null) => void;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  logout: () => void;
  updateUser: (userId: string, updater: (user: AppUser) => AppUser) => void;
}

const defaultUsers = getAuthUsersSeed();

const normalizeUserRole = (user: AppUser): AppUser => ({
  ...user,
  role: user.role ?? (user.username === "adminmolotes" ? "admin" : "user"),
  isActive: user.isActive ?? true,
  loyalty: normalizeLoyaltyProfile(user.loyalty),
});

const mergeUsersWithDefaults = (persistedUsers: AppUser[] | undefined): AppUser[] => {
  const mergedById = new Map<string, AppUser>();

  for (const user of defaultUsers) {
    mergedById.set(user.id, normalizeUserRole(user));
  }

  for (const user of persistedUsers ?? []) {
    const normalizedUser = normalizeUserRole(user);
    const baseUser = mergedById.get(normalizedUser.id);

    mergedById.set(normalizedUser.id, {
      ...(baseUser ?? normalizedUser),
      ...normalizedUser,
    });
  }

  return [...mergedById.values()];
};

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      users: defaultUsers,
      session: null,
      authModalOpen: false,
      authModalReason: undefined,
      login: (credentials) => {
        const user = authenticateUser(get().users, credentials);

        set({
          session: createSession(user),
          authModalOpen: false,
          authModalReason: undefined,
        });

        return user;
      },
      register: (input) => {
        const users = get().users;
        assertUserCanRegister(users, {
          username: input.username,
          email: input.email,
        });

        const user = normalizeUserRole(createAppUser(input));

        set({
          users: [...users, user],
          session: createSession(user),
          authModalOpen: false,
          authModalReason: undefined,
        });

        return user;
      },
      resetPassword: ({ identity, nextPassword }) => {
        const user = findUserByUsernameOrEmail(get().users, identity);
        if (!user) {
          throw new Error("No encontramos una cuenta con ese usuario o correo.");
        }

        const updatedUser = {
          ...user,
          password: nextPassword,
          passwordUpdatedAt: new Date().toISOString(),
        } satisfies AppUser;

        set((state) => ({
          users: state.users.map((candidate) =>
            candidate.id === updatedUser.id ? updatedUser : candidate,
          ),
        }));

        return updatedUser;
      },
      setUsers: (users) => set({ users }),
      setSession: (session) => set({ session, authModalOpen: false, authModalReason: undefined }),
      openAuthModal: (reason) => set({ authModalOpen: true, authModalReason: reason }),
      closeAuthModal: () => set({ authModalOpen: false, authModalReason: undefined }),
      logout: () => set({ session: null, authModalOpen: false, authModalReason: undefined }),
      updateUser: (userId, updater) =>
        set((state) => {
          const users = state.users.map((user) => {
            if (user.id !== userId) {
              return user;
            }

            return normalizeUserRole(updater(user));
          });
          const updatedUser = users.find((user) => user.id === userId);

          const session =
            state.session && state.session.userId === userId
              ? updatedUser && updatedUser.isActive
                ? {
                    ...state.session,
                    username: updatedUser.username,
                    role: updatedUser.role,
                  }
                : null
              : state.session;

          return {
            users,
            session,
          };
        }),
    }),
    {
      name: "molotes-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        session: state.session,
      }),
      merge: (persistedState, currentState) => {
        const merged = persistedState as Partial<AuthStoreState> | undefined;

        return {
          ...currentState,
          ...merged,
          users: mergeUsersWithDefaults(merged?.users as AppUser[] | undefined),
          session: merged?.session
            ? {
                ...merged.session,
                role:
                  merged.session.role ??
                  (merged.session.username === "adminmolotes" ? "admin" : "user"),
              }
            : currentState.session,
          authModalOpen: false,
          authModalReason: undefined,
        };
      },
    },
  ),
);

export const selectCurrentUser = (state: AuthStoreState): AppUser | null =>
  state.session
    ? state.users.find((user) => user.id === state.session?.userId) ?? null
    : null;

export const selectIsAdmin = (state: AuthStoreState): boolean =>
  Boolean(
    state.session &&
      state.users.find((user) => user.id === state.session?.userId)?.role === "admin",
  );

export const upsertUserAddress = (addresses: UserAddress[], address: UserAddress): UserAddress[] => {
  const exists = addresses.some((item) => item.id === address.id);
  const nextAddresses = exists
    ? addresses.map((item) => (item.id === address.id ? address : item))
    : [...addresses, address];

  const normalizedDefault = nextAddresses.map((item) => ({
    ...item,
    isDefault: address.isDefault ? item.id === address.id : item.isDefault,
  }));

  return normalizedDefault.some((item) => item.isDefault)
    ? normalizedDefault
    : normalizedDefault.map((item, index) => ({
        ...item,
        isDefault: index === 0,
      }));
};
