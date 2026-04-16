import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";

import { defaultSiteContent } from "@/data/site-content";
import type { SiteContent } from "@/types/site-content";

export const Footer = ({ siteContent }: { siteContent?: SiteContent | null }) => {
  const footer = siteContent?.footer ?? defaultSiteContent.footer;

  return (
    <footer className="bg-sepia py-20 text-crema">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold italic text-terracota">
              {footer.brandTitle} <span className="font-normal not-italic text-crema">{footer.brandHighlight}</span>
            </h2>
            <p className="leading-relaxed text-crema/60">{footer.description}</p>
            <div className="flex space-x-4">
              <a
                href={footer.instagramUrl || "#"}
                className="rounded-full bg-crema/10 p-2 transition-colors hover:bg-terracota"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={footer.facebookUrl || "#"}
                className="rounded-full bg-crema/10 p-2 transition-colors hover:bg-terracota"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={footer.twitterUrl || "#"}
                className="rounded-full bg-crema/10 p-2 transition-colors hover:bg-terracota"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-bold uppercase tracking-widest text-mostaza">{footer.linksTitle}</h4>
            <ul className="space-y-4 text-crema/70">
              <li>
                <Link href="/menu" className="transition-colors hover:text-crema">
                  {footer.menuLabel}
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="transition-colors hover:text-crema">
                  {footer.aboutLabel}
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="transition-colors hover:text-crema">
                  {footer.contactLabel}
                </Link>
              </li>
              <li>
                <Link href="/mi-cuenta" className="transition-colors hover:text-crema">
                  {footer.accountLabel}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="transition-colors hover:text-crema">
                  {footer.adminLabel}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-bold uppercase tracking-widest text-mostaza">{footer.contactTitle}</h4>
            <ul className="space-y-4 text-crema/70">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="flex-shrink-0 text-terracota" />
                <span>{footer.addressValue}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="flex-shrink-0 text-terracota" />
                <span>{footer.phoneValue}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="flex-shrink-0 text-terracota" />
                <span>{footer.emailValue}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-bold uppercase tracking-widest text-mostaza">{footer.hoursTitle}</h4>
            <ul className="space-y-4 text-crema/70">
              {footer.schedule.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>{item.label}</span>
                  <span className="text-right text-crema">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-crema/10 pt-8 text-sm text-crema/40 md:flex-row">
          <p>{footer.copyrightText}</p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <a href="#" className="hover:text-crema">
              {footer.privacyLabel}
            </a>
            <a href="#" className="hover:text-crema">
              {footer.termsLabel}
            </a>
            <a href="#" className="hover:text-crema">
              {footer.cookiesLabel}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
