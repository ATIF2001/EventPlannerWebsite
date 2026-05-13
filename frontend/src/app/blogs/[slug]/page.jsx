import BlogDetailsPage from "../../../page-components/BlogDetailsPage";
import { SITE_URL } from "../../../config/site";
import { buildPageMetadata, fetchBlogBySlugServer } from "../../lib/seo";

export async function generateMetadata({ params }) {
  const slug = params?.slug || "";
  const base = await buildPageMetadata({
    path: `/blogs/${slug}`,
    titleKey: "seo.blog.title",
    descriptionKey: "seo.blog.description",
    keywordsKey: "seo.blogDetail.keywords",
    defaults: {
      title: "Blog | MK Wedding Planner",
      description: "Read event inspiration, wedding planning insights, and latest updates from MK Wedding Planner.",
      keywords: "wedding blog article, event planning article, UAE event blog",
    },
  });

  try {
    const blog = await fetchBlogBySlugServer(slug);
    if (!blog) return base;
    const image = blog?.featuredImage || "/logo192.png";
    const imageUrl = String(image).startsWith("http") ? image : `${SITE_URL}${image}`;
    return {
      ...base,
      title: `${blog.title} | MK Wedding Planner`,
      description: blog.description || base.description,
      openGraph: {
        ...base.openGraph,
        type: "article",
        title: `${blog.title} | MK Wedding Planner`,
        description: blog.description || base.description,
        url: `${SITE_URL}/blogs/${slug}`,
        images: [{ url: imageUrl, alt: blog.title }],
      },
      twitter: {
        ...base.twitter,
        title: `${blog.title} | MK Wedding Planner`,
        description: blog.description || base.description,
        images: [imageUrl],
      },
    };
  } catch {
    return base;
  }
}

export default async function Page({ params }) {
  const slug = params?.slug || "";
  const initialBlog = await fetchBlogBySlugServer(slug);
  const blogSchema = initialBlog
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: initialBlog.title,
        description: initialBlog.description,
        image: initialBlog.featuredImage ? [initialBlog.featuredImage] : [`${SITE_URL}/logo192.png`],
        datePublished: initialBlog.createdAt,
        dateModified: initialBlog.updatedAt || initialBlog.createdAt,
        author: { "@type": "Organization", name: "MK Wedding Planner" },
        publisher: {
          "@type": "Organization",
          name: "MK Wedding Planner",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/logo192.png` },
        },
        mainEntityOfPage: `${SITE_URL}/blogs/${slug}`,
      }
    : null;
  return (
    <>
      {blogSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} /> : null}
      <BlogDetailsPage slug={slug} initialBlog={initialBlog} />
    </>
  );
}

