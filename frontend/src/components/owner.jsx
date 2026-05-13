import { Phone } from "lucide-react";

export default function AboutFounder({
  founderImage,
  name = "Mohamed Kanara",
  role = "Chairman & Founder",
  description = "Under the leadership of Mr. Mohamed Kanara, is an icon in event creation and planning in the UAE and an expert in event management field, with over 14 years of experience in turning events into inspiring experiences.",
  phone = "+971 555 49 2125",
}) {
  const phoneDigits = String(phone || "").replace(/[^\d]/g, "");
  const message = "Hello, I would like to inquire about your services";
  const whatsappLink = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;

  return (
    <section id="about" className="mt-16 pb-20">
      <div className="mx-auto max-w-7xl px-6 bg-[#1B1B1B] py-10 rounded-xl">

        <div className="grid items-center gap-14 md:grid-cols-[360px_1fr]">

          {/* LEFT SIDE - IMAGE */}
          <div className="bg-zinc-300 p-3">
            <div className="bg-zinc-900 p-4">

              <div
                className="relative overflow-hidden 
                [border-radius:80px_80px_40px_40px/120px_120px_40px_40px]"
              >
                <img
                  src={founderImage}
                  alt={name}
                  className="h-[300px] w-full object-cover"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Name inside image */}
                <div className="absolute bottom-10 left-6 right-6 text-white">
                  <h2 className="text-4xl font-extrabold italic leading-none tracking-tight">
                    {String(name).toUpperCase()}
                  </h2>
                </div>

                {/* Bottom cut effect */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-zinc-900 
                  [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)]" />
              </div>

              {/* Title */}
              <p className="text-center text-xs font-bold tracking-[0.2em] text-white/60">
                {String(role).toUpperCase()}
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - CONTENT */}
          <div>
            <h3 className="text-3xl font-light uppercase tracking-wide">
              {name}
            </h3>

            <p className="text-sm uppercase tracking-[0.2em] text-white/60">
              {role}
            </p>

            <p className="mt-8 max-w-4xl text-sm leading-7 text-white/80">
              {description}
            </p>

            {/* WhatsApp Click */}
            <div className="mt-10">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-white/5 px-6 py-4 text-sm text-white/80 backdrop-blur hover:bg-white/10 transition"
              >
                <span className="text-xl">
                  <Phone />
                </span>
                {phone}
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
