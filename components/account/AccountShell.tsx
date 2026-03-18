"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, LockKeyhole, MapPinned, Package, UserRound } from "lucide-react";

import { selectCurrentUser, useAuthStore } from "@/store/auth-store";

const items = [
  {
    href: "/mi-cuenta",
    label: "Resumen",
    description: "Centro de pedidos y actividad reciente",
    icon: Package,
  },
  {
    href: "/mi-cuenta/pedidos",
    label: "Pedidos",
    description: "Historial, estados y detalle",
    icon: Package,
  },
  {
    href: "/mi-cuenta/guardados",
    label: "Guardados",
    description: "Productos listos para volver al carrito",
    icon: Bookmark,
  },
  {
    href: "/mi-cuenta/perfil",
    label: "Cuenta",
    description: "Datos basicos, contacto y direcciones",
    icon: UserRound,
  },
  {
    href: "/mi-cuenta/seguridad",
    label: "Seguridad",
    description: "Cambio de contrasena y acceso",
    icon: LockKeyhole,
  },
];

export const AccountShell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const currentUser = useAuthStore(selectCurrentUser);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const logout = useAuthStore((state) => state.logout);

  return (
    <section className="bg-crema min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <header className="rounded-[2rem] border border-beige-tostado/25 bg-sepia px-6 py-8 text-crema shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-mostaza">
                Centro de pedidos
              </p>
              <h1 className="mt-3 text-4xl font-serif font-bold md:text-5xl">
                Mi <span className="text-terracota italic">cuenta</span>
              </h1>
              <p className="mt-3 text-crema/75">
                Revisa pedidos, mantente al tanto del estado actual y administra tus datos sin salir del flujo de compra.
              </p>
            </div>
            {currentUser ? (
              <div className="rounded-2xl border border-crema/10 bg-crema/10 px-4 py-3 text-sm text-crema/80">
                <p className="font-semibold text-crema">
                  {currentUser.firstName || currentUser.username}
                </p>
                <p>{currentUser.email}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-crema/10 bg-crema/10 px-4 py-3 text-sm text-crema/80">
                <p className="font-semibold text-crema">Acceso simple</p>
                <p>Entra para ver tus pedidos y repetir compra.</p>
              </div>
            )}
          </div>
        </header>

        {!currentUser ? (
          <article className="rounded-[2rem] border border-beige-tostado/30 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-serif font-bold text-sepia">
              Inicia sesion para ver tu centro de pedidos
            </h2>
            <p className="mt-3 max-w-2xl text-sepia/65">
              Este panel muestra solamente pedidos vinculados al usuario autenticado.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  openAuthModal("Inicia sesion para abrir tu centro de pedidos.")
                }
                className="rounded-xl bg-terracota px-5 py-3 font-bold text-crema transition-colors hover:bg-rojo-quemado"
              >
                Iniciar sesion
              </button>
              <Link
                href="/menu"
                className="rounded-xl border border-beige-tostado/35 px-5 py-3 font-bold text-sepia transition-colors hover:border-terracota"
              >
                Ir al menu
              </Link>
            </div>
          </article>
        ) : null}

        {!currentUser ? null : (
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-beige-tostado/30 bg-white p-4 shadow-sm">
              <nav className="space-y-2">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex gap-3 rounded-2xl border px-4 py-4 transition-colors ${
                        active
                          ? "border-terracota/35 bg-terracota/10"
                          : "border-transparent hover:border-beige-tostado/30 hover:bg-crema"
                      }`}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                          active
                            ? "bg-terracota text-crema"
                            : "bg-beige-tostado/15 text-sepia"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="block min-w-0">
                        <span className="block font-semibold text-sepia">
                          {item.label}
                        </span>
                        <span className="mt-1 block text-sm text-sepia/60">
                          {item.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="rounded-2xl border border-beige-tostado/30 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-beige-tostado/20 text-sepia">
                  <MapPinned size={18} />
                </span>
                <div>
                  <h2 className="font-semibold text-sepia">Compra mas rapido</h2>
                  <p className="text-sm text-sepia/60">
                    Guarda contacto, direcciones y favoritos para repetir pedido con menos pasos.
                  </p>
                </div>
              </div>
              {currentUser ? (
                <button
                  type="button"
                  onClick={logout}
                  className="mt-4 w-full rounded-xl border border-beige-tostado/35 px-4 py-3 text-left font-semibold text-sepia transition-colors hover:border-terracota"
                >
                  Cerrar sesion
                </button>
              ) : null}
            </div>
          </aside>

          <div className="space-y-6 opacity-100">
            {children}
          </div>
          </div>
        )}
      </div>
    </section>
  );
};
