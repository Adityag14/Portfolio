import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navItems = [
  { name: "Profile", url: "#about" },
  { name: "Experience", url: "#experience" },
  { name: "Recognition", url: "#recognition" },
  { name: "Toolkit", url: "#skills" },
  { name: "Work", url: "#projects" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="site-nav fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a className="brand-mark" href="#home" aria-label="Aditya Gawande, home">
          <span className="brand-monogram">AG</span>
          <span className="hidden sm:inline">ADITYA GAWANDE</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => <a className="nav-link" href={item.url} key={item.name}>{item.name}</a>)}
          <a className="nav-contact" href="#contact">LET&apos;S TALK <ArrowUpRight size={14} /></a>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-button md:hidden" aria-label={isMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMenuOpen}>
          {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="mobile-nav md:hidden">
          {navItems.map((item) => <a href={item.url} onClick={() => setIsMenuOpen(false)} key={item.name}>{item.name}</a>)}
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Let&apos;s talk <ArrowUpRight size={15} /></a>
        </div>
      )}
    </nav>
  );
};