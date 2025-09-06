"use client";

import type { StyleState, ECCLevel } from "@/types/qr";
import { useState, useRef, ChangeEvent } from "react";
import { ChevronDown, Paintbrush, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_STYLE } from "@/lib/defaults";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

export default function DesignPanel({
  value,
  onChange,
}: {
  value?: StyleState;
  onChange: (s: StyleState) => void;
}) {
  const v = value ?? DEFAULT_STYLE;
  const [openMore, setOpenMore] = useState<boolean>(false);

  const set = <K extends keyof StyleState>(k: K, val: StyleState[K]) =>
    onChange({ ...v, [k]: val });
  const setNum = (k: keyof StyleState) => (e: ChangeEvent<HTMLInputElement>) =>
    set(k, parseInt(e.target.value, 10) as unknown as StyleState[typeof k]);

  const { upload, uploading, progress, error, canUpload, setError } =
    useCloudinaryUpload();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPickFile = () => fileRef.current?.click();
  const onFile = async (f?: File | null) => {
    if (!f) return;
    // dərhal local preview
    const localUrl = URL.createObjectURL(f);
    set("logoUrl", localUrl);
    try {
      const url = await upload(f);
      set("logoUrl", url);
    } catch {
      /* ignore */
    } finally {
      setTimeout(() => URL.revokeObjectURL(localUrl), 30000);
    }
  };

  return (
    <section className="rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-800/60 backdrop-blur shadow-xl p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Paintbrush className="w-5 h-5" />
        Dizayn
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ölçü: {v.size}px
          </label>
          <input
            type="range"
            min={140}
            max={520}
            step={20}
            value={v.size}
            onChange={setNum("size")}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rəng (ön)
            </label>
            <input
              type="color"
              value={v.fgColor}
              onChange={(e) => set("fgColor", e.target.value)}
              className="h-10 w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rəng (fon)
            </label>
            <input
              type="color"
              value={v.bgColor}
              onChange={(e) => set("bgColor", e.target.value)}
              className="h-10 w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>
        </div>

        {/* Logo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Logo (opsional)
          </label>

          <div className="flex flex-col sm:flex-row sm:items-stretch gap-2">
            <input
              placeholder="Logo URL"
              value={v.logoUrl}
              onChange={(e) => set("logoUrl", e.target.value)}
              className="min-w-0 flex-1 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            />
            <div className="shrink-0">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={onPickFile}
                disabled={!canUpload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                title={canUpload ? "Logo yüklə" : "Cloudinary env tələb olunur"}
              >
                <Upload className="w-4 h-4" /> Upload
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Logo ölçüsü: {v.logoSizePct}%
              </label>
              <input
                type="range"
                min={0}
                max={34}
                step={2}
                value={v.logoSizePct}
                onChange={setNum("logoSizePct")}
                className="w-full"
              />
            </div>
            <select
              value={v.logoShape}
              onChange={(e) =>
                set("logoShape", e.target.value as StyleState["logoShape"])
              }
              className="rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <option value="square">Square</option>
              <option value="circle">Circle</option>
            </select>
            <label className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                checked={v.logoBg}
                onChange={(e) => set("logoBg", e.target.checked)}
              />
              <span className="text-sm">Ağ fonda</span>
            </label>
          </div>

          {(uploading || error) && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span>{progress}%</span>
                </div>
              ) : (
                <div
                  className="text-red-600 dark:text-red-300"
                  onAnimationEnd={() => setError(null)}
                >
                  {error}
                </div>
              )}
            </div>
          )}

          <p className="mt-2 text-xs text-gray-500">
            Logo aktiv olanda oxunarlıq üçün ECC <b>H</b> və “excavate” istifadə
            olunur.
          </p>
        </div>
      </div>

      {/* Daha çox seçim */}
      <button
        onClick={() => setOpenMore((s) => !s)}
        className="mt-4 w-full inline-flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        Daha çox seçim
        <ChevronDown
          className={cn(
            "w-4 h-4 transition",
            openMore ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {openMore && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Error correction
            </label>
            <select
              value={v.level}
              onChange={(e) => set("level", e.target.value as ECCLevel)}
              className="w-full rounded-xl p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <option value="L">L (7%)</option>
              <option value="M">M (15%)</option>
              <option value="Q">Q (25%)</option>
              <option value="H">H (30%)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Render
            </label>
            <select
              value={v.renderAs}
              onChange={(e) =>
                set("renderAs", e.target.value as StyleState["renderAs"])
              }
              className="w-full rounded-xl p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <option value="canvas">Canvas (PNG)</option>
              <option value="svg">SVG (sonsuz miqyas)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frame
            </label>
            <select
              value={v.frame}
              onChange={(e) =>
                set("frame", e.target.value as StyleState["frame"])
              }
              className="w-full rounded-xl p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <option value="plain">Plain</option>
              <option value="card">Card</option>
              <option value="sticker">Sticker</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kölgə
            </label>
            <select
              value={v.shadow}
              onChange={(e) =>
                set("shadow", e.target.value as StyleState["shadow"])
              }
              className="w-full rounded-xl p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <option value="none">None</option>
              <option value="sm">Soft</option>
              <option value="md">Medium</option>
              <option value="lg">Strong</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Köşə radiusu: {v.cornerRadius}px
            </label>
            <input
              type="range"
              min={0}
              max={24}
              step={2}
              value={v.cornerRadius}
              onChange={setNum("cornerRadius")}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fon pattern
            </label>
            <select
              value={v.bgPattern}
              onChange={(e) =>
                set("bgPattern", e.target.value as StyleState["bgPattern"])
              }
              className="w-full rounded-xl p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <option value="none">Yox</option>
              <option value="grid">Grid</option>
              <option value="dots">Dots</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quiet zone (margin)
            </label>
            <label className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                checked={v.includeMargin}
                onChange={(e) => set("includeMargin", e.target.checked)}
              />
              Margin əlavə et
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Padding: {v.padding}px
            </label>
            <input
              type="range"
              min={0}
              max={28}
              step={2}
              value={v.padding}
              onChange={setNum("padding")}
              className="w-full"
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-[auto,1fr,auto] items-center gap-3">
            <label className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                checked={v.label.show}
                onChange={(e) =>
                  set("label", { ...v.label, show: e.target.checked })
                }
              />
              Alt yazı (label) göstər
            </label>
            <input
              placeholder="Məs: Scan for Wi-Fi"
              value={v.label.text}
              onChange={(e) =>
                set("label", { ...v.label, text: e.target.value })
              }
              className="rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Yazı ölçüsü</span>
              <input
                type="range"
                min={10}
                max={18}
                step={1}
                value={v.label.size}
                onChange={(e) =>
                  set("label", {
                    ...v.label,
                    size: parseInt(e.target.value, 10),
                  })
                }
                className="w-24"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
