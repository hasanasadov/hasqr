"use client";

import {
  Download,
  Clipboard,
  Check,
  ExternalLink,
  FileType,
} from "lucide-react";
import type { StyleState } from "@/types/qr";
import { DEFAULT_STYLE } from "@/lib/defaults";
import type { MutableRefObject } from "react";

export default function ExportPanel({
  qrValue,
  style,
  canvasRef,
  svgRef,
  onCopy,
  copied,
}: {
  qrValue: string;
  style?: StyleState;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  svgRef: MutableRefObject<SVGSVGElement | null>;
  onCopy: () => void;
  copied: boolean;
}) {
  const s = style ?? DEFAULT_STYLE;
  const canOpen = isUrl(qrValue);

  const downloadPNG = async () => {
    const blob = await buildPNGWithLabel({ canvasRef, svgRef, style: s });
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "qr-code.png");
    URL.revokeObjectURL(url);
  };

  const downloadSVG = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const svgWithLabel = buildSVGWithLabel(svg, s);
    const blob = new Blob([svgWithLabel], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "qr-code.svg");
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-800/60 backdrop-blur shadow-xl p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Export
      </h3>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onCopy}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Copied
            </>
          ) : (
            <>
              <Clipboard className="w-4 h-4" /> Copy
            </>
          )}
        </button>

        <button
          onClick={downloadPNG}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <Download className="w-4 h-4" /> PNG
        </button>

        <a
          href={canOpen ? qrValue : "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Linki aç"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          onClick={(e) => {
            if (!canOpen) e.preventDefault();
          }}
          title={canOpen ? "Aç" : "Link deyil"}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <button
        onClick={downloadSVG}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <FileType className="w-4 h-4" /> SVG
      </button>
    </section>
  );
}

/* utils */
function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

function isUrl(v: string) {
  try {
    // eslint-disable-next-line no-new
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

async function buildPNGWithLabel({
  canvasRef,
  svgRef,
  style,
}: {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  svgRef: MutableRefObject<SVGSVGElement | null>;
  style: StyleState;
}): Promise<Blob | null> {
  const label = style.label?.show && style.label.text ? style.label.text : "";
  const labelSize = Math.max(10, style.label?.size ?? 12);
  const gap = label ? 12 : 0;

  let baseCanvas: HTMLCanvasElement | null = canvasRef.current;
  let width = 0,
    height = 0;
  const bg = style.bgColor || "#ffffff";

  if (baseCanvas) {
    width = baseCanvas.width;
    height = baseCanvas.height;
  } else if (svgRef.current) {
    const serialized = new XMLSerializer().serializeToString(svgRef.current);
    const svgUrl =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(serialized);
    const img = await loadImage(svgUrl);
    width = img.width;
    height = img.height;

    baseCanvas = document.createElement("canvas");
    baseCanvas.width = width;
    baseCanvas.height = height;
    const ctx = baseCanvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0);
  } else {
    return null;
  }

  const labelH = label ? Math.ceil(labelSize * 1.6) : 0;
  const final = document.createElement("canvas");
  final.width = width;
  final.height = height + (label ? gap + labelH : 0);
  const fctx = final.getContext("2d");
  if (!fctx) return null;

  fctx.fillStyle = bg;
  fctx.fillRect(0, 0, final.width, final.height);

  fctx.imageSmoothingEnabled = true;
  fctx.drawImage(baseCanvas, 0, 0);

  if (label) {
    fctx.font = `600 ${labelSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial`;
    fctx.fillStyle = "#111827";
    fctx.textAlign = "center";
    fctx.textBaseline = "top";
    const y = height + gap;
    fctx.fillText(label, final.width / 2, y);
  }

  return await new Promise<Blob | null>((resolve) =>
    final.toBlob((b) => resolve(b), "image/png")
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });
}

function buildSVGWithLabel(svgEl: SVGSVGElement, style: StyleState): string {
  const label = style.label?.show && style.label.text ? style.label.text : "";
  const labelSize = Math.max(10, style.label?.size ?? 12);
  const gap = label ? 12 : 0;

  const src = new XMLSerializer().serializeToString(svgEl);
  const sizeAttr = svgEl.getAttribute("width") || svgEl.getAttribute("height");
  const size = sizeAttr ? Number(sizeAttr) : style.size;
  const totalH = size + (label ? gap + Math.ceil(labelSize * 1.6) : 0);
  const bg = style.bgColor || "#ffffff";
  const inner = src.replace(/^<\?xml[^>]*\?>/i, "");

  const out = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${totalH}" viewBox="0 0 ${size} ${totalH}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <g transform="translate(0,0)">
    ${inner}
  </g>
  ${
    label
      ? `<text x="${size / 2}" y="${
          size + gap + labelSize
        }" font-size="${labelSize}" font-weight="600" text-anchor="middle" fill="#111827" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial">${escapeXml(
          label
        )}</text>`
      : ""
  }
</svg>`.trim();

  return out;
}

function escapeXml(s: string) {
  return s.replace(
    /[<>&"]/g,
    (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] as string)
  );
}
