"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import blogHero from "../assets/blog/blog.png";
import { fetchPublishedBlogs } from "../services/api";
import AnimateIn from "../components/AnimateIn";
import Seo from "../components/Seo";
import { useSiteContent } from "../hooks/useSiteContent";

function BlogPage({ initialBlogs = [] }) {
  const { getText, getImage } = useSiteContent();
  const hasInitial = Array.isArray(initialBlogs) && initialBlogs.length > 0;
  const [blogs, setBlogs] = useState(Array.isArray(initialBlogs) ? initialBlogs : []);
  const [loading, setLoading] = useState(!hasInitial);
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasInitial) return;
    async function load() {
      try {
        const items = await fetchPublishedBlogs();
        setBlogs(items);
      } catch (_) {
        setError("No blogs available");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [hasInitial]);

  return (
    <main className="bg-[#06080d] text-white">
      <Seo
        title={getText("seo.blog.title", "Blogs | MK Wedding Planner")}
        description={getText("seo.blog.description", "Read event inspiration, wedding planning insights, and latest updates from MK Wedding Planner.")}
        keywords={getText("seo.blog.keywords", "wedding planning blog, event tips, UAE wedding ideas")}
        path="/blogs"
      />
      <section className="relative min-h-[430px] bg-cover bg-center" style={{ backgroundImage: `url(${getImage("blog.hero.image", blogHero)})` }}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex min-h-[430px] flex-col px-6 pt-6 md:px-12">
          <div className="pt-20" />
          <AnimateIn delay={140} className="mb-12 mt-auto text-center">
            <p className="text-xl text-white/90 sm:text-2xl md:text-3xl">
              <Link href="/" className="hover:underline">Home</Link> | Blog
            </p>
            <h1 className="mt-2 text-4xl font-light sm:text-5xl md:text-7xl">{getText("blog.hero.heading", "BLOGS")}</h1>
          </AnimateIn>
        </div>
      </section>

      <section className="px-6 pb-20 pt-16 md:px-12">
        <AnimateIn><h2 className="text-center text-3xl font-light sm:text-4xl md:text-5xl">{getText("blog.list.heading", "Read our latest published blogs")}</h2></AnimateIn>

        {loading ? <p className="mt-8 text-center text-white/70">Loading blogs...</p> : null}
        {!loading && error ? <p className="mt-8 text-center text-white/70">{error}</p> : null}
        {!loading && !error && blogs.length === 0 ? <p className="mt-8 text-center text-white/70">No blogs available</p> : null}

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blogs.map((blog, idx) => (
            <AnimateIn key={blog.id} delay={150 + idx * 80}>
            <article className="overflow-hidden rounded-sm border border-white/15 bg-white/5 shadow-lg">
              {blog.featuredImage ? (
                <img src={blog.featuredImage} alt={blog.title} className="h-60 w-full object-cover" />
              ) : null}
              <div className="p-5">
                <h3 className="text-2xl font-semibold leading-snug md:text-3xl">{blog.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-white/85">{blog.description}</p>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <Link href={`/blogs/${blog.slug}`} className="font-semibold underline">
                    Read more
                  </Link>
                </div>
              </div>
            </article>
            </AnimateIn>
          ))}
        </div>
      </section>

      <section className="px-6 pb-10 text-center md:px-12">
        <p className="text-base text-white/70 sm:text-lg md:text-xl">Are you preparing for your wedding?</p>
        <Link href="/contact-us" className="mt-2 inline-block text-3xl font-light hover:text-white/85 sm:text-6xl md:text-8xl">
          GET IN TOUCH
        </Link>
      </section>
    </main>
  );
}

export default BlogPage;



