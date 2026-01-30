"use client";

import * as React from "react";
import CookieConsent from "./cookie-consent";
import { shouldShowBanner } from "@/lib/client-cookie-utils";

interface CookieConsentControllerProps {
  description?: string;
  learnMoreHref?: string;
}

export default function CookieConsentController({
  description,
  learnMoreHref,
}: CookieConsentControllerProps) {
  const [showBanner, setShowBanner] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // ✅ Check banner visibility on mount
  React.useEffect(() => {
    try {
      setShowBanner(shouldShowBanner());
    } catch (error) {
      console.warn("Failed to check cookie banner status:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // ✅ Sync banner visibility when consent changes (cross-tab + in-page)
  React.useEffect(() => {
    const handleConsentChange = () => {
      try {
        setShowBanner(shouldShowBanner());
      } catch (error) {
        console.warn("Error updating banner state:", error);
      }
    };

    window.addEventListener("storage", handleConsentChange);
    window.addEventListener("consentUpdated", handleConsentChange);

    return () => {
      window.removeEventListener("storage", handleConsentChange);
      window.removeEventListener("consentUpdated", handleConsentChange);
    };
  }, []);

  if (!isLoaded) return null;

  // ✅ Pass through all props to <CookieConsent />
  return showBanner ? (
    <CookieConsent
      description={description}
      learnMoreHref={learnMoreHref}
               onAcceptCallback={() => console.log("✅ Cookies accepted")}
          onDeclineCallback={() => console.log("❌ Cookies declined")}
      showBanner={showBanner}
    />
  ) : null;
}
