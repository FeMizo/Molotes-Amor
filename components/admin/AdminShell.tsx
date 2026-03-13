"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Productos" },
  { href: "/admin/inventory", label: "Inventario" },
  { href: "/admin/orders", label: "Pedidos" },
];

export const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="bg-crema min-h-screen">
      <section className="bg-sepia py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-crema">
            Panel <span className="text-terracota italic">Administrador</span>
          </h1>
          <p className="text-crema/70 mt-3">
            Gestion de productos, inventario, pedidos y contenido sin romper el diseno existente.
          </p>
          <nav className="mt-6 flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
                  pathname === link.href
                    ? "bg-terracota text-crema border-terracota"
                    : "bg-crema/10 text-crema border-crema/25 hover:bg-crema/20"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10">{children}</section>
    </div>
  );
};
