import { OrbitalLoader } from "./ui/orbital-loader";
import { useApiLoading } from "../hooks/useApiLoading";

function GlobalApiLoader() {
  const isLoading = useApiLoading();
  if (!isLoading) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center">
      <div className="rounded-2xl border border-white/20 bg-black/65 px-8 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm">
        <OrbitalLoader message="Please wait..." />
      </div>
    </div>
  );
}

export default GlobalApiLoader;

