import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import AnimateIn from "./AnimateIn";

const navItemClass = ({ isActive }) =>
  `relative pb-2 transition ${
    isActive
      ? "text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-white"
      : "text-white/80 hover:text-white"
  }`;

const mobileNavItemClass = ({ isActive }) =>
  `block w-full py-3 px-4 text-lg transition border-b border-white/10 ${
    isActive ? "text-white font-semibold bg-white/10" : "text-white/80 hover:text-white hover:bg-white/5"
  }`;

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change or Escape key
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <AnimateIn delay={80}>
    <header className="relative flex items-center justify-between">
      {/* Logo */}
<Link to="/" onClick={() => setMenuOpen(false)}>
  <img
    src="/logo192.png"
    alt="Wedding Planner logo"
    className="h-[180px] w-[190px] object-contain md:h-[220px] md:w-[220px] lg:h-[250px] lg:w-[250px]"
  />
</Link>

      {/* Desktop Nav */}
      <nav className="hidden gap-14 text-lg lg:flex">
        <NavLink to="/" end className={navItemClass}>Home</NavLink>
        <Link to="/#projects" className="relative pb-2 text-white/80 transition hover:text-white">Projects</Link>
        <NavLink to="/blogs" className={navItemClass}>Blog</NavLink>
        <NavLink to="/about-us" className={navItemClass}>About us</NavLink>
      </nav>

      {/* Desktop CTA */}
      <Link
        to="/contact-us"
        className="hidden border border-white/70 px-8 py-4 text-base text-white hover:bg-white/10 transition lg:block"
      >
        contact us
      </Link>

      {/* Mobile: Hamburger Button */}
      <button
        className="flex flex-col justify-center items-center gap-[5px] w-10 h-10 lg:hidden"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span
          className={`block h-[2px] w-6 bg-white transition-all duration-300 origin-center ${
            menuOpen ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-6 bg-white transition-all duration-300 ${
            menuOpen ? "opacity-0 scale-x-0" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-6 bg-white transition-all duration-300 origin-center ${
            menuOpen ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute top-full left-0 right-0 z-50 overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
      >
        <nav className="flex flex-col">
          <NavLink to="/" end className={mobileNavItemClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <Link to="/#projects" className="block w-full border-b border-white/10 px-4 py-3 text-lg text-white/80 transition hover:bg-white/5 hover:text-white" onClick={() => setMenuOpen(false)}>Projects</Link>
          <NavLink to="/blogs" className={mobileNavItemClass} onClick={() => setMenuOpen(false)}>Blog</NavLink>
          <NavLink to="/about-us" className={mobileNavItemClass} onClick={() => setMenuOpen(false)}>About us</NavLink>
          <div className="p-4">
            <Link
              to="/contact-us"
              className="block text-center border border-white/70 px-8 py-3 text-base text-white hover:bg-white/10 transition"
              onClick={() => setMenuOpen(false)}
            >
              contact us
            </Link>
          </div>
        </nav>
      </div>
    </header>
    </AnimateIn>
  );
}

export default Navbar;
