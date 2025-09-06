"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { nowStr, MAX_HISTORY } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useClipboard } from "@/hooks/useClipboard";
import { buildQRValue, parseWifiPayload } from "@/lib/builders";
import type { ContentState, HistoryItem, StyleState } from "@/types/qr";
import { DEFAULT_CONTENT, DEFAULT_STYLE } from "@/lib/defaults";

import ContentBuilder from "./ContentBuilder";
import DesignPanel from "./DesignPanel";
import QRPreview from "./QRPreview";
import HistoryList from "./HistoryList";
import ExportPanel from "./ExportPanel";

export default function QRStudio() {
  const [content, setContent] = useState<ContentState>(DEFAULT_CONTENT);
  const [style, setStyle] = useState<StyleState>(DEFAULT_STYLE);
  const [status, setStatus] = useState<string>("");

  const [history, setHistory] = useLocalStorage<HistoryItem[]>(
    "qr-history",
    []
  );
  const { copied, copy } = useClipboard();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [generatedValue, setGeneratedValue] = useState<string>("");

  // preview-ə auto-scroll (mobil)
  const previewRef = useRef<HTMLDivElement | null>(null);
  const isMobile = () =>
    typeof window !== "undefined" &&
    (window.matchMedia?.("(max-width: 768px)")?.matches ||
      window.innerWidth < 768);

  const scrollToPreview = () => {
    const el = previewRef.current;
    if (!el) return;
    try {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    } catch {
      const rect = el.getBoundingClientRect();
      window.scrollTo({
        top: rect.top + window.scrollY - 12,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const addToHistory = useCallback(
    (payload: {
      value: string;
      kind: "text" | "file";
      content: ContentState;
    }) => {
      const { value, kind, content } = payload;

      const metaValue:
        | string
        | ContentState["wifi"]
        | ContentState["contact"]
        | ContentState["file"]
        | undefined =
        content.type === "free"
          ? content.freeText
          : content.type === "url"
          ? content.url
          : content.type === "wifi"
          ? content.wifi
          : content.type === "contact"
          ? content.contact
          : content.type === "file"
          ? content.file
          : undefined;

      const item: HistoryItem = {
        value,
        type: kind,
        date: nowStr(),
        contentType: content.type,
        meta:
          metaValue !== undefined
            ? ({ [content.type]: metaValue } as Partial<ContentState>)
            : undefined,
      };
      setHistory((prev) => [item, ...prev].slice(0, MAX_HISTORY));
    },
    [setHistory]
  );

  const onGenerate = useCallback(() => {
    const v = buildQRValue(content).trim();
    if (!v) return;
    setGeneratedValue(v);
    setStatus("✅ QR hazırdır.");
    addToHistory({
      value: v,
      kind: content.type === "file" ? "file" : "text",
      content,
    });
  }, [content, addToHistory]);

  useEffect(() => {
    if (!generatedValue) return;
    if (!isMobile()) return;
    const t = setTimeout(scrollToPreview, 0);
    return () => clearTimeout(t);
  }, [generatedValue]);

  const clearHistory = () => setHistory([]);

  const handlePickHistory = (it: HistoryItem) => {
    if (it.contentType && it.meta) {
      const t = it.contentType;
      const next: ContentState = { ...DEFAULT_CONTENT, type: t };
      if (t === "free" && typeof it.meta.freeText === "string") {
        next.freeText = it.meta.freeText;
      } else if (t === "url" && typeof it.meta.url === "string") {
        next.url = it.meta.url;
      } else if (t === "wifi" && it.meta.wifi) {
        next.wifi = it.meta.wifi as ContentState["wifi"];
      } else if (t === "contact" && it.meta.contact) {
        next.contact = it.meta.contact as ContentState["contact"];
      } else if (t === "file" && it.meta.file) {
        next.file = it.meta.file as ContentState["file"];
      } else {
        // fallback
        if (t === "free") next.freeText = it.value;
        if (t === "url") next.url = it.value;
        if (t === "file") next.file = { url: it.value };
      }
      setContent(next);
      setGeneratedValue(it.value);
    } else if (/^WIFI:/i.test(it.value)) {
      const wifi = parseWifiPayload(it.value);
      if (wifi) {
        setContent((s) => ({ ...s, type: "wifi", wifi }));
        setGeneratedValue(it.value);
      }
    } else {
      setContent((s) => ({ ...s, type: "free", freeText: it.value }));
      setGeneratedValue(it.value);
    }
    if (isMobile()) setTimeout(scrollToPreview, 0);
  };

  return (
    <div className="min-h-[90vh] w-full pt-4 ">
      <div 
      // className="mx-auto w-full max-w-7xl px-4 pt-10 pb-12"
      >
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            QR Code Studio
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sadə, təmiz və təhlükəsiz QR-lər.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ContentBuilder
              value={content}
              onChange={setContent}
              onGenerate={onGenerate}
            />
            <DesignPanel value={style} onChange={setStyle} />
          </div>

          <div className="space-y-6">
            <QRPreview
              qrValue={generatedValue}
              style={style}
              canvasRef={canvasRef}
              svgRef={svgRef}
              status={status}
              scrollRef={previewRef}
            />
            <ExportPanel
              qrValue={generatedValue}
              style={style}
              canvasRef={canvasRef}
              svgRef={svgRef}
              onCopy={() => copy(generatedValue)}
              copied={copied}
            />
            <HistoryList
              items={history}
              onPick={handlePickHistory}
              onClear={clearHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
