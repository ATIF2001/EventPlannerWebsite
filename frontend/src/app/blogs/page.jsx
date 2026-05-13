import BlogPage from "../../page-components/BlogPage";
import { buildPageMetadata, fetchBlogsServer } from "../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/blogs",
    titleKey: "seo.blog.title",
    descriptionKey: "seo.blog.description",
    keywordsKey: "seo.blog.keywords",
    defaults: {
      title: "Blogs | MK Wedding Planner",
      description: "Read event inspiration, wedding planning insights, and latest updates from MK Wedding Planner.",
      keywords: "wedding planning blog, event tips, UAE wedding ideas",
    },
  });
}

export default async function Page() {
  const initialBlogs = await fetchBlogsServer();
  return <BlogPage initialBlogs={initialBlogs} />;
}

