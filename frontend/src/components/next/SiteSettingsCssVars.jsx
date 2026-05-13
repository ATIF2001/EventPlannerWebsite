"use client";

import { useEffect } from "react";
import { fetchPublicSiteSettings } from "../../services/api";

function applySettingsToCssVars(settings) {
  if (!settings) return;
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
}

export default function SiteSettingsCssVars({ settings }) {
  useEffect(() => {
    let mounted = true;
    applySettingsToCssVars(settings);
    fetchPublicSiteSettings({ force: true })
      .then(({ settings }) => {
        if (!mounted || !settings) return;
        applySettingsToCssVars(settings);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [settings]);

  return null;
}
