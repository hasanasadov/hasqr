import type { ContentState } from "@/types/qr";

export function buildQRValue(state: ContentState): string {
  switch (state.type) {
    case "free":
      return state.freeText.trim();
    case "url":
      try {
        const u = new URL(state.url.trim());
        if (state.utm.enabled) {
          const { source, medium, campaign, term, content } = state.utm;
          if (source) u.searchParams.set("utm_source", source);
          if (medium) u.searchParams.set("utm_medium", medium);
          if (campaign) u.searchParams.set("utm_campaign", campaign);
          if (term) u.searchParams.set("utm_term", term);
          if (content) u.searchParams.set("utm_content", content);
        }
        return u.toString();
      } catch {
        return state.url.trim();
      }
    case "wifi": {
      const { ssid, password, enc, hidden } = state.wifi;
      const E = enc === "nopass" ? "nopass" : enc;
      const P = enc === "nopass" ? "" : `;P:${escapeWifi(password)};`;
      const H = hidden ? "H:true;" : "";
      return `WIFI:T:${E};S:${escapeWifi(ssid)};${P}${H};`;
    }
    case "contact": {
      const c = state.contact;
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${c.lastName};${c.firstName};;;`,
        `FN:${[c.firstName, c.lastName].filter(Boolean).join(" ")}`,
        c.org ? `ORG:${c.org}` : "",
        c.title ? `TITLE:${c.title}` : "",
        c.phone ? `TEL;TYPE=CELL:${c.phone}` : "",
        c.email ? `EMAIL;TYPE=INTERNET:${c.email}` : "",
        c.url ? `URL:${c.url}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
    }
    case "file":
      return state.file.url.trim();
  }
}

function escapeWifi(s: string) {
  return s.replace(/([\\;,:"])/g, "\\$1");
}
export function parseWifiPayload(payload: string): ContentState["wifi"] | null {
  if (!payload || !/^WIFI:/i.test(payload)) return null;
  const body = payload.replace(/^WIFI:/i, "");
  const parts = body.split(/;+/).filter(Boolean);
  let T = "WPA",
    S = "",
    P = "",
    H = "false";
  for (const p of parts) {
    const [k, ...rest] = p.split(":");
    const v = rest.join(":");
    if (k === "T") T = v;
    else if (k === "S") S = unescapeWifi(v);
    else if (k === "P") P = unescapeWifi(v);
    else if (k === "H") H = v;
  }
  return {
    ssid: S,
    password: P,
    enc: (T as "WPA" | "WEP" | "nopass") || "WPA",
    hidden: /^true$/i.test(H),
  };
}
function unescapeWifi(s: string) {
  return s.replace(/\\([\\;,:"])/g, "$1");
}
