"use client";

export default function Error({ error, reset }) {
  return (
    <main className="min-h-screen bg-[#05070b] px-6 pt-40 text-white md:px-24">
      <h1 className="text-3xl">Something went wrong</h1>
      <p className="mt-3 text-white/70">{error?.message || "Unexpected error"}</p>
      <button onClick={reset} className="mt-6 rounded border border-white/20 px-4 py-2 hover:bg-white/10">Try again</button>
    </main>
  );
}

