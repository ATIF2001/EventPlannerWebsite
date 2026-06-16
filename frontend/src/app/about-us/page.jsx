import AboutUsPage from "../../page-components/AboutUsPage";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/about-us",
    titleKey: "seo.about.title",
    descriptionKey: "seo.about.description",
    keywordsKey: "seo.about.keywords",
    defaults: {
      title: "About Us | MK Wedding Planner",
      description: "Learn about MK Wedding Planner, our founder, and our creative event planning expertise across the UAE.",
      keywords: "about wedding planner, UAE events company, event management team",
    },
  });
}

export default function Page() {
  return <AboutUsPage />;
}

