export const cn = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

export const nowStr = () => new Date().toLocaleString();

export const MAX_HISTORY = 10;
