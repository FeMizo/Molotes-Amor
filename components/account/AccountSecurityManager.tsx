"use client";

import { useState } from "react";

import { formatDateTime } from "@/lib/format";
import { useUserAccount } from "@/hooks/use-user-account";

export const AccountSecurityManager = () => {
  const { markPasswordChanged, profile } = useUserAccount();
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (currentPassword.trim().length < 6) {
      setError("Ingresa tu contrasena actual para continuar.");
      return;
    }

    if (nextPassword.length < 8) {
      setError("La nueva contrasena debe tener al menos 8 caracteres.");
      return;
    }

    if (nextPassword !== confirmPassword) {
      setError("La confirmacion no coincide con la nueva contrasena.");
      return;
    }

    if (nextPassword === currentPassword) {
      setError("Usa una contrasena distinta a la actual.");
      return;
    }

    markPasswordChanged();
    setCurrentPassword("");
    setNextPassword("");
    setConfirmPassword("");
    setSuccess("Contrasena actualizada. El flujo queda listo para backend real.");
  };

  return (
    <div className="space-y-6">
      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-terracota">
          Seguridad
        </p>
        <h2 className="mt-2 text-3xl font-serif font-bold text-sepia">
          Cambiar contrasena
        </h2>
        <p className="mt-2 max-w-2xl text-sepia/65">
          Separa credenciales del resto de tus datos. Este formulario ya valida reglas basicas y esta preparado para conectar con autenticacion real.
        </p>

        <form className="mt-6 max-w-2xl space-y-4" onSubmit={submit}>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-sepia">Contrasena actual</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-sepia">Nueva contrasena</span>
            <input
              type="password"
              value={nextPassword}
              onChange={(event) => setNextPassword(event.target.value)}
              className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-sepia">Confirmar nueva contrasena</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
            />
          </label>

          <div className="rounded-2xl bg-crema p-4 text-sm text-sepia/70">
            <p className="font-semibold text-sepia">Recomendaciones</p>
            <p className="mt-1">
              Usa al menos 8 caracteres y combina palabras faciles de recordar con numeros o simbolos.
            </p>
          </div>

          {error ? <p className="font-semibold text-rojo-quemado">{error}</p> : null}
          {success ? <p className="font-semibold text-olivo">{success}</p> : null}

          <button className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado">
            Actualizar contrasena
          </button>
        </form>
      </article>

      <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-sepia">Estado actual</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-crema p-4">
            <p className="text-sm font-semibold text-sepia/55">Ultimo cambio</p>
            <p className="mt-1 font-bold text-sepia">
              {formatDateTime(profile.passwordUpdatedAt)}
            </p>
          </div>
          <div className="rounded-2xl bg-crema p-4">
            <p className="text-sm font-semibold text-sepia/55">Cuenta</p>
            <p className="mt-1 font-bold text-sepia">{profile.email}</p>
          </div>
        </div>
      </article>
    </div>
  );
};
