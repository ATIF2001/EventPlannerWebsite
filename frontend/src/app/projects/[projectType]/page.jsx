import ProjectsPage from "../../../page-components/ProjectsPage";
import { SITE_URL } from "../../../config/site";
import { buildPageMetadata, fetchProjectsServer } from "../../lib/seo";

export async function generateMetadata({ params }) {
  const projectType = params?.projectType || "corporate";
  const normalized = String(projectType).toLowerCase() === "coporate" ? "corporate" : String(projectType).toLowerCase();
  const titleType = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  const base = await buildPageMetadata({
    path: `/projects/${projectType}`,
    titleKey: "seo.projects.title",
    descriptionKey: "seo.projects.description",
    keywordsKey: "seo.projects.keywords",
    defaults: {
      title: "Projects | MK Wedding Planner",
      description: "Explore wedding, corporate, and outdoor event projects by MK Wedding Planner.",
      keywords: "event gallery, wedding projects, corporate event portfolio, outdoor event design",
    },
  });
  return {
    ...base,
    title: `${titleType} Projects | MK Wedding Planner`,
    alternates: { canonical: `${SITE_URL}/projects/${projectType}` },
  };
}

export default async function Page({ params }) {
  const projectType = params?.projectType || "corporate";
  const normalized = String(projectType).toLowerCase() === "coporate" ? "corporate" : String(projectType).toLowerCase();
  const initialProjects = await fetchProjectsServer(normalized);
  return <ProjectsPage forcedType={normalized} initialProjects={initialProjects} />;
}

