"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Search, ShoppingBasket, UserRound } from "lucide-react";

import { siteConfig } from "@/config/site";
import { routeSectionMap } from "@/config/site-sections";
import { isFrontendSectionEnabled } from "@/lib/site-sections";
import { selectCurrentUser, useAuthStore } from "@/store/auth-store";
import { cartItemCount, useCartStore } from "@/store/cart-store";
import type { SiteContent } from "@/types/site-content";

export const Header = ({ siteContent }: { siteContent?: SiteContent | null }) => {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  const currentUser = useAuthStore(selectCurrentUser);
  const logout = useAuthStore((state) => state.logout);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const count = cartItemCount(items);
  const menuEnabled = siteContent
    ? isFrontendSectionEnabled(siteContent.pageSections, "menu.products")
    : true;
  const visibleNav = siteContent
    ? siteConfig.nav.filter((link) => {
        const sectionKey = routeSectionMap[link.href];
        return sectionKey ? isFrontendSectionEnabled(siteContent.pageSections, sectionKey) : true;
      })
    : siteConfig.nav;

  return (
    <header className="sticky top-0 z-40 w-full bg-crema/80 backdrop-blur-md border-b border-beige-tostado/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center md:hidden">
            <button className="p-2 text-sepia hover:text-terracota transition-colors" type="button">
              <Menu size={24} />
            </button>
          </div>

          <Link href="/" className="flex-shrink-0 flex items-center group">
            <h1 className="text-3xl font-bold tracking-tighter text-terracota italic group-hover:scale-105 transition-transform">
              Molotes <span className="text-canela font-normal not-italic">El Tradicional</span>
            </h1>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {visibleNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 relative py-2 group ${
                  pathname === link.href ? "text-terracota" : "text-sepia hover:text-terracota"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-terracota transform origin-left transition-transform duration-300 ${
                    pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {menuEnabled ? (
              <Link href="/menu" className="p-2 text-sepia hover:text-terracota transition-colors hidden sm:block">
                <Search size={20} />
              </Link>
            ) : null}
            {currentUser ? (
              <>
                <Link
                  href="/mi-cuenta"
                  className="inline-flex items-center gap-2 rounded-xl border border-beige-tostado/25 px-3 py-2 text-sepia transition-colors hover:border-terracota hover:text-terracota"
                  aria-label="Mi cuenta"
                >
                  <UserRound size={18} />
                  <span className="hidden text-sm font-semibold sm:inline">
                    {currentUser.username}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="p-2 text-sepia hover:text-terracota transition-colors"
                  aria-label="Cerrar sesion"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("Inicia sesion para comprar y consultar tus pedidos.")}
                className="inline-flex items-center gap-2 rounded-xl border border-beige-tostado/25 px-3 py-2 text-sepia transition-colors hover:border-terracota hover:text-terracota"
                aria-label="Iniciar sesion"
              >
                <UserRound size={18} />
                <span className="hidden text-sm font-semibold sm:inline">Entrar</span>
              </button>
            )}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-sepia hover:text-terracota transition-colors group"
            >
              <ShoppingBasket size={24} />
              {count > 0 ? (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-crema transform translate-x-1/2 -translate-y-1/2 bg-rojo-quemado rounded-full">
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
