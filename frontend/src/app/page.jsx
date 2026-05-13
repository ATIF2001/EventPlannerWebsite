import HomePage from "../page-components/HomePage";
import { buildPageMetadata } from "./lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/",
    titleKey: "seo.home.title",
    descriptionKey: "seo.home.description",
    keywordsKey: "seo.home.keywords",
    defaults: {
      title: "Home | MK Wedding Planner",
      description: "Luxury wedding planning, corporate events, and outdoor celebrations crafted by MK Wedding Planner.",
      keywords: "wedding planner UAE, luxury events, corporate events, outdoor events",
    },
  });
}

export default function Page() {
  return <HomePage />;
}

