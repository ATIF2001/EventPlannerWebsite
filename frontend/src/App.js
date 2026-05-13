import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faInstagram,
  faTiktok,
  faSnapchat,
} from '@fortawesome/free-brands-svg-icons'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import GlobalApiLoader from "./components/GlobalApiLoader";
import { fetchPublicSiteSettings } from "./services/api";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage.jsx"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage.jsx"));
const BlogPage = lazy(() => import("./pages/BlogPage.jsx"));
const BlogDetailsPage = lazy(() => import("./pages/BlogDetailsPage.jsx"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const TermsPage = lazy(() => import("./pages/TermsPage.jsx"));
const NotFoundPage = lazy(() =>
  import("./components/ui/404-page-not-found.jsx").then((mod) => ({ default: mod.NotFoundPage }))
);

function App() {
  useEffect(() => {
    let mounted = true;
    fetchPublicSiteSettings()
      .then(({ settings }) => {
        if (!mounted || !settings) return;
        const root = document.documentElement;
        root.style.setProperty("--heading-font", `'${settings.headingFont || "Poppins"}', sans-serif`);
        root.style.setProperty("--paragraph-font", `'${settings.paragraphFont || "Poppins"}', sans-serif`);
        root.style.setProperty("--heading-weight", String(settings.headingWeight || 600));
        root.style.setProperty("--paragraph-weight", String(settings.paragraphWeight || 400));
        root.style.setProperty("--heading-size-scale", String(settings.headingSizeScale || 1));
        root.style.setProperty("--paragraph-size-scale", String(settings.paragraphSizeScale || 1));
        root.style.setProperty("--brand-primary", settings.brandPrimary || "#ffffff");
        root.style.setProperty("--brand-secondary", settings.brandSecondary || "#d9d9d9");
        root.style.setProperty("--button-radius", `${settings.buttonRadius || 8}px`);
        root.style.setProperty("--button-padding-y", `${settings.buttonPaddingY || 10}px`);
        root.style.setProperty("--button-padding-x", `${settings.buttonPaddingX || 20}px`);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <GlobalApiLoader />
      <div className="app-shell fixed left-0 right-0 top-0 z-50 pt-6">
        <Navbar />
      </div>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<Navigate to="/projects/Corporate" replace />} />
          <Route path="/projects/coporate" element={<Navigate to="/projects/Corporate" replace />} />
          <Route path="/projects/Corporate" element={<ProjectsPage forcedType="corporate" />} />
          <Route path="/projects/Wedding" element={<ProjectsPage forcedType="wedding" />} />
          <Route path="/projects/Outdoor" element={<ProjectsPage forcedType="outdoor" />} />
          <Route path="/projects/:projectType/:projectSlug" element={<ProjectsPage />} />
          <Route path="/projects/:projectType" element={<ProjectsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
          <Route path="/blog-details" element={<Navigate to="/blogs" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <section className="border-t border-white/10 bg-white/5 px-12 py-6 text-white md:px-24">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link to="/terms-and-conditions" className="text-lg text-white/90 hover:underline">
            Terms & Conditions
          </Link>
          <p className="text-lg text-white/90">
            ©2026{" "}
            <a
              href="https://www.joveraits.ae/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Jovera IT Services
            </a>
            . All Rights Reserved.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://tiktok.com/@mk.4events" target="_blank" rel="noreferrer" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm">
              <FontAwesomeIcon icon={faTiktok} />
            </a>
            <a href="https://www.snapchat.com/add/mk4events?share_id=mE8wrDeFJy8&locale=en-GB" target="_blank" rel="noreferrer" aria-label="Snapchat" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm">
              <FontAwesomeIcon icon={faSnapchat} />
            </a>
            <a href="https://www.instagram.com/mk.4events?igsh=MThnc3ZpdHM3cGV4cQ==" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
      </section>
    </BrowserRouter>
  );
}

export default App;
