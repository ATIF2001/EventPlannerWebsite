"use client";

import React from "react";
import { cva } from "class-variance-authority";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const orbitalLoaderVariants = cva("flex gap-2 items-center justify-center", {
  variants: {
    messagePlacement: {
      bottom: "flex-col",
      top: "flex-col-reverse",
      right: "flex-row",
      left: "flex-row-reverse",
    },
  },
  defaultVariants: {
    messagePlacement: "bottom",
  },
});

export function OrbitalLoader({
  className,
  message,
  messagePlacement = "bottom",
  ...props
}) {
  return (
    <div className={cn(orbitalLoaderVariants({ messagePlacement }))}>
      <div className={cn("relative h-16 w-16", className)} {...props}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-white"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-white"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-transparent border-t-white"
          animate={{ rotate: 360 }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>
      {message ? <div className="text-sm text-white/90">{message}</div> : null}
    </div>
  );
}

