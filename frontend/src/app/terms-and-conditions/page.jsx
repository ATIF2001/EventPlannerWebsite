import TermsPage from "../../page-components/TermsPage";
import { buildPageMetadata } from "../lib/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/terms-and-conditions",
    titleKey: "seo.terms.title",
    descriptionKey: "seo.terms.description",
    keywordsKey: "seo.terms.keywords",
    defaults: {
      title: "Terms & Conditions | MK Wedding Planner",
      description: "Read the terms and conditions for using MK Wedding Planner services and website.",
      keywords: "terms and conditions, legal, policy",
    },
  });
}

export default function Page() {
  return <TermsPage />;
}

