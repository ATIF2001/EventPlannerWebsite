import ContactUsPage from "../../page-components/ContactUsPage";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/contact-us",
    titleKey: "seo.contact.title",
    descriptionKey: "seo.contact.description",
    keywordsKey: "seo.contact.keywords",
    defaults: {
      title: "Contact Us | MK Wedding Planner",
      description: "Contact MK Wedding Planner for weddings, corporate events, and outdoor event planning in UAE.",
      keywords: "contact wedding planner, book event planner UAE, event consultation",
    },
  });
}

export default function Page() {
  return <ContactUsPage />;
}

