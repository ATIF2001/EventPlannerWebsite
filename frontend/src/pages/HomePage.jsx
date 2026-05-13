import ContactForm from "../components/ContactForm";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faTiktok, faInstagram, faSnapchat } from "@fortawesome/free-brands-svg-icons";
import heroVideo from "../assets/HeroSection.mp4";
import corporateImage from "../assets/home/corporate.png";
import weddingImage from "../assets/home/wedding.png";
import outdoorImage from "../assets/home/outdoor.png";
import founderImage from "../assets/home/MohamedKanara.jpg";
import { Box, Brush, CalendarCheck2, Disc3, Handshake, Palette, PartyPopper, Printer } from "lucide-react";
import { Mail } from "lucide-react";
import ServiceCard from "../components/ServiceCard";
import AboutFounder from "../components/owner";
import AnimateIn from "../components/AnimateIn";
import Seo from "../components/Seo";
import { SITE_URL } from "../config/site";
import { HeroSection } from "../components/ui/feature-carousel";
import { useSiteContent } from "../hooks/useSiteContent";
import home1 from "../assets/home/1.png";
import home2 from "../assets/home/2.png";
import home3 from "../assets/home/3.png";

const projects = [
  { title: "Corporate", image: corporateImage, slug: "corporate" },
  { title: "Wedding", image: weddingImage, slug: "wedding" },
  { title: "Outdoor", image: outdoorImage, slug: "outdoor" },
];

const homeCarouselImages = [
  { src: home1, alt: "Home carousel image 1" },
  { src: home2, alt: "Home carousel image 2" },
  { src: home3, alt: "Home carousel image 3" },
];

const services = [
  { label: "3D designs & rendering", icon: Box, color: "#818cf8" },
  { label: "DJs", icon: Disc3, color: "#f87171" },
  { label: "Promoters & models", icon: PartyPopper, color: "#a3e635" },
  { label: "Event manager/planner", icon: CalendarCheck2, color: "#fbbf24" },
  { label: "Decorators", icon: Brush, color: "#34d399" },
  { label: "Coordinates with suppliers", icon: Handshake, color: "#22d3ee" },
  { label: "Graphic Designs", icon: Palette, color: "#c084fc" },
  { label: "Print Collateral", icon: Printer, color: "#60a5fa" },
];

const section = "app-shell";

function HomePage() {
  const location = useLocation();
  const { getText, getImage } = useSiteContent();

  const homeProjects = [
    {
      title: getText("home.projects.corporate.title", "Corporate"),
      image: getImage("home.projects.corporate.image", projects[0].image),
      slug: "corporate",
    },
    {
      title: getText("home.projects.wedding.title", "Wedding"),
      image: getImage("home.projects.wedding.image", projects[1].image),
      slug: "wedding",
    },
    {
      title: getText("home.projects.outdoor.title", "Outdoor"),
      image: getImage("home.projects.outdoor.image", projects[2].image),
      slug: "outdoor",
    },
  ];

  const dynamicCarouselImages = [
    { src: getImage("home.carousel.image1", homeCarouselImages[0].src), alt: "Home carousel image 1" },
    { src: getImage("home.carousel.image2", homeCarouselImages[1].src), alt: "Home carousel image 2" },
    { src: getImage("home.carousel.image3", homeCarouselImages[2].src), alt: "Home carousel image 3" },
  ];

  const whatsappUrl = getText("home.social.whatsapp", "https://wa.me/971555442125");
  const tiktokUrl = getText("home.social.tiktok", "https://tiktok.com/@mk.4events");
  const instagramUrl = getText("home.social.instagram", "https://www.instagram.com/mk.4events?igsh=MThnc3ZpdHM3cGV4cQ==");
  const snapchatUrl = getText("home.social.snapchat", "https://www.snapchat.com/add/mk4events?share_id=mE8wrDeFJy8&locale=en-GB");
  const whatsappHeroLabel = getText("home.hero.whatsappLabel", "Let's talk");
  const contactPhone = getText("home.contact.phone", "+971 555 44 2125");
  const contactEmail = getText("home.contact.email", "Mk4events.info@gmail.com");
  const contactAddress = getText("home.contact.address", "Wasit St - Al Shahba - Mughaider Suburb - Sharjah");

  useEffect(() => {
    if (location.hash === "#projects") {
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <main className="text-white">
      <Seo
        title={getText("seo.home.title", "Home | MK Wedding Planner")}
        description={getText("seo.home.description", "Luxury wedding planning, corporate events, and outdoor celebrations crafted by MK Wedding Planner.")}
        keywords={getText("seo.home.keywords", "wedding planner UAE, luxury events, corporate events, outdoor events")}
        path="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MK Wedding Planner",
          url: SITE_URL,
          logo: `${SITE_URL}/logo192.png`,
          sameAs: [
            "https://tiktok.com/@mk.4events",
            "https://www.instagram.com/mk.4events?igsh=MThnc3ZpdHM3cGV4cQ==",
            "https://www.snapchat.com/add/mk4events?share_id=mE8wrDeFJy8&locale=en-GB",
          ],
        }}
      />

      <section className="relative min-h-screen overflow-hidden">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline src={heroVideo} />
        <div className="absolute inset-0 bg-black/35" />
        <div className="pointer-events-none absolute -left-20 top-28 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse" />

        <div className={`relative z-10 flex min-h-screen flex-col justify-end pb-20 pt-24 ${section}`}>
          <AnimateIn delay={150} className="max-w-3xl">
            <p className="mb-4 inline-block rounded-full border border-white/25 bg-black/30 px-4 py-1 text-sm tracking-[0.15em] text-white/80">
              {getText("home.hero.badge", "Luxury Event Architecture")}
            </p>
            <h1 className="text-3xl font-light leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {getText("home.hero.heading", "Bespoke Wedding Planning")}
              <span className="block text-white/80">{getText("home.hero.subheading", "Crafted With Precision")}</span>
            </h1>
          </AnimateIn>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Contact us on WhatsApp"
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-white sm:right-5"
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366] shadow-[0_8px_22px_rgba(37,211,102,0.45)] sm:h-16 sm:w-16">
              <FontAwesomeIcon icon={faWhatsapp} className="text-xl sm:text-2xl" />
            </span>
            <span className="hidden text-3xl font-semibold leading-none [writing-mode:vertical-rl] [text-orientation:mixed] sm:inline sm:text-4xl">
              {whatsappHeroLabel}
            </span>
          </div>
        </a>
      </section>

      <section id="projects" className={`${section} py-16 md:py-20`}>
        <AnimateIn delay={120}>
          <h2 className="mb-12 text-center text-3xl font-light md:mb-24 md:text-6xl">{getText("home.projects.heading", "The Projects")}</h2>
        </AnimateIn>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:items-end">
          {homeProjects.map((project) => (
            <AnimateIn key={project.title} delay={180}>
              {/* Card */}
        <Link
  to={`/projects/${project.slug}`}
  className={`group relative flex flex-col overflow-hidden rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(0,0,0,0.65)] ${
    project.title === "Wedding" ? "sm:col-span-2 md:col-span-1 md:-mb-16 md:-mt-16" : ""
  }`}
>
  <img
    src={project.image}
    alt={project.title}
    className={`block w-full object-cover transition duration-700 group-hover:scale-[1.04] ${
      project.title === "Wedding"
        ? "h-[340px] sm:h-[420px] md:h-[700px]"
        : "h-[280px] sm:h-[340px] md:h-[500px]"
    }`}
  />
<div className="flex justify-center py-3 transition duration-700 group-hover:tracking-widest">
  <span className="text-2xl font-light text-white md:text-4xl">{project.title}</span>
</div>
</Link>

              {/* Title below the card */}
        
            </AnimateIn>
          ))}
        </div>

      
      </section>

      <section className="px-24">
          <AnimateIn delay={220}>
          <HeroSection title={""} subtitle="" images={dynamicCarouselImages} className="min-h-[520px] py-0" />
        </AnimateIn>
      </section>

      <section id="about" className={`${section} mt-16 pb-20 `}>
        <AboutFounder
          founderImage={getImage("home.about.image", founderImage)}
          name={getText("home.about.name", "Mohamed Kanara")}
          role={getText("home.about.role", "Chairman & Founder")}
          description={getText(
            "home.about.description",
            "Under the leadership of Mr. Mohamed Kanara, is an icon in event creation and planning in the UAE and an expert in event management field, with over 14 years of experience in turning events into inspiring experiences."
          )}
          phone={getText("home.about.phone", "+971 555 49 2125")}
        />
      </section>

      <section className={`${section} pb-20 max-w-7xl mx-auto`}>
        <AnimateIn>
          <h2 className="mb-16 text-center text-3xl font-light md:text-4xl">Services</h2>
        </AnimateIn>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
          {services.map((service) => (
            <AnimateIn key={service.label} delay={150}>
              <ServiceCard {...service} />
            </AnimateIn>
          ))}
        </div>
      </section>

      <section id="contact" className={`${section} pb-20 max-w-7xl mx-auto`}>
        <AnimateIn>
          <h2 className="mb-10 text-center text-3xl font-light md:text-4xl">{getText("home.contact.heading", "Contact us")}</h2>
        </AnimateIn>
        <div className="grid gap-6 md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr]">
          <aside className="rounded-md bg-zinc-900/70 p-6 sm:p-8">
            <h3 className="text-xl">Contact Info</h3>
            <div className="mt-8 space-y-6 text-sm text-white/75">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <FontAwesomeIcon icon={faWhatsapp} />
                <span>{contactPhone}</span>
              </a>
              <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail size={16} />
                <span>{contactEmail}</span>
              </a>
              <p>{contactAddress}</p>
            </div>
            <div className="mt-8 flex gap-3">
              <a href={tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href={snapchatUrl} target="_blank" rel="noreferrer" aria-label="Snapchat" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm">
                <FontAwesomeIcon icon={faSnapchat} />
              </a>
            </div>
          </aside>
          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;


