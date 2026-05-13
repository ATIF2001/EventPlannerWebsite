"use client";

import Link from "next/link";
import AnimateIn from "./AnimateIn";
import { useSiteContent } from "../hooks/useSiteContent";

function Footer() {
  const { getText, getImage } = useSiteContent();
  return (
    <footer className="border-t border-white/10 bg-[#06080d] px-12 py-16 md:px-24 md:py-20">
      <AnimateIn delay={100}>
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
      <img
  src={getImage("footer.logo", "/logo192.png")}
  alt="Wedding Planner logo"
  className="h-20 w-20 object-contain sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-44 lg:w-44 xl:h-52 xl:w-52"
/>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/65">
            {getText("footer.description", "Curating elegant weddings and immersive celebrations with refined design, flawless coordination, and unforgettable guest experiences.")}
          </p>
        </div>

        <div>
          <h4 className="border-b border-white/15 pb-2 text-sm uppercase tracking-[0.22em] text-white/70">
            Services
          </h4>
          <ul className="mt-5 space-y-3 text-base text-white/85">
            <li><Link href="/projects/corporate">Corporate</Link></li>
            <li><Link href="/projects/wedding">Wedding</Link></li>
            <li><Link href="/projects/outdoor">Outdoor</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="border-b border-white/15 pb-2 text-sm uppercase tracking-[0.22em] text-white/70">
            Resources
          </h4>
          <ul className="mt-5 space-y-3 text-base text-white/85">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/projects/corporate">Projects</Link></li>
            <li><Link href="/blogs">Blogs</Link></li>
            <li><Link href="/about-us">About us</Link></li>
          </ul>
      
        </div>
      </div>
      </AnimateIn>
    </footer>
  );
}

export default Footer;



