"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

function getLinks(pathname: string) {
  if (pathname.startsWith("/pharmacy")) {
    return [
      { href: "/pharmacy/dashboard", label: "Vue d'ensemble" },
      { href: "/pharmacy/profile", label: "Profil pharmacie" },
      { href: "/pharmacy/medicines", label: "Medicaments" },
      { href: "/search", label: "Recherche" }
    ];
  }

  if (pathname.startsWith("/doctor")) {
    return [
      { href: "/doctor/search", label: "Recherche medecin" },
      { href: "/doctor/profile", label: "Profil medecin" },
      { href: "/about", label: "A propos" },
      { href: "/contact", label: "Contact" }
    ];
  }

  if (pathname.startsWith("/admin")) {
    return [
      { href: "/admin", label: "Admin" },
      { href: "/pharmacy/dashboard", label: "Pharmacie" },
      { href: "/search", label: "Recherche" },
      { href: "/contact", label: "Contact" }
    ];
  }

  return [
    { href: "/search", label: "Recherche" },
    { href: "/about", label: "A propos" },
    { href: "/contact", label: "Contact" }
  ];
}

export function DashboardNav() {
  const pathname = usePathname();
  const links = getLinks(pathname);

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = pathname === link.href;

        return (
          <Link key={link.href} href={link.href} className={`nav-pill ${active ? "nav-pill-active" : ""}`}>
            <span className="relative z-10">{link.label}</span>
            {active ? <motion.span layoutId="dashboard-nav-indicator" className="nav-pill-indicator" transition={{ type: "spring", stiffness: 340, damping: 28 }} /> : null}
          </Link>
        );
      })}
    </nav>
  );
}
