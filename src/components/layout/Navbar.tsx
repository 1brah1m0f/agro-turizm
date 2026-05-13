"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Leaf } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/", label: "Ana Səhifə" },
  { href: "#activities", label: "Fəaliyyətlər" },
  { href: "#entrepreneurs", label: "Sahibkarlar" },
  { href: "#about", label: "Haqqımızda" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-primary/95 backdrop-blur-[12px] border-b border-accent/20"
        : "bg-primary border-b border-accent/10"
    )}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-main flex items-center justify-center group-hover:scale-105 transition-transform">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-serif font-bold text-xl text-text-dark">FarMorfX</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="text-sm text-muted hover:text-accent transition-colors font-medium">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"><Button variant="ghost" size="sm">Daxil ol</Button></Link>
          <Link href="/register"><Button size="sm">Qeydiyyat</Button></Link>
        </div>

        <button className="md:hidden text-text-dark hover:text-accent transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-primary border-t border-accent/20 px-6 py-6 flex flex-col gap-6">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="text-text-dark hover:text-accent transition-colors font-medium text-lg">
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-accent/20">
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full">Daxil ol</Button>
            </Link>
            <Link href="/register" onClick={() => setMenuOpen(false)}>
              <Button className="w-full">Qeydiyyat</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
