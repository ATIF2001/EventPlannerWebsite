"use client";

import { useState } from "react";

function ServiceCard({ label, icon: Icon, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="group flex flex-col items-center gap-4 text-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="inline-flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300"
        style={{ background: hovered ? `${color}22` : "rgba(255,255,255,0.06)" }}
      >
        <Icon
          size={36}
          strokeWidth={1.5}
          style={{ color: hovered ? color : "rgba(255,255,255,0.8)", transition: "color 0.3s" }}
        />
      </div>
      <p className="text-sm leading-5 text-white/80">{label}</p>
    </div>
  );
}

export default ServiceCard;

