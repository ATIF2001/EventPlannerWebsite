"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../services/api";
import Seo from "../components/Seo";

function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await loginAdmin(form);
      localStorage.setItem("adminToken", response.token);
      router.push("/admin");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#05070b] px-6 py-24 text-white md:px-12 md:py-32 flex items-center justify-center">
      <Seo title="Admin Login | MK Wedding Planner" path="/login" noindex />
      <div className="w-full max-w-xl rounded-xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-4xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-white/70">Login to manage blog posts.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border border-white/20 bg-black/30 p-3 outline-none"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            className="w-full rounded-lg border border-white/20 bg-black/30 p-3 outline-none"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          {error ? <p className="text-red-400">{error}</p> : null}
          <button className="rounded-lg bg-white px-6 py-3 font-semibold text-black" disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;

