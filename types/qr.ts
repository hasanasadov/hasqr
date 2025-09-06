export type ECCLevel = "L" | "M" | "Q" | "H";
export type ContentType = "free" | "url" | "wifi" | "contact" | "file";
export type WiFiEnc = "WPA" | "WEP" | "nopass";

export interface HistoryItem {
  value: string;
  type: "text" | "file";
  date: string;
  contentType?: ContentType;
  meta?: Partial<ContentState>;
}

export interface UrlUtm {
  enabled: boolean;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

export interface ContentState {
  type: ContentType;
  // free
  freeText: string;
  // url
  url: string;
  utm: UrlUtm;
  // wifi
  wifi: {
    ssid: string;
    password: string;
    enc: WiFiEnc;
    hidden: boolean;
  };
  // contact (vCard mini)
  contact: {
    firstName: string;
    lastName: string;
    org: string;
    title: string;
    email: string;
    phone: string;
    url: string;
  };
  // file (uploaded or manual URL)
  file: {
    url: string;
    name?: string;
    mime?: string;
  };
}

export interface StyleState {
  size: number;
  level: ECCLevel;
  fgColor: string;
  bgColor: string;
  includeMargin: boolean;
  renderAs: "canvas" | "svg";
  padding: number;

  logoUrl: string;
  logoSizePct: number; // 0..40
  logoShape: "square" | "circle";
  logoBg: boolean;

  cornerRadius: number;
  shadow: "none" | "sm" | "md" | "lg";
  frame: "plain" | "card" | "sticker";
  bgPattern: "none" | "grid" | "dots";
  label: { show: boolean; text: string; size: number };
}
