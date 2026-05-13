"use client";

import { useState } from "react";
import { submitContactForm } from "../services/api";

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

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
      setStatus({
        type: "success",
        message: "Message sent successfully. We have received your inquiry.",
      });
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setStatus({ type: "error", message: apiMessage || "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="border border-white/20 p-6 md:p-10" onSubmit={handleSubmit}>
      <div className="space-y-8">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-white/70">Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border-b border-white/30 bg-transparent pb-2 text-sm text-white outline-none transition focus:border-white"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-white/70">Phone Number</span>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border-b border-white/30 bg-transparent pb-2 text-sm text-white outline-none transition focus:border-white"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-white/70">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border-b border-white/30 bg-transparent pb-2 text-sm text-white outline-none transition focus:border-white"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-white/70">Message</span>
          <textarea
            rows="3"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full resize-none border-b border-white/30 bg-transparent pb-2 text-sm text-white outline-none transition focus:border-white"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 rounded-full border border-white/60 px-6 py-2 text-sm text-white transition hover:bg-white hover:text-black"
      >
        {isSubmitting ? "Sending..." : "Submit"}
      </button>
      {status.message ? (
        <p className={`mt-4 text-sm ${status.type === "success" ? "text-green-300" : "text-red-300"}`}>
          {status.message}
        </p>
      ) : null}
    </form>
  );
}

export default ContactForm;

