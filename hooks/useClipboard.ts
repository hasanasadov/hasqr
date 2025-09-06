"use client";
import { useCallback, useState } from "react";

export function useClipboard(timeout = 1200) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch {}
  }, [timeout]);
  return { copied, copy };
}
