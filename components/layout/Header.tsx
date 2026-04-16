"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Search, ShoppingBasket, UserRound, X } from "lucide-react";

import { siteConfig } from "@/config/site";
import { routeSectionMap } from "@/config/site-sections";
import { isFrontendSectionEnabled } from "@/lib/site-sections";
import { getUserPrimaryHref, getUserPrimaryLabel } from "@/lib/user-access";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuEnabled = siteContent
    ? isFrontendSectionEnabled(siteContent.pageSections, "menu.products")
    : true;
  const visibleNav = siteContent
    ? siteConfig.nav.filter((link) => {
        const sectionKey = routeSectionMap[link.href];
        return sectionKey ? isFrontendSectionEnabled(siteContent.pageSections, sectionKey) : true;
      })
    : siteConfig.nav;

  // Close mobile menu on route change
  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setMobileOpen(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [mobileOpen, pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-crema/80 backdrop-blur-md border-b border-beige-tostado/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Hamburger — mobile only */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="p-2 text-sepia hover:text-terracota transition-colors"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center group">
            {siteContent?.brand?.logo ? (
              <img
                src={siteContent.brand.logo}
                alt={siteContent.brand.metaTitle || "Logo"}
                className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <h1 className="text-3xl font-bold tracking-tighter text-terracota italic group-hover:scale-105 transition-transform">
                Molotes <span className="text-canela font-normal not-italic">El Tradicional</span>
              </h1>
            )}
          </Link>

          {/* Desktop nav */}
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

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {menuEnabled ? (
              <Link
                href="/menu"
                className="p-2 text-sepia hover:text-terracota transition-colors hidden sm:block"
                aria-label="Buscar en el menu"
              >
                <Search size={20} />
              </Link>
            ) : null}
            {currentUser ? (
              <>
                <Link
                  href={getUserPrimaryHref(currentUser)}
                  className="inline-flex items-center gap-2 rounded-xl border border-beige-tostado/25 px-3 py-2 text-sepia transition-colors hover:border-terracota hover:text-terracota"
                  aria-label={currentUser.role === "admin" ? "Panel admin" : "Mi cuenta"}
                >
                  <UserRound size={18} />
                  <span className="hidden text-sm font-semibold sm:inline">
                    {getUserPrimaryLabel(currentUser)}
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
              aria-label="Carrito"
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

      {/* Mobile menu panel */}
      {mobileOpen ? (
        <div className="md:hidden border-t border-beige-tostado/30 bg-crema">
          <nav className="flex flex-col px-4 py-4 space-y-1">
            {visibleNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${
                  pathname === link.href
                    ? "bg-terracota/10 text-terracota"
                    : "text-sepia hover:bg-beige-tostado/20 hover:text-terracota"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {menuEnabled ? (
              <Link
                href="/menu"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest text-sepia hover:bg-beige-tostado/20 hover:text-terracota transition-colors"
              >
                <Search size={16} />
                Buscar
              </Link>
            ) : null}
          </nav>

          {/* Auth actions in mobile menu */}
          <div className="border-t border-beige-tostado/20 px-4 py-4">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <Link
                  href={getUserPrimaryHref(currentUser)}
                  className="flex items-center gap-2 text-sm font-semibold text-sepia hover:text-terracota transition-colors"
                >
                  <UserRound size={18} />
                  {getUserPrimaryLabel(currentUser)}
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1 text-sm font-semibold text-sepia/60 hover:text-rojo-quemado transition-colors"
                >
                  <LogOut size={16} />
                  Salir
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openAuthModal("Inicia sesion para comprar y consultar tus pedidos.");
                }}
                className="w-full rounded-xl bg-terracota px-4 py-3 text-sm font-bold text-crema transition-colors hover:bg-rojo-quemado"
              >
                Iniciar sesion / Registrarte
              </button>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};
