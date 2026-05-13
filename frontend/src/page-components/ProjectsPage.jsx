"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import corporateHeroImage from "../assets/home/corporate.png";
import weddingHeroImage from "../assets/home/wedding.png";
import outdoorHeroImage from "../assets/home/outdoor.png";
import AnimateIn from "../components/AnimateIn";
import Seo from "../components/Seo";
import { fetchProjectBySlug, fetchProjects } from "../services/api";
import { useSiteContent } from "../hooks/useSiteContent";

const categoryMap = {
  corporate: { title: "Corporate", hero: corporateHeroImage },
  wedding: { title: "Wedding", hero: weddingHeroImage },
  outdoor: { title: "Outdoor", hero: outdoorHeroImage },
};

function getProjectsHeroByType(getImage, type, fallback) {
  return getImage(`projects.hero.image.${type}`, fallback);
}

function normalizeType(value) {
  const normalized = String(value || "").toLowerCase();
  return normalized === "coporate" ? "corporate" : normalized;
}

function CategoryProjectsView({ activeType, initialProjects = [] }) {
  const { getText, getImage } = useSiteContent();
  const hasInitial = Array.isArray(initialProjects) && initialProjects.length > 0;
  const [projects, setProjects] = useState(Array.isArray(initialProjects) ? initialProjects : []);
  const [loading, setLoading] = useState(!hasInitial);
  const [error, setError] = useState("");
  const categoryConfig = categoryMap[activeType];
  const pageHeroImage = getProjectsHeroByType(getImage, activeType, categoryConfig.hero);

  useEffect(() => {
    if (hasInitial) return;
    let mounted = true;
    setLoading(true);
    setError("");
    fetchProjects({ category: activeType })
      .then((items) => {
        if (mounted) setProjects(items);
      })
      .catch(() => {
        if (mounted) setError("No projects available");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [activeType, hasInitial]);

  return (
    <main className="bg-[#05070b] text-white">
      <Seo
        title={getText("seo.projects.title", "Projects | MK Wedding Planner")}
        description={getText("seo.projects.description", "Explore wedding, corporate, and outdoor event projects by MK Wedding Planner.")}
        keywords={getText("seo.projects.keywords", "event gallery, wedding projects, corporate event portfolio, outdoor event design")}
        path={`/projects/${activeType}`}
        image={pageHeroImage}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${getText("projects.hero.heading", categoryConfig.title)} Projects`,
          description: `Explore ${categoryConfig.title.toLowerCase()} event gallery by MK Wedding Planner.`,
        }}
      />

      <section className="relative min-h-[720px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${pageHeroImage})` }}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex min-h-[720px] flex-col px-6 pt-5 md:px-12">
          <div className="pt-20" />
          <AnimateIn delay={120} className="mb-28 mt-auto text-center">
            <p className="mb-3 text-base text-white/85 sm:text-lg md:text-xl">
              <Link href="/" className="hover:underline">Home</Link> | Projects
            </p>
            <h1 className="text-4xl font-light sm:text-5xl md:text-6xl">{getText("projects.hero.heading", categoryConfig.title)}</h1>
          </AnimateIn>
        </div>
      </section>

      <section className="px-6 pb-16 pt-12 md:px-12">
        <div>
          <p className="mb-10 max-w-4xl text-lg leading-8 text-white/80">
            We create unforgettable moments with elegance and precision. Click any project below to open its full gallery.
          </p>

          {loading ? <p className="text-white/70">Loading projects...</p> : null}
          {error ? <p className="rounded-md border border-white/15 p-8 text-center text-white/70">{error}</p> : null}

          {!loading && !error && projects.length === 0 ? (
            <div className="rounded-md border border-white/15 p-8 text-center text-white/70">
              No {categoryConfig.title.toLowerCase()} projects published yet.
            </div>
          ) : null}

          {!loading && !error && projects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${activeType}/${project.slug}`}
                  className="group overflow-hidden border border-white/10 bg-black/40 transition hover:-translate-y-1"
                >
                  <img
                    src={project.coverImage || pageHeroImage}
                    alt={project.title}
                    className="h-[360px] w-full object-contain bg-zinc-950 transition duration-500 group-hover:scale-[1.01]"
                  />
                  <div className="bg-[#d9d9d9] px-4 py-3 text-center text-2xl text-black">{project.title}</div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function ProjectDetailsView({ activeType, projectSlug, initialProject = null }) {
  const { getText, getImage } = useSiteContent();
  const [project, setProject] = useState(initialProject);
  const [loading, setLoading] = useState(!initialProject);
  const [error, setError] = useState("");
  const fallbackHero = categoryMap[activeType]?.hero || corporateHeroImage;
  const categoryHeroImage = getProjectsHeroByType(getImage, activeType, fallbackHero);

  useEffect(() => {
    if (!projectSlug) return;
    if (initialProject && initialProject.slug === projectSlug) return;
    let mounted = true;
    setLoading(true);
    setError("");
    fetchProjectBySlug(projectSlug)
      .then((item) => {
        if (mounted) setProject(item);
      })
      .catch((err) => {
        if (mounted) setError(err?.response?.data?.message || "Failed to load project");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [projectSlug, initialProject]);

  const galleryImages = useMemo(() => project?.galleryImages || [], [project]);
  const hero = project?.coverImage || categoryHeroImage;

  return (
    <main className="bg-[#05070b] text-white">
      <Seo
        title={`${getText("projects.hero.heading", project?.title || "Project")} | MK Wedding Planner`}
        description={project?.description || "Project gallery by MK Wedding Planner"}
        keywords={getText("seo.projectDetail.keywords", "event project details, wedding portfolio, event execution")}
        path={`/projects/${activeType}/${projectSlug}`}
        image={hero}
        structuredData={
          project
            ? {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                name: project.title,
                description: project.description,
                image: [hero, ...(project.galleryImages || [])].slice(0, 10),
                url: `/projects/${activeType}/${projectSlug}`,
              }
            : undefined
        }
      />
      <section className="relative min-h-[720px] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${hero})` }}>
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 flex min-h-[720px] flex-col px-6 pt-5 md:px-12">
          <div className="pt-20" />
          <div className="mb-28 mt-auto text-center">
            <p className="mb-3 text-base text-white/85 sm:text-lg md:text-xl">
              <Link href="/" className="hover:underline">Home</Link> |{" "}
              <Link href={`/projects/${activeType}`} className="hover:underline">Projects</Link>
            </p>
            <h1 className="text-4xl font-light sm:text-5xl md:text-6xl">{getText("projects.hero.heading", project?.title || "Project")}</h1>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 pt-10 md:px-12">
        <div>
          {loading ? <p className="text-white/70">Loading gallery...</p> : null}
          {error ? <p className="rounded border border-red-400/40 bg-red-500/10 p-3 text-red-300">{error}</p> : null}
          {!loading && !error && project ? (
            <>
              <p className="mb-10 max-w-4xl text-lg leading-8 text-white/80">{project.description}</p>

              {galleryImages.length > 0 ? (
                <LightGallery
                  plugins={[lgThumbnail]}
                  speed={500}
                  thumbnail={true}
                  download={false}
                  selector=".gallery-item"
                  elementClassNames="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {galleryImages.map((image, index) => (
                    <a
                      key={`${project.id}-gallery-${index}`}
                      href={image}
                      className="gallery-item block w-full overflow-hidden border border-white/10 bg-black/40"
                      data-sub-html={`<h4>${project.title}</h4><p>Image ${index + 1}</p>`}
                    >
                      <img
                        src={image}
                        alt={`${project.title} ${index + 1}`}
                        className="h-[420px] w-full object-contain bg-zinc-950"
                      />
                    </a>
                  ))}
                </LightGallery>
              ) : null}

              {galleryImages.length === 0 ? (
                <div className="rounded-md border border-white/15 p-8 text-center text-white/70">
                  No gallery images added for this project yet.
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <section className="px-6 pb-10 pt-6 text-center md:px-12">
          <p className="text-base text-white/70 sm:text-lg md:text-xl">Are you preparing for your event?</p>
          <Link href="/contact-us" className="mt-2 inline-block text-3xl font-light hover:text-white/85 sm:text-6xl md:text-8xl">
            GET IN TOUCH
          </Link>
        </section>
      </section>
    </main>
  );
}

function ProjectsPage({ forcedType, projectSlug: projectSlugProp, initialProjects = [], initialProject = null }) {
  const router = useRouter();
  const { projectType = "corporate", projectSlug } = useParams();
  const activeType = normalizeType(forcedType || projectType || "corporate");
  const activeProjectSlug = projectSlugProp || projectSlug;
  useEffect(() => {
    if (!categoryMap[activeType]) {
      router.replace("/projects/corporate");
    }
  }, [activeType, router]);
  if (!categoryMap[activeType]) return null;
  if (activeProjectSlug) {
    return <ProjectDetailsView activeType={activeType} projectSlug={activeProjectSlug} initialProject={initialProject} />;
  }
  return <CategoryProjectsView activeType={activeType} initialProjects={initialProjects} />;
}

export default ProjectsPage;








