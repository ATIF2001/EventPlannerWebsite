"use client";

import { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { submitContactForm } from "../services/api";
import { useSiteContent } from "../hooks/useSiteContent";

function ContactUsSection() {
  const { getText } = useSiteContent();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const contactPhone = getText(
    "contact.info.phone",
    getText("home.contact.phone", "+971 555 44 2125")
  );
  const contactAddress = getText(
    "contact.info.address",
    getText("home.contact.address", "Wasit St - Al Shahba - Mughaider Suburb - Sharjah")
  );
  const mapEmbedUrl = getText(
    "contact.info.mapEmbedUrl",
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.1155457557015!2d55.4220769112468!3d25.333903477529844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f59105d6273e7%3A0xa4b4674ace9926ef!2sMK%204%20Events!5e0!3m2!1sen!2sae!4v1777880978038!5m2!1sen!2sae"
  );
  const mapPinUrl = getText("contact.info.mapPinUrl", "https://maps.app.goo.gl/NzuBzjCqFad29DM68");
  const phoneDigits = String(contactPhone || "").replace(/[^\d]/g, "");
  const whatsappUrl = phoneDigits ? `https://wa.me/${phoneDigits}` : "https://wa.me/971555442125";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      await submitContactForm(form);
      setStatus({ type: "success", message: "Message sent successfully. Please check your email for confirmation." });
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setStatus({ type: "error", message: apiMessage || "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-[#06080d] px-6 pb-20 pt-16 text-white md:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.82fr]">
        <form className="border border-white/30 p-8 md:p-12" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <label className="block">
              <span className="mb-2 block text-4xl leading-none text-white/95 md:text-[2rem]">Name</span>
              <input className="w-full border-b border-white/35 bg-transparent pb-2 outline-none" type="text" name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label className="block">
              <span className="mb-2 block text-4xl leading-none text-white/95 md:text-[2rem]">Phone Number</span>
              <input className="w-full border-b border-white/35 bg-transparent pb-2 outline-none" type="tel" name="phone" value={form.phone} onChange={handleChange} required />
            </label>
            <label className="block">
              <span className="mb-2 block text-4xl leading-none text-white/95 md:text-[2rem]">Email</span>
              <input className="w-full border-b border-white/35 bg-transparent pb-2 outline-none" type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label className="block">
              <span className="mb-2 block text-4xl leading-none text-white/95 md:text-[2rem]">Message</span>
              <textarea rows="4" className="w-full resize-none border-b border-white/35 bg-transparent pb-2 outline-none" name="message" value={form.message} onChange={handleChange} required />
            </label>
          </div>
          <button className="mt-8 rounded-full bg-white px-9 py-3 text-xl text-black disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
          {status.message ? (
            <p className={`mt-4 text-sm ${status.type === "success" ? "text-green-300" : "text-red-300"}`}>
              {status.message}
            </p>
          ) : null}
        </form>

        <div className="overflow-hidden rounded-md border border-white/10 bg-[#111722]">
          <div className="h-full min-h-[520px] bg-[radial-gradient(circle_at_30%_20%,#2d3748_0%,#141922_35%,#0c1018_80%)] p-5">
            <div className="h-full w-full overflow-hidden rounded-md border border-white/10">
              <iframe
                title="MK 4 Events Location"
                src={mapEmbedUrl}
                className="h-full min-h-[520px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-5 rounded-full bg-white/5 px-8 py-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-4 text-xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Phone size={22} />
          </span>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:underline">
            {contactPhone}
          </a>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 text-xl">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <MapPin size={22} />
            </span>
            <a
              href={mapPinUrl}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              {contactAddress}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUsSection;

