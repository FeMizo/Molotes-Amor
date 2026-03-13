"use client";

import { useMemo, useState } from "react";

import { useAuthStore } from "@/store/auth-store";

import { ModalShell } from "../shared/ModalShell";

export const AuthModal = () => {
  const authModalOpen = useAuthStore((state) => state.authModalOpen);
  const authModalReason = useAuthStore((state) => state.authModalReason);
  const closeAuthModal = useAuthStore((state) => state.closeAuthModal);
  const login = useAuthStore((state) => state.login);
  const users = useAuthStore((state) => state.users);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const credentialsHint = useMemo(
    () =>
      users
        .map(
          (user) =>
            `${user.username} / ${user.password}${user.role === "admin" ? " [admin]" : ""}`,
        )
        .join("   "),
    [users],
  );

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      login({ username, password });
      setUsername("");
      setPassword("");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "No se pudo iniciar sesion.",
      );
    }
  };

  return (
    <ModalShell
      open={authModalOpen}
      onClose={() => {
        closeAuthModal();
        setError(null);
      }}
      title="Iniciar sesion"
      description={
        authModalReason ??
        "Accede para finalizar tu compra y ver solamente tus pedidos."
      }
      widthClassName="max-w-xl"
    >
      <form className="space-y-4" onSubmit={submit}>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-sepia">Usuario</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            placeholder="juantest1"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-sepia">Contrasena</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            placeholder="juantest1"
          />
        </label>

        <div className="rounded-2xl bg-crema p-4 text-sm text-sepia/70">
          <p className="font-semibold text-sepia">Usuarios de prueba</p>
          <p className="mt-1">
            Admin: `adminmolotes / molotesamor`. Los usuarios cliente mantienen su acceso simple.
          </p>
          <p className="mt-2 font-medium text-sepia">{credentialsHint}</p>
        </div>

        {error ? <p className="font-semibold text-rojo-quemado">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado">
            Entrar
          </button>
          <button
            type="button"
            onClick={closeAuthModal}
            className="rounded-xl border border-beige-tostado/35 px-5 py-3 font-bold text-sepia transition-colors hover:border-terracota"
          >
            Cancelar
          </button>
        </div>
      </form>
    </ModalShell>
  );
};
