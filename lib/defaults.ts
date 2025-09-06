import type { ContentState, StyleState } from "@/types/qr";

export const DEFAULT_STYLE: StyleState = {
  size: 260,
  level: "M",
  fgColor: "#111827",
  bgColor: "#ffffff",
  includeMargin: true,
  renderAs: "canvas",
  padding: 12,

  logoUrl: "",
  logoSizePct: 20,
  logoShape: "square",
  logoBg: true,

  cornerRadius: 16,
  shadow: "md",
  frame: "card",
  bgPattern: "none",
  label: { show: false, text: "", size: 12 },
};

export const DEFAULT_CONTENT: ContentState = {
  type: "free",
  freeText: "",
  url: "",
  utm: {
    enabled: false,
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
  },
  wifi: { ssid: "", password: "", enc: "WPA", hidden: false },
  contact: {
    firstName: "",
    lastName: "",
    org: "",
    title: "",
    email: "",
    phone: "",
    url: "",
  },
  file: { url: "", name: "", mime: "" },
};
