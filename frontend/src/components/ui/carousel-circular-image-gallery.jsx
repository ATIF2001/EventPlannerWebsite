"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function getCardHeightClass(featured) {
  return featured
    ? "h-[340px] sm:h-[420px] md:h-[700px]"
    : "h-[280px] sm:h-[340px] md:h-[500px]";
}

const REVEAL_DURATION_MS = 1050;
const HOVER_START_DELAY_MS = 320;
const HOVER_INTERVAL_MS = 2800;

export default function CircularProjectCard({ title, slug, images, featured = false }) {
  const safeImages = Array.isArray(images) && images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const intervalRef = useRef(null);
  const startDelayRef = useRef(null);
  const revealTimeoutRef = useRef(null);
  const lockRef = useRef(false);

  const heightClass = getCardHeightClass(featured);

  const clearAllTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (startDelayRef.current) {
      clearTimeout(startDelayRef.current);
      startDelayRef.current = null;
    }
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
  };

  const rotateImage = () => {
    if (safeImages.length < 2 || lockRef.current) return;

    const upcoming = (activeIndex + 1) % safeImages.length;
    lockRef.current = true;

    // Mount next layer in collapsed state first, then animate it open next frame.
    setIsRevealing(false);
    setNextIndex(upcoming);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsRevealing(true);
      });
    });

    revealTimeoutRef.current = window.setTimeout(() => {
      setActiveIndex(upcoming);
      setIsRevealing(false);
      lockRef.current = false;
    }, REVEAL_DURATION_MS);
  };

  const handleMouseEnter = () => {
    clearAllTimers();
    if (safeImages.length < 2) return;

    startDelayRef.current = window.setTimeout(() => {
      rotateImage();
      intervalRef.current = window.setInterval(() => {
        rotateImage();
      }, HOVER_INTERVAL_MS);
    }, HOVER_START_DELAY_MS);
  };

  const handleMouseLeave = () => {
    clearAllTimers();
    setIsRevealing(false);
    lockRef.current = false;
  };

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const currentImage = safeImages[activeIndex];
  const revealingImage = safeImages[nextIndex];

  return (
    <Link
      href={`/projects/${slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group block rounded-md border border-white/10 bg-zinc-950 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(0,0,0,0.65)] ${
        featured ? "sm:col-span-2 md:col-span-1 md:-mb-16 md:-mt-16" : ""
      }`}
    >
      <div className={`relative w-full overflow-hidden ${heightClass}`}>
        {currentImage ? (
          <img
            src={currentImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-contain bg-zinc-950 transition duration-700 group-hover:scale-[1.01]"
          />
        ) : null}

        {revealingImage && revealingImage !== currentImage ? (
          <img
            src={revealingImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-contain bg-zinc-950"
            style={{
              clipPath: isRevealing ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
              transition: `clip-path ${REVEAL_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          />
        ) : null}
      </div>
    </Link>
  );
}






