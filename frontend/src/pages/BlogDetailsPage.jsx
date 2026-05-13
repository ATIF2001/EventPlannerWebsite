import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBlogBySlug } from "../services/api";
import AnimateIn from "../components/AnimateIn";
import Seo from "../components/Seo";
import { SITE_URL } from "../config/site";
import { useSiteContent } from "../hooks/useSiteContent";

function BlogDetailsPage() {
  const { slug = "" } = useParams();
  const { getText } = useSiteContent();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const item = await fetchBlogBySlug(slug);
        setBlog(item);
      } catch (err) {
        setError(err?.response?.data?.message || "Blog not found");
      } finally {
        setLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  if (loading) return <main className="min-h-screen overflow-x-hidden bg-[#05070b] px-6 pt-40 text-white md:px-24"><Seo title="Loading Blog | MK Wedding Planner" noindex />Loading...</main>;
  if (error || !blog) return <main className="min-h-screen overflow-x-hidden bg-[#05070b] px-6 pt-40 text-white md:px-24"><Seo title="Blog Not Found | MK Wedding Planner" noindex />{error}</main>;

  return (
    <main className="overflow-x-hidden bg-[#05070b] text-white">
      <Seo
        title={`${blog.title} | MK Wedding Planner`}
        description={blog.description || "Read this blog post from MK Wedding Planner."}
        keywords={`${(blog.tags || []).join(", ")}${(blog.tags || []).length ? ", " : ""}${getText("seo.blogDetail.keywords", "wedding blog article, event planning article, UAE event blog")}`}
        path={`/blogs/${blog.slug}`}
        image={blog.featuredImage || "/logo192.png"}
        type="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: blog.title,
          description: blog.description,
          image: blog.featuredImage ? [blog.featuredImage] : [`${SITE_URL}/logo192.png`],
          datePublished: blog.createdAt,
          dateModified: blog.updatedAt || blog.createdAt,
          author: { "@type": "Organization", name: "MK Wedding Planner" },
          publisher: {
            "@type": "Organization",
            name: "MK Wedding Planner",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/logo192.png` },
          },
          mainEntityOfPage: `${SITE_URL}/blogs/${blog.slug}`,
        }}
      />
      <section className="px-6 pb-12 pt-40 md:px-24">
        <div className=" w-full ">
          {blog.featuredImage ? (
            <img src={blog.featuredImage} alt={blog.title} className="h-[320px] w-full object-cover sm:h-[420px] md:h-[620px]" />
          ) : null}

          <AnimateIn delay={120} className="mt-8">
            <h1 className="break-words text-2xl font-semibold leading-snug sm:text-3xl md:text-6xl">{blog.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/90 sm:gap-6 sm:text-base md:gap-10 md:text-xl ">
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              <span className="break-words">{(blog.tags || []).join(", ")}</span>
            </div>
          </AnimateIn>

          <div className="my-10 h-px bg-white/30" />

 <AnimateIn delay={160}>
  <article
  className="
    w-full max-w-none break-words text-left text-base text-white/80 sm:text-lg md:text-xl

    [&_p]:leading-[2.2]
    [&_p]:mb-5

    [&_h1]:text-2xl sm:[&_h1]:text-2xl md:[&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:leading-snug
    [&_h2]:text-xl sm:[&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:leading-snug
    [&_h3]:text-lg sm:[&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:leading-snug

    [&_ul]:list-disc   [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
    [&_li]:leading-[2.2]

    [&_blockquote]:border-l-4 [&_blockquote]:border-white/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6

    [&_img]:w-full
[&_img]:max-w-full
[&_img]:h-auto
[&_img]:mx-auto
[&_img]:my-5
[&_img]:rounded-lg
[&_img]:block

    [&_a]:underline [&_a]:text-white/90 [&_a]:hover:text-white

    [&_strong]:font-semibold
  "
  style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
  dangerouslySetInnerHTML={{ __html: blog.content }}
/>
</AnimateIn>
        </div>
      </section>

      <section className="px-6 pb-10 pt-16 text-center md:px-12">
        <p className="text-base text-white/70 sm:text-lg md:text-xl">Are you preparing for your wedding?</p>
        <Link to="/contact-us" className="mt-2 inline-block text-3xl font-light leading-tight hover:text-white/85 sm:text-6xl md:text-8xl">
          GET IN TOUCH
        </Link>
      </section>
    </main>
  );
}

export default BlogDetailsPage;
