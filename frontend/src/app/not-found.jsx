import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#05070b] px-6 pt-40 text-center text-white md:px-24">
      <h1 className="text-5xl font-light">404</h1>
      <p className="mt-3 text-white/70">Page not found.</p>
      <Link href="/" className="mt-6 inline-block border border-white/30 px-5 py-2 hover:bg-white/10">Go Home</Link>
    </main>
  );
}

