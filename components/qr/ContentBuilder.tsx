"use client";

import { JSX, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Link2,
  Wifi,
  Contact,
  Wand2,
  FileUp,
  type LucideIcon,
} from "lucide-react";
import type { ContentState, ContentType, WiFiEnc } from "@/types/qr";
import { cn } from "@/lib/utils";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

interface Props {
  value: ContentState;
  onChange: (s: ContentState) => void;
  onGenerate: () => void;
}

export default function ContentBuilder({ value, onChange, onGenerate }: Props) {
  const tabs: { key: ContentType; label: JSX.Element; icon: LucideIcon }[] =
    useMemo(
      () => [
        {
          key: "free",
          label: <span className="whitespace-nowrap">Mətn/Link</span>,
          icon: FileText,
        },
        {
          key: "url",
          label: <span className="whitespace-nowrap">URL + UTM</span>,
          icon: Link2,
        },
        {
          key: "wifi",
          label: <span className="whitespace-nowrap">Wi-Fi</span>,
          icon: Wifi,
        },
        {
          key: "contact",
          label: <span className="whitespace-nowrap">Kontakt</span>,
          icon: Contact,
        },
        {
          key: "file",
          label: (
            <span className="whitespace-nowrap">
              Fayl{" "}
              <span className="hidden sm:inline">
                (şəkil/video/musiqi/sənəd)
              </span>
            </span>
          ),
          icon: FileUp,
        },
      ],
      []
    );

  return (
    <section className="rounded-2xl border border-white/20 bg-white/80 dark:bg-gray-800/60 backdrop-blur shadow-xl p-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = value.type === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange({ ...value, type: t.key })}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm border whitespace-nowrap",
                active
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              )}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {value.type === "free" && (
          <FreeForm value={value} onChange={onChange} />
        )}
        {value.type === "url" && <UrlForm value={value} onChange={onChange} />}
        {value.type === "wifi" && (
          <WifiForm value={value} onChange={onChange} />
        )}
        {value.type === "contact" && (
          <ContactForm value={value} onChange={onChange} />
        )}
        {value.type === "file" && (
          <FileForm value={value} onChange={onChange} />
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onGenerate}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white font-semibold py-2.5 hover:bg-indigo-700 transition"
      >
        <Wand2 className="w-5 h-5" /> QR yarat
      </motion.button>
    </section>
  );
}

/* UI helpers */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {children}
    </label>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, value, ...rest } = props;
  const v = (value as string | number | readonly string[] | undefined) ?? "";
  return (
    <input
      {...rest}
      value={v}
      className={cn(
        "w-full rounded-xl px-3 py-2",
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
        "text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500",
        className
      )}
    />
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, value, ...rest } = props;
  const v = (value as string | undefined) ?? "";
  return (
    <textarea
      rows={3}
      {...rest}
      value={v}
      className={cn(
        "w-full rounded-xl p-3",
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
        "text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500",
        className
      )}
    />
  );
}

/* Forms */
function FreeForm({
  value,
  onChange,
}: {
  value: ContentState;
  onChange: (s: ContentState) => void;
}) {
  return (
    <div>
      <Label>Mətn və ya link</Label>
      <Textarea
        placeholder="https://example.com və ya istənilən mətn…"
        value={value.freeText}
        onChange={(e) => onChange({ ...value, freeText: e.target.value })}
      />
    </div>
  );
}

function UrlForm({
  value,
  onChange,
}: {
  value: ContentState;
  onChange: (s: ContentState) => void;
}) {
  const u = value.utm;
  return (
    <div className="space-y-4">
      <div>
        <Label>URL</Label>
        <Input
          placeholder="https://example.com"
          value={value.url}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="utm"
          type="checkbox"
          checked={u.enabled}
          onChange={(e) =>
            onChange({ ...value, utm: { ...u, enabled: e.target.checked } })
          }
        />
        <label
          htmlFor="utm"
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          UTM parametrləri əlavə et
        </label>
      </div>
      {u.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="utm_source"
            value={u.source}
            onChange={(e) =>
              onChange({ ...value, utm: { ...u, source: e.target.value } })
            }
          />
          <Input
            placeholder="utm_medium"
            value={u.medium}
            onChange={(e) =>
              onChange({ ...value, utm: { ...u, medium: e.target.value } })
            }
          />
          <Input
            placeholder="utm_campaign"
            value={u.campaign}
            onChange={(e) =>
              onChange({ ...value, utm: { ...u, campaign: e.target.value } })
            }
          />
          <Input
            placeholder="utm_term (ops.)"
            value={u.term}
            onChange={(e) =>
              onChange({ ...value, utm: { ...u, term: e.target.value } })
            }
          />
          <Input
            placeholder="utm_content (ops.)"
            value={u.content}
            onChange={(e) =>
              onChange({ ...value, utm: { ...u, content: e.target.value } })
            }
          />
        </div>
      )}
    </div>
  );
}

function WifiForm({
  value,
  onChange,
}: {
  value: ContentState;
  onChange: (s: ContentState) => void;
}) {
  const w = value.wifi;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>SSID</Label>
        <Input
          value={w.ssid}
          onChange={(e) =>
            onChange({ ...value, wifi: { ...w, ssid: e.target.value } })
          }
        />
      </div>
      <div>
        <Label>Şifrə</Label>
        <Input
          value={w.password}
          onChange={(e) =>
            onChange({ ...value, wifi: { ...w, password: e.target.value } })
          }
        />
      </div>
      <div>
        <Label>Şifrələmə</Label>
        <select
          value={w.enc}
          onChange={(e) =>
            onChange({
              ...value,
              wifi: { ...w, enc: e.target.value as WiFiEnc },
            })
          }
          className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
        >
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">Şifrəsiz</option>
        </select>
      </div>
      <div className="flex items-center gap-2 pt-6">
        <input
          id="h"
          type="checkbox"
          checked={w.hidden}
          onChange={(e) =>
            onChange({ ...value, wifi: { ...w, hidden: e.target.checked } })
          }
        />
        <label htmlFor="h" className="text-sm text-gray-700 dark:text-gray-300">
          Gizli SSID
        </label>
      </div>
    </div>
  );
}

function ContactForm({
  value,
  onChange,
}: {
  value: ContentState;
  onChange: (s: ContentState) => void;
}) {
  const c = value.contact;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input
        placeholder="Ad"
        value={c.firstName}
        onChange={(e) =>
          onChange({ ...value, contact: { ...c, firstName: e.target.value } })
        }
      />
      <Input
        placeholder="Soyad"
        value={c.lastName}
        onChange={(e) =>
          onChange({ ...value, contact: { ...c, lastName: e.target.value } })
        }
      />
      <Input
        placeholder="Şirkət"
        value={c.org}
        onChange={(e) =>
          onChange({ ...value, contact: { ...c, org: e.target.value } })
        }
      />
      <Input
        placeholder="Vəzifə"
        value={c.title}
        onChange={(e) =>
          onChange({ ...value, contact: { ...c, title: e.target.value } })
        }
      />
      <Input
        placeholder="E-mail"
        value={c.email}
        onChange={(e) =>
          onChange({ ...value, contact: { ...c, email: e.target.value } })
        }
      />
      <Input
        placeholder="Telefon"
        value={c.phone}
        onChange={(e) =>
          onChange({ ...value, contact: { ...c, phone: e.target.value } })
        }
      />
      <div className="md:col-span-2">
        <Input
          placeholder="Sayt"
          value={c.url}
          onChange={(e) =>
            onChange({ ...value, contact: { ...c, url: e.target.value } })
          }
        />
      </div>
    </div>
  );
}

function FileForm({
  value,
  onChange,
}: {
  value: ContentState;
  onChange: (s: ContentState) => void;
}) {
  const { upload, uploading, progress, error, canUpload, setError } =
    useCloudinaryUpload();
  const [drag, setDrag] = useState<boolean>(false);

  async function handleFile(file?: File | null) {
    if (!file) return;
    try {
      const localUrl = URL.createObjectURL(file);
      onChange({
        ...value,
        file: { url: localUrl, name: file.name, mime: file.type },
      });
      const url = await upload(file);
      onChange({ ...value, file: { url, name: file.name, mime: file.type } });
      setTimeout(() => URL.revokeObjectURL(localUrl), 30000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-3">
      <Label>Fayl URL</Label>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="https://… (şəkil, video, musiqi, sənəd)"
          value={value.file.url}
          onChange={(e) =>
            onChange({ ...value, file: { ...value.file, url: e.target.value } })
          }
        />
        <button
          type="button"
          onClick={() => {
            if (!canUpload) return;
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "*/*";
            input.onchange = () => handleFile(input.files?.[0] || null);
            input.click();
          }}
          disabled={!canUpload}
          className="shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          title={canUpload ? "Yüklə" : "Cloudinary env tələb olunur"}
        >
          Yüklə
        </button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFile(e.dataTransfer?.files?.[0]);
        }}
        className={cn(
          "rounded-xl p-6 text-center transition border-2 border-dashed",
          drag
            ? "border-indigo-500 bg-indigo-50/70 dark:bg-indigo-900/20"
            : "border-gray-300 dark:border-gray-600"
        )}
      >
        {canUpload
          ? "Sürüklə və burax, ya da yuxarıdan yüklə"
          : "Cloudinary env tələb olunur"}
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{progress}%</span>
        </div>
      )}
      {error && (
        <div
          className="text-xs text-red-600 dark:text-red-300"
          onAnimationEnd={() => setError(null)}
        >
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Dəstəklənir: <b>şəkil</b>, <b>video</b>, <b>musiqi</b>, <b>sənəd</b>.
        Yüklədikdən sonra link avtomatik yazılır.
      </p>
    </div>
  );
}
