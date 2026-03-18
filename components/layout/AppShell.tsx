"use client";

import { usePathname } from "next/navigation";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { SiteContent } from "@/types/site-content";

export const AppShell = ({
  children,
  siteContent,
}: {
  children: React.ReactNode;
  siteContent?: SiteContent | null;
}) => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <>
        {children}
        <AuthModal />
      </>
    );
  }

  return (
    <>
      <Header siteContent={siteContent} />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CartDrawer
        orderingEnabled={siteContent?.operations.isOrderingEnabled}
        checkoutMessage={siteContent?.operations.checkoutMessage}
      />
      <AuthModal />
    </>
  );
};
