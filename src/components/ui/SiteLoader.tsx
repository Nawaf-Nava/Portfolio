"use client";

import { useEffect, useState } from "react";

const sparks = Array.from({ length: 18 }, (_, index) => index);

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
            if (typeof image.decode === "function") await image.decode();
            else if (!image.complete) {
              await new Promise<void>((resolve) => {
                image.addEventListener("load", () => resolve(), { once: true });
                image.addEventListener("error", () => resolve(), { once: true });
              });
            }
          } catch {
            // Failed assets must not trap the visitor on the intro screen.
          }
        }),
      );

      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );

      if (cancelled) return;
      setLeaving(true);
      exitTimer = setTimeout(() => {
        if (!cancelled) {
          document.documentElement.dataset.navaReady = "true";
          window.dispatchEvent(new Event("nava:loader-complete"));
          setVisible(false);
        }
      }, 1050);
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
      aria-label="Loading NAVA portfolio"
      aria-live="polite"
    >
      <div className="loader-atmosphere" aria-hidden="true" />
      <div className="loader-stage" aria-hidden="true">
        <div className="loader-orbit loader-orbit--outer" />
        <div className="loader-orbit loader-orbit--inner" />
        <svg className="loader-flame-art" viewBox="0 0 420 420" fill="none">
          <defs>
            <linearGradient id="nava-fire" x1="210" y1="30" x2="210" y2="390" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00E5FF" />
              <stop offset=".28" stopColor="#FF9B70" />
              <stop offset=".62" stopColor="#FF174F" />
              <stop offset="1" stopColor="#79001F" />
            </linearGradient>
            <linearGradient id="nava-edge" x1="70" y1="80" x2="350" y2="340" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00E5FF" />
              <stop offset=".48" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#FF003C" />
            </linearGradient>
            <filter id="nava-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="9" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g className="loader-flame-ribbons" filter="url(#nava-glow)">
            <path d="M210 25 C185 73 221 86 177 127 C139 162 155 187 119 213 C82 241 98 292 131 316 C111 270 153 255 169 228 C189 195 174 171 205 144 C232 120 218 91 235 69 C251 105 284 121 274 158 C266 185 247 196 253 225 C261 261 300 266 291 315 C330 285 348 240 321 201 C300 170 311 145 291 113 C271 81 239 67 210 25Z" stroke="url(#nava-fire)" strokeWidth="3" />
            <path d="M208 73 C187 111 215 127 184 159 C155 190 177 211 146 242 C129 259 139 291 159 304 C151 270 192 252 199 220 C207 186 192 172 219 145 C241 123 225 102 208 73Z" fill="url(#nava-fire)" fillOpacity=".28" />
            <path d="M276 108 C301 144 275 161 300 190 C323 218 310 248 291 266 C300 231 269 219 268 193 C266 164 289 145 276 108Z" fill="url(#nava-fire)" fillOpacity=".34" />
          </g>
          <circle cx="210" cy="210" r="145" stroke="url(#nava-edge)" strokeOpacity=".45" strokeWidth="1.2" strokeDasharray="2 10" />
          <path d="M105 105 V315 L315 105 V315" stroke="url(#nava-edge)" strokeOpacity=".7" strokeWidth="1.5" />
        </svg>

        <div className="loader-emblem">
          <span className="loader-emblem-shadow">N</span>
          <span className="loader-emblem-face">N</span>
          <span className="loader-emblem-cut">N</span>
        </div>

        <div className="loader-sparks">
          {sparks.map((spark) => <i key={spark} />)}
        </div>
        <div className="loader-scan" />
      </div>

      <div className="loader-brand" aria-hidden="true">
        <span className="loader-brand-name">NAVA</span>
        <span className="loader-brand-rule" />
        <span className="loader-brand-subtitle">ENGINEERING THE NEXT</span>
      </div>

      <div className="loader-status" aria-hidden="true">
        <span className="loader-status-dot" />
        <span>INITIALIZING EXPERIENCE</span>
      </div>
    </div>
  );
}
