import ProjectsPage from "../../../page-components/ProjectsPage";
import { fetchProjectsServer } from "../../lib/seo";

export default async function Page() {
  const initialProjects = await fetchProjectsServer("outdoor");
  return <ProjectsPage forcedType="outdoor" initialProjects={initialProjects} />;
}

