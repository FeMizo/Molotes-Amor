"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  authenticateUser,
  createSession,
  getAuthUsersSeed,
} from "@/services/auth/auth.service";
import type { AppUser, UserSession } from "@/types/auth";
import type { UserAddress } from "@/types/account";

interface AuthStoreState {
  users: AppUser[];
  session: UserSession | null;
  authModalOpen: boolean;
  authModalReason?: string;
  login: (credentials: { username: string; password: string }) => void;
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
});

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      users: defaultUsers,
      session: null,
      authModalOpen: false,
      authModalReason: undefined,
      login: (credentials) =>
        set((state) => {
          const user = authenticateUser(state.users, credentials);
          return {
            session: createSession(user),
            authModalOpen: false,
            authModalReason: undefined,
          };
        }),
      setUsers: (users) => set({ users }),
      setSession: (session) => set({ session, authModalOpen: false, authModalReason: undefined }),
      openAuthModal: (reason) => set({ authModalOpen: true, authModalReason: reason }),
      closeAuthModal: () => set({ authModalOpen: false, authModalReason: undefined }),
      logout: () => set({ session: null, authModalOpen: false, authModalReason: undefined }),
      updateUser: (userId, updater) =>
        set((state) => ({
          users: state.users.map((user) => (user.id === userId ? updater(user) : user)),
        })),
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
          users:
            merged?.users && merged.users.length > 0
              ? merged.users.map((user) => normalizeUserRole(user as AppUser))
              : currentState.users,
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
