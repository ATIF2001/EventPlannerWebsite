import ProjectsPage from "../../../page-components/ProjectsPage";
import { fetchProjectsServer } from "../../lib/seo";

export default async function Page() {
  const initialProjects = await fetchProjectsServer("wedding");
  return <ProjectsPage forcedType="wedding" initialProjects={initialProjects} />;
}

