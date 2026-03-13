"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  FilePenLine,
  LayoutDashboard,
  PackageSearch,
  Store,
  Users,
} from "lucide-react";

const links = [
  {
    href: "/admin",
    label: "Resumen",
    description: "Metricas y alertas del dia",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Productos",
    description: "Catalogo, destacados y busqueda interna",
    icon: Boxes,
  },
  {
    href: "/admin/inventory",
    label: "Inventario",
    description: "Stock, minimo y backorder",
    icon: PackageSearch,
  },
  {
    href: "/admin/orders",
    label: "Pedidos",
    description: "Flujo operativo y filtros",
    icon: ClipboardList,
  },
  {
    href: "/admin/content",
    label: "Contenido",
    description: "Textos y bloques del sitio",
    icon: FilePenLine,
  },
  {
    href: "/admin/users",
    label: "Usuarios",
    description: "Vista base de clientes y cuentas",
    icon: Users,
  },
];

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-crema">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-10">
        <div className="mb-8 rounded-[2rem] border border-beige-tostado/20 bg-sepia px-6 py-8 text-crema shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-mostaza">
                Sistema interno
              </p>
              <h1 className="mt-3 text-4xl font-serif font-bold md:text-5xl">
                Panel <span className="text-terracota italic">Administrador</span>
              </h1>
              <p className="mt-3 text-crema/70">
                Opera catalogo, pedidos, inventario, contenido y usuarios sin mezclar la experiencia publica con el backend interno.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-crema/20 bg-crema/10 px-4 py-3 font-semibold text-crema transition-colors hover:bg-crema/20"
            >
              <Store size={18} />
              Ver sitio publico
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-beige-tostado/30 bg-white p-4 shadow-sm">
              <nav className="space-y-2">
                {links.map((link) => {
                  const Icon = link.icon;
                  const active =
                    pathname === link.href || pathname.startsWith(`${link.href}/`);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex gap-3 rounded-2xl border px-4 py-4 transition-colors ${
                        active
                          ? "border-terracota/35 bg-terracota/10"
                          : "border-transparent hover:border-beige-tostado/30 hover:bg-crema"
                      }`}
                    >
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                          active
                            ? "bg-terracota text-crema"
                            : "bg-beige-tostado/15 text-sepia"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="block min-w-0">
                        <span className="block font-semibold text-sepia">
                          {link.label}
                        </span>
                        <span className="mt-1 block text-sm text-sepia/60">
                          {link.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <section className="space-y-6">{children}</section>
        </div>
      </div>
    </div>
  );
};
