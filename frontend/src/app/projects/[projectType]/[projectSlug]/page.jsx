import ProjectsPage from "../../../../page-components/ProjectsPage";
import { SITE_URL } from "../../../../config/site";
import { buildPageMetadata, fetchProjectBySlugServer } from "../../../lib/seo";

export async function generateMetadata({ params }) {
  const projectType = params?.projectType || "corporate";
  const projectSlug = params?.projectSlug || "";
  const base = await buildPageMetadata({
    path: `/projects/${projectType}/${projectSlug}`,
    titleKey: "seo.projects.title",
    descriptionKey: "seo.projects.description",
    keywordsKey: "seo.projectDetail.keywords",
    defaults: {
      title: "Project | MK Wedding Planner",
      description: "Project gallery by MK Wedding Planner",
      keywords: "event project details, wedding portfolio, event execution",
    },
  });

  try {
    const project = await fetchProjectBySlugServer(projectSlug);
    if (!project) return base;
    const image = project?.coverImage || "/logo192.png";
    const imageUrl = String(image).startsWith("http") ? image : `${SITE_URL}${image}`;
    return {
      ...base,
      title: `${project.title} | MK Wedding Planner`,
      description: project.description || base.description,
      openGraph: {
        ...base.openGraph,
        title: `${project.title} | MK Wedding Planner`,
        description: project.description || base.description,
        url: `${SITE_URL}/projects/${projectType}/${projectSlug}`,
        images: [{ url: imageUrl, alt: project.title }],
      },
      twitter: {
        ...base.twitter,
        title: `${project.title} | MK Wedding Planner`,
        description: project.description || base.description,
        images: [imageUrl],
      },
      alternates: { canonical: `${SITE_URL}/projects/${projectType}/${projectSlug}` },
    };
  } catch {
    return base;
  }
}

export default async function Page({ params }) {
  const projectType = params?.projectType || "corporate";
  const projectSlug = params?.projectSlug || "";
  const normalized = String(projectType).toLowerCase() === "coporate" ? "corporate" : String(projectType).toLowerCase();
  const initialProject = await fetchProjectBySlugServer(projectSlug);
  const projectSchema = initialProject
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: initialProject.title,
        description: initialProject.description,
        serviceType: `${normalized} event planning`,
        provider: {
          "@type": "Organization",
          name: "MK Wedding Planner",
          url: SITE_URL,
        },
        image: [initialProject.coverImage, ...(initialProject.galleryImages || [])].filter(Boolean).slice(0, 10),
        url: `${SITE_URL}/projects/${normalized}/${projectSlug}`,
      }
    : null;
  return (
    <>
      {projectSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} /> : null}
      <ProjectsPage forcedType={normalized} initialProject={initialProject} projectSlug={projectSlug} />
    </>
  );
}

