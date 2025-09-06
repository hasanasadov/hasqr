"use client";
import type { ChangeEvent } from "react";
import type { StyleState, ECCLevel } from "@/types/qr";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";

interface Props {
  value: StyleState;
  onChange: (s: StyleState) => void;
}

// Yalnız number olan açarları seçmək üçün util type
type NumericKeys = {
  [K in keyof StyleState]-?: StyleState[K] extends number ? K : never;
}[keyof StyleState];

export default function StylePanel({ value, onChange }: Props) {
  const set = <K extends keyof StyleState>(k: K, v: StyleState[K]) =>
    onChange({ ...value, [k]: v });

  // Yalnız number tiplər üçün slider/helper
  const setNum =
    <K extends NumericKeys>(k: K) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      set(k, Number(e.target.value) as StyleState[K]);

  return (
    <section className="rounded-2xl border border-white/20 bg-white/70 dark:bg-gray-800/60 backdrop-blur shadow-xl p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5" /> Gelişmiş seçimlər
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ölçü: {value.size}px
          </label>
          <input
            type="range"
            min={140}
            max={520}
            step={20}
            value={value.size}
            onChange={setNum("size")}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Error correction
          </label>
          <select
            value={value.level}
            onChange={(e) => set("level", e.target.value as ECCLevel)}
            className="w-full rounded-xl p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
          >
            <option value="L">L (7%)</option>
            <option value="M">M (15%)</option>
            <option value="Q">Q (25%)</option>
            <option value="H">H (30%)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rəng (ön plan)
            </label>
            <input
              type="color"
              value={value.fgColor}
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
              value={value.bgColor}
              onChange={(e) => set("bgColor", e.target.value)}
              className="h-10 w-full rounded border border-gray-300 dark:border-gray-700 bg-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Render
            </label>
            <select
              value={value.renderAs}
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
              Padding: {value.padding}px
            </label>
            <input
              type="range"
              min={0}
              max={32}
              step={2}
              value={value.padding}
              onChange={setNum("padding")}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="margin"
            type="checkbox"
            checked={value.includeMargin}
            onChange={(e) => set("includeMargin", e.target.checked)}
          />
          <label
            htmlFor="margin"
            className="text-sm text-gray-700 dark:text-gray-300"
          >
            Quiet zone (margin) əlavə et
          </label>
        </div>

        {/* Logo overlay */}
        <div className="md:col-span-2">
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Logo (overlay)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="Logo URL (opsional)"
              value={value.logoUrl}
              onChange={(e) => set("logoUrl", e.target.value)}
              className="rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            />
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Ölçü: {value.logoSizePct}%
              </label>
              <input
                type="range"
                min={0}
                max={40}
                step={2}
                value={value.logoSizePct}
                onChange={setNum("logoSizePct")}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={value.logoShape}
                onChange={(e) =>
                  set("logoShape", e.target.value as StyleState["logoShape"])
                }
                className="rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
              >
                <option value="square">Square</option>
                <option value="circle">Circle</option>
              </select>
              <label
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 border",
                  value.logoBg ? "bg-gray-50 dark:bg-gray-800" : ""
                )}
              >
                <input
                  type="checkbox"
                  checked={value.logoBg}
                  onChange={(e) => set("logoBg", e.target.checked)}
                />
                <span className="text-sm">Ağ fonda</span>
              </label>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Logo yükləmək üçün “Upload” bölməsindən də istifadə edə bilərsiniz
            (fayl URL-i buraya qoyun).
          </p>
        </div>
      </div>
    </section>
  );
}
