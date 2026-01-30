"use client";

import * as React from "react";
import { Cookie, Loader2 } from "lucide-react";
import { Button } from "@/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/primitives/card";
import { cn } from "@/lib/utils";
import { setCookieConsent, shouldShowBanner } from "@/lib/client-cookie-utils";

interface CookieConsentProps extends React.HTMLAttributes<HTMLDivElement> {
  showBanner: boolean;
  onAcceptCallback?: () => void;
  onDeclineCallback?: () => void;
  description?: string;
  learnMoreHref?: string;
}

const CookieConsent = React.forwardRef<HTMLDivElement, CookieConsentProps>(
  (
    {
      showBanner,
      onAcceptCallback = () => {},
      onDeclineCallback = () => {},
      className,
      description = "We use cookies to ensure you get the best experience on our website. For more information, please see our cookie policy.",
      learnMoreHref,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [hidden, setHidden] = React.useState(false);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [loading, setLoading] = React.useState(false); // ✅ single unified loader

    const handleAction = React.useCallback(
      async (accept: boolean) => {
        try {
          setLoading(true);
          setCookieConsent({
            essential: true,
            analytics: accept,
            consentGiven: true,
          });
          setIsVisible(false);
          setTimeout(() => setHidden(true), 400);
          if (accept) onAcceptCallback();
          else onDeclineCallback();
        } catch (err) {
          console.error("Cookie action error:", err);
        } finally {
          setLoading(false);
        }
      },
      [onAcceptCallback, onDeclineCallback],
    );

    React.useEffect(() => {
      try {
        const shouldShow =
          typeof showBanner === "boolean" ? showBanner : shouldShowBanner();
        setIsVisible(shouldShow);
        setHidden(!shouldShow);
      } catch (error) {
        console.warn("Failed to determine banner visibility:", error);
      } finally {
        setIsLoaded(true);
      }
    }, [showBanner]);

    if (hidden || !isLoaded) return null;

    const wrapperClasses = cn(
      "fixed z-[9999999] inset-0 flex justify-center items-center transition-all duration-500",
      "bg-black/40 backdrop-blur-sm",
      isVisible ? "opacity-100 visible" : "opacity-0 invisible",
    );

    const cardClasses = cn(
      "shadow-lg transition-all duration-500",
      "max-w-md w-[90%] sm:w-full bg-background",
      className,
    );

    return (
      <div ref={ref} className={wrapperClasses} {...props}>
        <Card className={cardClasses}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              We use cookies
            </CardTitle>
            <Cookie className="h-5 w-5 text-primary" />
          </CardHeader>

          <CardContent className="space-y-2">
            <CardDescription className="text-sm">{description}</CardDescription>
            <p className="text-xs text-muted-foreground">
              By clicking <span className="font-medium">"Accept"</span>, you
              agree to our use of cookies.
            </p>
            {learnMoreHref && (
              <a
                href={learnMoreHref}
                className="text-xs text-primary underline underline-offset-4 hover:no-underline"
              >
                Learn more
              </a>
            )}
          </CardContent>

          <CardFooter className="flex gap-2 pt-2">
            <Button
              onClick={() => handleAction(false)}
              variant="secondary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing…
                </>
              ) : (
                "Decline"
              )}
            </Button>

            <Button
              onClick={() => handleAction(true)}
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing…
                </>
              ) : (
                "Accept"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  },
);

CookieConsent.displayName = "CookieConsent";
export default CookieConsent;
