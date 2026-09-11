import type { Locale } from "../types";

const SENSITIVE_MASK = "...";
const URL_PROTOCOL_RE = /^([a-zA-Z][a-zA-Z0-9+\-.]*:\/\/)/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface MaskOptions {
  prefixVisible: number;
  suffixVisible: number;
  maskEmailDomain: boolean;
}

const DEFAULT_MASK_OPTIONS: MaskOptions = {
  prefixVisible: 3,
  suffixVisible: 3,
  maskEmailDomain: false,
};

const MIN_MASKED_CHARS = 2;

const maskMiddleChars = (value: string, prefixVisibleCount: number, suffixVisibleCount: number) => {
  const chars = Array.from(value);
  if (chars.length <= MIN_MASKED_CHARS) {
    return SENSITIVE_MASK;
  }

  const available = chars.length - MIN_MASKED_CHARS;
  const totalRequested = prefixVisibleCount + suffixVisibleCount;
  let prefix: number, suffix: number;
  if (totalRequested <= available) {
    prefix = prefixVisibleCount;
    suffix = suffixVisibleCount;
  } else {
    prefix = totalRequested > 0 ? Math.floor(available * prefixVisibleCount / totalRequested) : 0;
    suffix = Math.min(suffixVisibleCount, available - prefix);
  }

  return `${chars.slice(0, prefix).join("")}${SENSITIVE_MASK}${chars.slice(chars.length - suffix).join("")}`;
};

// Format a timestamp as a concise relative time string.
export const getConciseTime = (timestamp: number, language: Locale) => {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);

  if (language === "zh") {
    if (seconds < 60) return "< 1分钟";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`;
    return `${Math.floor(seconds / 86400)}天前`;
  } else {
    if (seconds < 60) return "< 1m";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
};

export const formatSensitivePreview = (
  content: string,
  contentType: string,
  options?: Partial<MaskOptions>
) => {
  if (!content) return "";

  const opts = { ...DEFAULT_MASK_OPTIONS, ...options };

  if (contentType === "url") {
    const protocolMatch = content.match(URL_PROTOCOL_RE);
    if (!protocolMatch) {
      return maskMiddleChars(content, opts.prefixVisible, opts.suffixVisible);
    }

    const protocol = protocolMatch[0];
    const rest = content.slice(protocol.length);
    const maskedRest = maskMiddleChars(rest, opts.prefixVisible, opts.suffixVisible);
    return `${protocol}${maskedRest}`;
  }

  if (EMAIL_RE.test(content.trim())) {
    const email = content.trim();
    const atIndex = email.indexOf("@");
    const localPart = email.slice(0, atIndex);
    const domainPart = email.slice(atIndex + 1);

    const maskedLocal = maskMiddleChars(localPart, opts.prefixVisible, opts.suffixVisible);
    if (opts.maskEmailDomain) {
      const maskedDomain = maskMiddleChars(domainPart, opts.prefixVisible, opts.suffixVisible);
      return `${maskedLocal}@${maskedDomain}`;
    }
    return `${maskedLocal}@${domainPart}`;
  }

  return maskMiddleChars(content, opts.prefixVisible, opts.suffixVisible);
};
