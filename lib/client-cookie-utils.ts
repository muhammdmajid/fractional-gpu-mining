// ============================================================================
// 🧠 Cookie Consent Utility — Centralized Logic
// Version: 1.0
// Description: Handles getting, setting, and validating user cookie consent.
// ============================================================================

export interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  consentGiven: boolean;
  timestamp: number;
  version: string;
}

// Constants
const CONSENT_COOKIE_NAME = "cookie_consent";
const CONSENT_DURATION = 12 * 30 * 24 * 60 * 60 * 1000; // 12 months
const CONSENT_VERSION = "1.0";

// 🧩 Get current consent from cookies
export function getCookieConsent(): CookieConsent | null {
  try {
    if (typeof window === "undefined") return null;

    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(CONSENT_COOKIE_NAME + "="));

    if (!cookie) return null;
    const cookieValue = cookie.split("=")[1];
    if (!cookieValue) return null;

    const consent = JSON.parse(decodeURIComponent(cookieValue));

    // ✅ Validate structure
    if (
      typeof consent !== "object" ||
      typeof consent.essential !== "boolean" ||
      typeof consent.analytics !== "boolean" ||
      typeof consent.consentGiven !== "boolean" ||
      typeof consent.timestamp !== "number" ||
      typeof consent.version !== "string"
    ) {
      console.warn("⚠️ Invalid cookie consent structure — resetting consent");
      return null;
    }

    return consent;
  } catch (error) {
    console.error("❌ Error parsing cookie consent:", error);
    return null;
  }
}

// ✅ Check if consent is valid (exists, not expired, correct version)
export function hasValidConsent(): boolean {
  const consent = getCookieConsent();
  if (!consent || !consent.consentGiven) return false;

  const isExpired = Date.now() - consent.timestamp > CONSENT_DURATION;
  if (isExpired) return false;

  return consent.version === CONSENT_VERSION;
}

// ✅ Should analytics be enabled?
export function shouldShowAnalytics(): boolean {
  const consent = getCookieConsent();
  return hasValidConsent() && consent?.analytics === true;
}

// ✅ Should the banner be shown?
export function shouldShowBanner(): boolean {
  return !hasValidConsent();
}

// ✅ Set / update cookie consent
export function setCookieConsent(
  consent: Omit<CookieConsent, "timestamp" | "version">,
): void {
  try {
    const fullConsent: CookieConsent = {
      ...consent,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };

    const cookieValue = encodeURIComponent(JSON.stringify(fullConsent));
    const maxAge = CONSENT_DURATION / 1000;

    // Secure cookie in production, Lax for dev
    document.cookie = `${CONSENT_COOKIE_NAME}=${cookieValue}; path=/; max-age=${maxAge}; samesite=lax${
      process.env.NODE_ENV === "production" ? "; secure" : ""
    }`;

    // Dispatch custom event for cross-tab + in-page updates
    window.dispatchEvent(
      new CustomEvent("consentUpdated", { detail: fullConsent }),
    );

    console.log("✅ Cookie consent updated:", fullConsent);
  } catch (error) {
    console.error("❌ Error setting cookie consent:", error);
  }
}
