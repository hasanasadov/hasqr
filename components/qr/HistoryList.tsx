"use client";

import type { HistoryItem } from "@/types/qr";
import { History, Trash2 } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

export default function HistoryList({
  items,
  onPick,
  onClear,
}: {
  items: HistoryItem[];
  onPick: (value: HistoryItem) => void;
  onClear: () => void;
}) {
  const mounted = useMounted();

  const showClear = mounted && items.length > 0;
  const showList = mounted && items.length > 0;

  return (
    <section className="rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-800/60 backdrop-blur shadow-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <History className="w-5 h-5" /> History
        </h3>
        {showClear && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            <Trash2 className="w-4 h-4" /> Təmizlə
          </button>
        )}
      </div>

      {!showList ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Hələ heç bir nəticə yoxdur.
        </p>
      ) : (
        <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {items.map((it, i) => (
            <li key={i}>
              <button
                onClick={() => onPick(it)}
                className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-3"
                title="Bu nəticəni göstər"
              >
                <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                  {it.contentType ?? (it.type === "file" ? "file" : "free")}
                </span>
                <span className="truncate flex-1 text-sm text-gray-800 dark:text-gray-100">
                  {it.value}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {it.date}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
