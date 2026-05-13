import ContactUsSection from "../components/ContactUsSection";
import contactHero from "../assets/contactus/Hero.jpg";
import AnimateIn from "../components/AnimateIn";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { useSiteContent } from "../hooks/useSiteContent";

function ContactUsPage() {
  const { getText, getImage } = useSiteContent();
  return (
    <main className="bg-black text-white">
      <Seo
        title={getText("seo.contact.title", "Contact Us | MK Wedding Planner")}
        description={getText("seo.contact.description", "Contact MK Wedding Planner for weddings, corporate events, and outdoor event planning in UAE.")}
        keywords={getText("seo.contact.keywords", "contact wedding planner, book event planner UAE, event consultation")}
        path="/contact-us"
      />
      <section
        className="relative min-h-[440px] bg-cover bg-center"
        style={{ backgroundImage: `url(${getImage("contact.hero.image", contactHero)})` }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 flex min-h-[440px] flex-col items-center justify-center px-6 pt-24 text-center md:px-12">
          <AnimateIn delay={120}>
            <p className="mb-3 text-xl text-white/90 sm:text-2xl md:text-3xl">
              <Link to="/" className="hover:underline">Home</Link> | Contact us
            </p>
            <h1 className="text-4xl font-light leading-none sm:text-5xl md:text-7xl">{getText("contact.hero.heading", "Contact us")}</h1>
          </AnimateIn>
        </div>
      </section>

      <ContactUsSection />
    </main>
  );
}

export default ContactUsPage;


