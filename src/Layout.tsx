import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow flex items-center justify-center py-2">
        <div className="flex gap-6 text-base font-semibold">
          <a href="#about" onClick={e => handleNavClick(e, "about")}>About</a>
          <a href="#how" onClick={e => handleNavClick(e, "how")}>How It Works</a>
          <a href="#features" onClick={e => handleNavClick(e, "features")}>Features</a>
          <a href="#testimonials" onClick={e => handleNavClick(e, "testimonials")}>Testimonials</a>
          <a href="#faq" onClick={e => handleNavClick(e, "faq")}>FAQ</a>
          <a href="#contact" onClick={e => handleNavClick(e, "contact")}>Contact</a>
        </div>
      </nav>
      {children}
    </>
  );
}
