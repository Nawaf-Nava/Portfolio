"use client";

import { useEffect, useState } from "react";

export default function SiteLoader() {
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;

    const waitForAssets = async () => {
      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), { once: true });
        });
      }

      await document.fonts.ready;

      const images = Array.from(document.images);
      images.forEach((image) => {
        image.loading = "eager";
      });

      await Promise.all(
        images.map(async (image) => {
          try {
            if (typeof image.decode === "function") {
              await image.decode();
            } else if (!image.complete) {
              await new Promise<void>((resolve) => {
                image.addEventListener("load", () => resolve(), { once: true });
                image.addEventListener("error", () => resolve(), { once: true });
              });
            }
          } catch {
            // A failed image should not leave the intro screen stuck forever.
          }
        }),
      );

      if (cancelled) return;
      setLeaving(true);
      exitTimer = setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, 850);
    };

    void waitForAssets();

    return () => {
      cancelled = true;
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`site-loader${leaving ? " site-loader--leaving" : ""}`}
      role="status"
      aria-label="Loading portfolio"
      aria-live="polite"
    >
      <div className="loader-fire" aria-hidden="true">
        <span className="loader-flame loader-flame--one" />
        <span className="loader-flame loader-flame--two" />
        <span className="loader-flame loader-flame--three" />
        <span className="loader-flame loader-flame--four" />
        <span className="loader-core" />
      </div>
      <div className="loader-mark" aria-hidden="true">N</div>
      <div className="loader-caption">INITIALIZING SYSTEM</div>
      <div className="loader-track" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
