"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTiktok, faFacebook } from "@fortawesome/free-brands-svg-icons";
import {
  CalendarCheck2,
  Factory,
  Package,
  PenTool,
  Presentation,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";
import heroImage from "../assets/aboutus/heroImage.png";
import founderImage from "../assets/home/MohamedKanara.jpg";
import aboutus from "../assets/aboutus/hero.png";
import AboutFounder from "../components/owner";
import AnimateIn from "../components/AnimateIn";
import Seo from "../components/Seo";
import { useSiteContent } from "../hooks/useSiteContent";

const services = [
  { icon: CalendarCheck2, label: "PLAN & CONSULTANCY" },
  { icon: PenTool, label: "CREATIVE & DESIGN" },
  { icon: BriefcaseBusiness, label: "EVENT MANAGMENT" },
  { icon: Presentation, label: "EVENT COORDINATOR" },
  { icon: Factory, label: "MANUFACTURE" },
  { icon: Package, label: "PRODUCTION" },
];

function AboutUsPage() {
  const { getText, getImage } = useSiteContent();
  return (
    <main className="bg-[#05070b] text-white">
      <Seo
        title={getText("seo.about.title", "About Us | MK Wedding Planner")}
        description={getText("seo.about.description", "Learn about MK Wedding Planner, our founder, and our creative event planning expertise across the UAE.")}
        keywords={getText("seo.about.keywords", "about wedding planner, UAE events company, event management team")}
        path="/about-us"
      />
      <section className="relative min-h-[280px] w-full bg-cover bg-center md:min-h-[320px]" style={{ backgroundImage: `url(${getImage("about.hero.image", heroImage)})` }}>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 mx-auto flex min-h-[280px] max-w-6xl flex-col px-6 pt-4 md:min-h-[320px] md:px-12">
          <div className="pt-20" />
          <AnimateIn delay={140} className="mb-12 mt-auto text-center">
            <p className="text-xl text-white/90 sm:text-2xl">
              <Link href="/" className="hover:underline">Home</Link> | About us
            </p>
            <h1 className="mt-2 text-4xl font-light sm:text-5xl md:text-6xl">{getText("about.hero.heading", "About us")}</h1>
          </AnimateIn>
        </div>
      </section>

      <section className="px-6 pb-16 pt-14 md:px-12">
        <div className="mx-auto max-w-6xl">
          <AnimateIn><h2 className="text-center text-4xl font-semibold sm:text-5xl md:text-6xl">{getText("about.main.heading", "WE DO IT ALL!")}</h2></AnimateIn>

          <AnimateIn delay={180}>
          <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-[1.25fr_0.7fr]">

            {/* LEFT */}
            <div className="flex flex-col justify-between bg-white/5 p-8 md:p-10">
              <div>
                <p className="text-xl leading-relaxed text-white/90">
                  {getText("about.story.p1", "We were founded by Mr. Mohamed Kanara, an expert wedding planner and an executive. We are now over 50 strong and present across strategic locations in UAE.")}
                </p>
                <p className="mt-7 text-xl leading-relaxed text-white/90">
                  {getText("about.story.p2", "Our accredited planner agency has built a reputation for curating bespoke and luxury events where we handle all planning, event design, and management services.")}
                </p>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm uppercase text-white/70">
                    <FontAwesomeIcon icon={faInstagram} />
                    {getText("about.stats.instagram.label", "Instagram View")}
                  </div>
                  <p className="text-3xl font-semibold">{getText("about.stats.instagram.value", "+ 3 M")}</p>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm uppercase text-white/70">
                    <FontAwesomeIcon icon={faTiktok} />
                    {getText("about.stats.tiktok.label", "Tik Tok View")}
                  </div>
                  <p className="text-3xl font-semibold">{getText("about.stats.tiktok.value", "+ 4.6 M")}</p>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm uppercase text-white/70">
                    <FontAwesomeIcon icon={faFacebook} />
                    {getText("about.stats.facebook.label", "Face Book View")}
                  </div>
                  <p className="text-3xl font-semibold">{getText("about.stats.facebook.value", "+ 2 M")}</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="h-full">
              <img src={getImage("about.section.image", aboutus)} alt="About us" className="h-full w-full object-cover" />
            </div>

          </div>
          </AnimateIn>

          <section id="about" className="mt-16 pb-20">
            <AboutFounder founderImage={founderImage} />
          </section>

        </div>
      </section>

      <section className="px-6 pb-16 md:px-12">
        <div className="mx-auto max-w-5xl">
          <AnimateIn><h2 className="text-center text-4xl font-light sm:text-5xl md:text-6xl">{getText("about.services.heading", "What we do")}</h2></AnimateIn>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <AnimateIn key={service.label} delay={150 + idx * 70}><div className="text-center">
                  <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#102169]">
                    <Icon size={24} />
                  </span>
                  <p className="text-3xl font-semibold">{service.label}</p>
                </div></AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-10 pt-6 text-center md:px-12">
        <p className="text-base text-white/70 sm:text-lg md:text-xl">Are you preparing for your wedding?</p>
        <Link href="/contact-us" className="mt-2 inline-block text-3xl font-light hover:text-white/85 sm:text-6xl md:text-8xl">
          GET IN TOUCH
        </Link>
      </section>
    </main>
  );
}

export default AboutUsPage;



