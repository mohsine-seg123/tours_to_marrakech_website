"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Heart, Mail, Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "../ui/LanguageSwitcher";

type DropdownItem = {
  href: string;
  label: string;
};

type NavLink = {
  href: string;
  label: string;
  dropdown?: DropdownItem[];
};

const CONTACT = {
  phone: "+212 6 15683217",
  phoneHref: "tel:+212615683217",
  email: "info@toursmarrakechdesert.com",
  emailHref: "mailto:info@toursmarrakechdesert.com",
};

const TOURS_DROPDOWN: DropdownItem[] = [
  { href: "/tours/from/marrakech", label: "Tours from Marrakech" },
  { href: "/tours/from/fes", label: "Tours from Fes" },
  { href: "/tours/from/casablanca", label: "Tours from Casablanca" },
  { href: "/tours/from/tangier", label: "Tours from Tangier" },
  { href: "/tours/from/agadir", label: "Tours from Agadir" },
  { href: "/tours", label: "All Tours" },
];

const ABOUT_DROPDOWN: DropdownItem[] = [
  { href: "/about", label: "About Tours Marrakech Desert" },
  { href: "/about/morocco_tourist", label: "About Morocco Tourist" },
];



const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours", dropdown: TOURS_DROPDOWN },
  { href: "/day-trips", label: "Day Trips" },
  { href: "/activities", label: "Activities" },
  { href: "/customize-your-tour", label: "Customize Your Tour" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us", dropdown: ABOUT_DROPDOWN },
  { href: "/contact", label: "Contact" },
];


function isLinkActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export default function Header(): React.JSX.Element {
  const pathname = usePathname();
  return <HeaderContent key={pathname} pathname={pathname} />;
}

function HeaderContent({ pathname }: { pathname: string }): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const closeMobileMenu = (): void => {
    setIsOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isSolid = isOpen;

  return (
    <>
      <header className="sticky top-0 z-[100] w-full">
        <div
          className={`transition-all duration-300 ${isSolid ? "border-b border-border bg-background/95 shadow-sm backdrop-blur-md" : "border-b border-transparent bg-background/80 backdrop-blur-sm"}`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-20 lg:px-8">
            <Logo onClick={closeMobileMenu} />

            <DesktopNav pathname={pathname} />

            <div className="hidden items-center gap-2 lg:flex">
              <FavoritesButton />
               <LanguageSwitcher />
            </div>

            <MobileMenuButton
              isOpen={isOpen}
              onToggle={() => setIsOpen((current) => !current)}
            />
          </div>
        </div>

        {isOpen && (
          <MobileNav pathname={pathname} onCloseMobileMenu={closeMobileMenu} />
        )}
      </header>
    </>
  );
}

function Logo({ onClick }: { onClick?: () => void }): React.JSX.Element {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="Trips To Marrakech home"
    >
      <Image
        src="/logo.png"
        alt="Trips to Marrakech logo"
        width={100}
        height={26}
        priority
        quality={75}
        sizes="(max-width: 1023px) 112px, 144px"
        className="h-auto w-16 lg:w-24"
      />
    </Link>
  );
}

function FavoritesButton() {
  return (
    <Link
      href="/favorites"
      className="group relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      aria-label="Favorites"
    >
      <span className="relative">
        <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
      </span>
      <span className="text-xs font-medium">Favorites</span>
    </Link>
  );
}


function MobileMenuButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}

function DesktopNav({ pathname }: { pathname: string }): React.JSX.Element {
  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
      {NAV_LINKS.map((link) => {
        const isActive = isLinkActive(pathname, link.href);

        // ⬇️ Si le lien a un dropdown → afficher le composant dropdown
        if (link.dropdown) {
          return (
            <DesktopDropdown
              key={link.href}
              link={link}
              isActive={isActive}
              pathname={pathname}
            />
          );
        }

        // Sinon → lien simple (code inchangé)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative rounded-lg px-3.5 py-2 text-sm font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive ? "text-primary" : "text-foreground hover:bg-muted hover:text-primary"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

// ⬇️ NOUVEAU COMPOSANT : dropdown desktop au hover
function DesktopDropdown({
  link,
  isActive,
  pathname,
}: {
  link: NavLink;
  isActive: boolean;
  pathname: string;
}): React.JSX.Element {
  return (
    <div className="group relative">
      <Link
        href={link.href}
        aria-current={isActive ? "page" : undefined}
        className={`relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isActive ? "text-primary" : "text-foreground hover:bg-muted hover:text-primary"
        }`}
      >
        {link.label}
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180"
          aria-hidden="true"
        />
      </Link>

      {/* Menu dropdown */}
      <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <ul className="min-w-[240px] rounded-xl border border-border bg-card p-2 shadow-lg">
          {link.dropdown?.map((item) => {
            const isItemActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isItemActive
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-muted hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function MobileNav({
  pathname,
  onCloseMobileMenu,
}: {
  pathname: string;
  onCloseMobileMenu: () => void;
}): React.JSX.Element {
  return (
    <nav
      id="mobile-menu"
      aria-label="Mobile navigation"
      className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-card shadow-xl lg:hidden"
    >
      <ul className="flex flex-col gap-1 px-4 py-5">
        {NAV_LINKS.map((link) => {
          const isActive = isLinkActive(pathname, link.href);

          // ⬇️ Si dropdown → afficher accordéon mobile
          if (link.dropdown) {
            return (
              <MobileDropdown
                key={link.href}
                link={link}
                isActive={isActive}
                pathname={pathname}
                onCloseMobileMenu={onCloseMobileMenu}
              />
            );
          }

          // Sinon → lien simple
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onCloseMobileMenu}
                aria-current={isActive ? "page" : undefined}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Contact + bouton */}
      <div className="border-t border-border px-4 py-4">
        <div className="mb-4 flex flex-col gap-3">
          <a
            href={CONTACT.phoneHref}
            onClick={onCloseMobileMenu}
            className="flex items-center gap-3 text-sm text-text-secondary transition-colors hover:text-primary"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-muted text-primary">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="font-medium">{CONTACT.phone}</span>
          </a>
          <a
            href={CONTACT.emailHref}
            onClick={onCloseMobileMenu}
            className="flex items-center gap-3 text-sm text-text-secondary transition-colors hover:text-primary"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-muted text-primary">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="font-medium">{CONTACT.email}</span>
          </a>
        </div>
        <LanguageSwitcher />
      </div>
    </nav>
  );
}

// ⬇️ NOUVEAU COMPOSANT : accordéon dropdown mobile
function MobileDropdown({
  link,
  isActive,
  pathname,
  onCloseMobileMenu,
}: {
  link: NavLink;
  isActive: boolean;
  pathname: string;
  onCloseMobileMenu: () => void;
}): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li>
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-text-secondary hover:bg-muted hover:text-foreground"
        }`}
      >
        <span>{link.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isExpanded && (
        <ul className="mt-1 flex flex-col gap-0.5 pl-4">
          {link.dropdown?.map((item) => {
            const isItemActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onCloseMobileMenu}
                  className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isItemActive
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}