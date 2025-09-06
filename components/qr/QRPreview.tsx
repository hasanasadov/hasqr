"use client";

import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
// Define QRImageSettings type locally since it's not exported from qrcode.react
type QRImageSettings = {
  src: string;
  height: number;
  width: number;
  excavate: boolean;
};
import type { StyleState } from "@/types/qr";
import { FileIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MutableRefObject, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export default function QRPreview({
  qrValue,
  style,
  canvasRef,
  svgRef,
  status,
  scrollRef,
}: {
  qrValue: string;
  style: StyleState;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  svgRef: MutableRefObject<SVGSVGElement | null>;
  status?: string;
  scrollRef?: MutableRefObject<HTMLDivElement | null>;
}) {
  const s = style;
  const side = s.size;

  // --- Logo ölçüləri və vəziyyəti
  const logoPx = Math.round((side * s.logoSizePct) / 100);
  const hasLogo = Boolean(s.logoUrl) && logoPx > 0;

  // --- Masklı (circle/rounded) logo dataURL (CORS riskini də aradan qaldırır)
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!hasLogo) {
        setLogoDataUrl(null);
        return;
      }
      try {
        const img = await loadImage(s.logoUrl);
        const pad = s.logoBg ? 12 : 0;
        const W = logoPx + pad * 2;
        const H = logoPx + pad * 2;

        const off = document.createElement("canvas");
        off.width = W;
        off.height = H;
        const ctx = off.getContext("2d");
        if (!ctx) return;

        // Ağ backdrop (opsional, bir az böyük)
        if (s.logoBg) {
          ctx.fillStyle = "#fff";
          if (s.logoShape === "circle") {
            ctx.beginPath();
            ctx.arc(W / 2, H / 2, logoPx / 2 + 6, 0, Math.PI * 2);
            ctx.fill();
          } else {
            roundRect(
              ctx,
              (W - (logoPx + 12)) / 2,
              (H - (logoPx + 12)) / 2,
              logoPx + 12,
              logoPx + 12,
              8
            );
            ctx.fill();
          }
        }

        // Mask + şəkil
        ctx.save();
        if (s.logoShape === "circle") {
          ctx.beginPath();
          ctx.arc(W / 2, H / 2, logoPx / 2, 0, Math.PI * 2);
          ctx.clip();
        } else {
          roundRect(ctx, (W - logoPx) / 2, (H - logoPx) / 2, logoPx, logoPx, 6);
          ctx.clip();
        }
        ctx.drawImage(img, (W - logoPx) / 2, (H - logoPx) / 2, logoPx, logoPx);
        ctx.restore();

        const url = off.toDataURL("image/png");
        if (!cancelled) setLogoDataUrl(url);
      } catch {
        if (!cancelled) setLogoDataUrl(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hasLogo, s.logoUrl, s.logoShape, s.logoBg, logoPx, s.logoSizePct]);

  // --- Canvas üçün imageSettings (rəsmi tip ilə)
  const effectiveLevel = (hasLogo ? "H" : s.level) as "L" | "M" | "Q" | "H";
  const imageSettingsCanvas: QRImageSettings | undefined = hasLogo
    ? {
        src: logoDataUrl ?? s.logoUrl,
        height: logoPx,
        width: logoPx,
        excavate: true,
      }
    : undefined;

  // --- SVG üçün: imageSettings vermirik (paketin tipləri icazə vermir),
  //     əvəzində DOM-a loqo inject edirik
  useEffect(() => {
    if (!qrValue) return;

    // görünən SVG (renderAs === 'svg' olduqda)
    const visibleSvg =
      (document.getElementById("qr-svg-visible") as SVGSVGElement | null) ??
      null;
    if (visibleSvg) {
      decorateSvgWithLogo(visibleSvg, {
        size: side,
        logoPx,
        src: (logoDataUrl ?? s.logoUrl) || "",
        shape: s.logoShape,
        withBg: s.logoBg,
        bgColor: s.bgColor || "#fff",
        enabled: hasLogo,
      });
    }

    // export üçün gizli SVG
    const exportSvg = document.getElementById(
      "qr-svg-export"
    ) as SVGSVGElement | null;
    if (exportSvg) {
      decorateSvgWithLogo(exportSvg, {
        size: side,
        logoPx,
        src: (logoDataUrl ?? s.logoUrl) || "",
        shape: s.logoShape,
        withBg: s.logoBg,
        bgColor: s.bgColor || "#fff",
        enabled: hasLogo,
      });
      // parent export panel ref üçün saxla
      svgRef.current = exportSvg;
    }
  }, [
    qrValue,
    hasLogo,
    logoDataUrl,
    s.logoUrl,
    s.logoShape,
    s.logoBg,
    s.bgColor,
    side,
    logoPx,
    svgRef,
  ]);

  // --- Canvas ref-ni bağla
  useEffect(() => {
    const c = document.getElementById("qr-canvas") as HTMLCanvasElement | null;
    if (c) canvasRef.current = c;
  }, [
    qrValue,
    s.bgColor,
    s.fgColor,
    s.includeMargin,
    side,
    imageSettingsCanvas,
    canvasRef,
  ]);

  const shadowCls =
    s.shadow === "none"
      ? "shadow-none"
      : s.shadow === "sm"
      ? "shadow"
      : s.shadow === "md"
      ? "shadow-lg"
      : "shadow-2xl";

  const frameCls =
    s.frame === "plain"
      ? "bg-white dark:bg-gray-900"
      : s.frame === "card"
      ? "bg-white/95 dark:bg-gray-900/90 border border-gray-100 dark:border-gray-700"
      : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rotate-[0.2deg]";

  const patternStyle = useMemo<React.CSSProperties>(() => {
    if (s.bgPattern === "grid") {
      return {
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
        backgroundSize: "12px 12px",
      };
    }
    if (s.bgPattern === "dots") {
      return {
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
        backgroundSize: "10px 10px",
      };
    }
    return {};
  }, [s.bgPattern]);

  return (
    <section
      ref={scrollRef}
      className="rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-800/60 backdrop-blur shadow-xl p-6"
    >
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Nəticə
      </h3>

      <div
        className="w-full flex items-center justify-center"
        style={{ padding: s.padding }}
      >
        <div
          className={cn(
            "relative p-3 flex flex-col items-center justify-center overflow-hidden",
            shadowCls,
            frameCls
          )}
          style={{
            borderRadius: s.cornerRadius,
            ...patternStyle,
            maxWidth: "100%",
          }}
        >
          <AnimatePresence mode="wait">
            {qrValue ? (
              <motion.div
                key="qr"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="flex flex-col items-center justify-center w-full"
              >
                <div className="w-full flex items-center justify-center">
                  {/* CANVAS – imageSettings burada dəstəklənir */}
                  <div
                    style={{
                      display: s.renderAs === "canvas" ? "block" : "none",
                    }}
                  >
                    <QRCodeCanvas
                      id="qr-canvas"
                      value={qrValue}
                      size={side}
                      level={effectiveLevel}
                      bgColor={s.bgColor}
                      fgColor={s.fgColor}
                      includeMargin={s.includeMargin}
                      imageSettings={imageSettingsCanvas}
                      className="rounded-xl p-3 bg-white dark:bg-gray-900"
                      style={{ width: "100%", maxWidth: side, height: "auto" }}
                    />
                  </div>

                  {/* SVG – imageSettings YOX; logo DOM ilə inject olunur */}
                  <div
                    style={{ display: s.renderAs === "svg" ? "block" : "none" }}
                  >
                    <QRCodeSVG
                      id="qr-svg-visible"
                      value={qrValue}
                      size={side}
                      level={effectiveLevel}
                      bgColor={s.bgColor}
                      fgColor={s.fgColor}
                      includeMargin={s.includeMargin}
                      className="rounded-xl p-3 bg-white dark:bg-gray-900"
                      style={{ width: "100%", maxWidth: side, height: "auto" }}
                    />
                  </div>
                </div>

                {/* Export üçün HƏMİŞƏ mövcud gizli SVG (buraya da loqo inject edilir) */}
                <div
                  style={{
                    position: "absolute",
                    left: -99999,
                    top: -99999,
                    width: 0,
                    height: 0,
                    overflow: "hidden",
                  }}
                >
                  <QRCodeSVG
                    id="qr-svg-export"
                    value={qrValue}
                    size={side}
                    level={effectiveLevel}
                    bgColor={s.bgColor}
                    fgColor={s.fgColor}
                    includeMargin={s.includeMargin}
                  />
                </div>

                {s.label.show && s.label.text && (
                  <div
                    className="mt-2 text-gray-700 dark:text-gray-200 text-center"
                    style={{ fontSize: s.label.size }}
                  >
                    {s.label.text}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 dark:text-gray-600 text-center py-8"
              >
                <FileIcon className="w-12 h-12 mx-auto mb-3" />
                Burada nəticə görünəcək
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {status && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-emerald-700 dark:text-emerald-300"
        >
          {status}
        </motion.p>
      )}
    </section>
  );
}

/* ---------------- Helpers (tam tiplidir) ---------------- */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

type SvgLogoOpts = {
  size: number;
  logoPx: number;
  src: string;
  shape: "square" | "circle";
  withBg: boolean;
  bgColor: string;
  enabled: boolean;
};

/** QRCodeSVG renderindən sonra loqonu SVG-in içinə (clipPath + image) əlavə edir. */
function decorateSvgWithLogo(svg: SVGSVGElement, opts: SvgLogoOpts) {
  // əvvəlcə köhnə loqo qrupunu sil
  svg.querySelectorAll('[data-logo-group="1"]').forEach((n) => n.remove());
  svg.querySelectorAll('[data-logo-clip="1"]').forEach((n) => n.remove());

  if (!opts.enabled || !opts.src) return;

  const { size, logoPx, src, shape, withBg, bgColor } = opts;
  const cx = size / 2;
  const cy = size / 2;

  // defs + clipPath
  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.insertBefore(defs, svg.firstChild);
  }
  const clip = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "clipPath"
  );
  clip.setAttribute("data-logo-clip", "1");

  if (shape === "circle") {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", String(cx));
    c.setAttribute("cy", String(cy));
    c.setAttribute("r", String(logoPx / 2));
    clip.appendChild(c);
  } else {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(cx - logoPx / 2));
    rect.setAttribute("y", String(cy - logoPx / 2));
    rect.setAttribute("width", String(logoPx));
    rect.setAttribute("height", String(logoPx));
    rect.setAttribute("rx", "6");
    rect.setAttribute("ry", "6");
    clip.appendChild(rect);
  }

  const clipId = `clip_${Math.random().toString(36).slice(2)}`;
  clip.setAttribute("id", clipId);
  defs.appendChild(clip);

  // loqo qrupu
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("data-logo-group", "1");

  // backdrop (opsional)
  if (withBg) {
    if (shape === "circle") {
      const bg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      bg.setAttribute("cx", String(cx));
      bg.setAttribute("cy", String(cy));
      bg.setAttribute("r", String(logoPx / 2 + 6));
      bg.setAttribute("fill", "#fff");
      g.appendChild(bg);
    } else {
      const w = logoPx + 12;
      const h = logoPx + 12;
      const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bg.setAttribute("x", String(cx - w / 2));
      bg.setAttribute("y", String(cy - h / 2));
      bg.setAttribute("width", String(w));
      bg.setAttribute("height", String(h));
      bg.setAttribute("rx", "8");
      bg.setAttribute("ry", "8");
      bg.setAttribute("fill", "#fff");
      g.appendChild(bg);
    }
  } else {
    // backdrop yoxdursa modulları örtmək üçün bgColor ilə eyni rəngi çək
    if (shape === "circle") {
      const cover = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      cover.setAttribute("cx", String(cx));
      cover.setAttribute("cy", String(cy));
      cover.setAttribute("r", String(logoPx / 2));
      cover.setAttribute("fill", bgColor);
      g.appendChild(cover);
    } else {
      const cover = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      cover.setAttribute("x", String(cx - logoPx / 2));
      cover.setAttribute("y", String(cy - logoPx / 2));
      cover.setAttribute("width", String(logoPx));
      cover.setAttribute("height", String(logoPx));
      cover.setAttribute("rx", "6");
      cover.setAttribute("ry", "6");
      cover.setAttribute("fill", bgColor);
      g.appendChild(cover);
    }
  }

  // image (clip-path ilə)
  const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
  // SVG 1.1 uyğunluğu üçün həm href, həm xlink:href
  img.setAttribute("href", src);
  img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", src);
  img.setAttribute("x", String(cx - logoPx / 2));
  img.setAttribute("y", String(cy - logoPx / 2));
  img.setAttribute("width", String(logoPx));
  img.setAttribute("height", String(logoPx));
  img.setAttribute("clip-path", `url(#${clipId})`);
  g.appendChild(img);

  svg.appendChild(g);
}
