import ProjectsPage from "../../../page-components/ProjectsPage";
import { fetchProjectsServer } from "../../lib/seo";

export default async function Page() {
  const initialProjects = await fetchProjectsServer("corporate");
  return <ProjectsPage forcedType="corporate" initialProjects={initialProjects} />;
}

