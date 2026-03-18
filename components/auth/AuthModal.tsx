"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

import { ModalShell } from "../shared/ModalShell";
import { PasswordInput } from "../shared/PasswordInput";

type AuthMode = "login" | "register" | "forgot";

const emptyRegisterForm = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export const AuthModal = () => {
  const router = useRouter();
  const authModalOpen = useAuthStore((state) => state.authModalOpen);
  const authModalReason = useAuthStore((state) => state.authModalReason);
  const closeAuthModal = useAuthStore((state) => state.closeAuthModal);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const users = useAuthStore((state) => state.users);
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);
  const [forgotIdentity, setForgotIdentity] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const title =
    mode === "login"
      ? "Iniciar sesion"
      : mode === "register"
        ? "Registrarte"
        : "Olvide mi contrasena";

  const description =
    mode === "login"
      ? authModalReason ?? "Accede para finalizar tu compra y ver solamente tus pedidos."
      : mode === "register"
        ? "Crea tu cuenta para guardar pedidos, favoritos y continuar con un flujo mas rapido."
        : "Recupera tu acceso local/mock actualizando la contrasena de tu cuenta.";

  const resetLocalForms = () => {
    setUsername("");
    setPassword("");
    setRegisterForm(emptyRegisterForm);
    setForgotIdentity("");
    setForgotPassword("");
    setForgotConfirmPassword("");
  };

  const close = () => {
    closeAuthModal();
    setMode("login");
    setError(null);
    setSuccess(null);
    resetLocalForms();
  };

  const submitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const user = login({ username, password });
      resetLocalForms();
      router.push(user.role === "admin" ? "/admin" : "/mi-cuenta");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "No se pudo iniciar sesion.",
      );
    }
  };

  const submitRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (registerForm.firstName.trim().length < 2) {
      setError("Ingresa tu nombre.");
      return;
    }

    if (registerForm.username.trim().length < 4) {
      setError("El username debe tener al menos 4 caracteres.");
      return;
    }

    if (!registerForm.email.includes("@")) {
      setError("Ingresa un correo valido.");
      return;
    }

    if (registerForm.phone.replace(/\D/g, "").length < 10) {
      setError("Ingresa un telefono valido.");
      return;
    }

    if (registerForm.password.length < 8) {
      setError("La contrasena debe tener al menos 8 caracteres.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("La confirmacion no coincide con la contrasena.");
      return;
    }

    try {
      const user = register({
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        username: registerForm.username,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
      });
      resetLocalForms();
      router.push(user.role === "admin" ? "/admin" : "/mi-cuenta");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "No se pudo crear la cuenta.",
      );
    }
  };

  const submitForgotPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (forgotIdentity.trim().length < 3) {
      setError("Ingresa tu usuario o correo.");
      return;
    }

    if (forgotPassword.length < 8) {
      setError("La nueva contrasena debe tener al menos 8 caracteres.");
      return;
    }

    if (forgotPassword !== forgotConfirmPassword) {
      setError("La confirmacion no coincide con la nueva contrasena.");
      return;
    }

    try {
      const user = resetPassword({
        identity: forgotIdentity,
        nextPassword: forgotPassword,
      });

      setSuccess(`Contrasena actualizada para ${user.username}. Ya puedes iniciar sesion.`);
      setUsername(user.username);
      setPassword("");
      setForgotIdentity("");
      setForgotPassword("");
      setForgotConfirmPassword("");
      setMode("login");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo actualizar la contrasena.",
      );
    }
  };

  return (
    <ModalShell
      open={authModalOpen}
      onClose={close}
      title={title}
      description={description}
      widthClassName="max-w-xl"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-crema p-1">
          {[
            ["login", "Entrar"],
            ["register", "Registrarte"],
            ["forgot", "Recuperar"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value as AuthMode);
                setError(null);
                setSuccess(null);
              }}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                mode === value ? "bg-white text-sepia shadow-sm" : "text-sepia/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "login" ? (
          <form className="space-y-4" onSubmit={submitLogin}>
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
              <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="juantest1"
                autoComplete="current-password"
              />
            </label>

            <div className="rounded-2xl bg-crema p-4 text-sm text-sepia/70">
              <p className="font-semibold text-sepia">Usuarios de prueba</p>
              <p className="mt-1">
                Admin: `adminmolotes / molotesamor`. Los usuarios cliente mantienen su acceso simple.
              </p>
              <p className="mt-2 font-medium text-sepia">{credentialsHint}</p>
            </div>

            {success ? <p className="font-semibold text-olivo">{success}</p> : null}
            {error ? <p className="font-semibold text-rojo-quemado">{error}</p> : null}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado">
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setError(null);
                  setSuccess(null);
                }}
                className="text-sm font-semibold text-terracota transition-colors hover:text-rojo-quemado"
              >
                Olvide mi contrasena
              </button>
            </div>
          </form>
        ) : null}

        {mode === "register" ? (
          <form className="space-y-4" onSubmit={submitRegister}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-sepia">Nombre</span>
                <input
                  value={registerForm.firstName}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, firstName: event.target.value }))
                  }
                  className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-sepia">Apellido</span>
                <input
                  value={registerForm.lastName}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, lastName: event.target.value }))
                  }
                  className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-sepia">Username</span>
                <input
                  value={registerForm.username}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, username: event.target.value }))
                  }
                  className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-sepia">Correo</span>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Telefono</span>
              <input
                value={registerForm.phone}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, phone: event.target.value }))
                }
                className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-sepia">Contrasena</span>
                <PasswordInput
                  value={registerForm.password}
                  onChange={(value) =>
                    setRegisterForm((prev) => ({ ...prev, password: value }))
                  }
                  autoComplete="new-password"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-sepia">Confirmar contrasena</span>
                <PasswordInput
                  value={registerForm.confirmPassword}
                  onChange={(value) =>
                    setRegisterForm((prev) => ({ ...prev, confirmPassword: value }))
                  }
                  autoComplete="new-password"
                />
              </label>
            </div>

            {success ? <p className="font-semibold text-olivo">{success}</p> : null}
            {error ? <p className="font-semibold text-rojo-quemado">{error}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado">
                Crear cuenta
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccess(null);
                }}
                className="rounded-xl border border-beige-tostado/35 px-5 py-3 font-bold text-sepia transition-colors hover:border-terracota"
              >
                Ya tengo cuenta
              </button>
            </div>
          </form>
        ) : null}

        {mode === "forgot" ? (
          <form className="space-y-4" onSubmit={submitForgotPassword}>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Usuario o correo</span>
              <input
                value={forgotIdentity}
                onChange={(event) => setForgotIdentity(event.target.value)}
                className="w-full rounded-xl border border-beige-tostado/30 bg-crema px-4 py-3 focus:border-terracota focus:outline-none"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Nueva contrasena</span>
              <PasswordInput
                value={forgotPassword}
                onChange={setForgotPassword}
                autoComplete="new-password"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-sepia">Confirmar nueva contrasena</span>
              <PasswordInput
                value={forgotConfirmPassword}
                onChange={setForgotConfirmPassword}
                autoComplete="new-password"
              />
            </label>

            <div className="rounded-2xl bg-crema p-4 text-sm text-sepia/70">
              <p className="font-semibold text-sepia">Recuperacion mock/local</p>
              <p className="mt-1">
                Este flujo actualiza la contrasena directamente en el almacenamiento local del proyecto.
              </p>
            </div>

            {success ? <p className="font-semibold text-olivo">{success}</p> : null}
            {error ? <p className="font-semibold text-rojo-quemado">{error}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado">
                Actualizar contrasena
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccess(null);
                }}
                className="rounded-xl border border-beige-tostado/35 px-5 py-3 font-bold text-sepia transition-colors hover:border-terracota"
              >
                Volver a entrar
              </button>
            </div>
          </form>
        ) : null}

        {mode !== "login" ? (
          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-beige-tostado/35 px-5 py-3 font-bold text-sepia transition-colors hover:border-terracota"
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </ModalShell>
  );
};
