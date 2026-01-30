import Link from "next/link";

import { SEO_CONFIG } from "@/config/index";
import { cn } from "@/lib/cn";
import SocialLinks from "./social-links";
import FooterSection from "./footer-section";
import NewsLetter from "./newsletter";
import FooterDashboard from "./footer-dahboard";
import { FOOTER_LINKS } from "@/data/navigations";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t bg-background w-full  flex flex-col items-center justify-center text-center", className)}>
      <div
        className={`
          container mx-auto px-4 py-12 
          sm:px-6
          lg:px-8
        `}
      >
        <div
          className={`
            grid grid-cols-1 gap-8 pb-3
            md:grid-cols-4
          `}
        >
          <div className="space-y-4">
            <Link
              className="flex items-center gap-2"
              href={SEO_CONFIG.seo.baseUrl}
            >
              <span
                className={`
                  bg-gradient-to-r from-primary to-primary/70 bg-clip-text
                  text-xl font-bold tracking-tight text-transparent
                `}
              >
                {SEO_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground  text-left">
              {SEO_CONFIG.description}
            </p>
            <SocialLinks  />
          </div>
          {FOOTER_LINKS.map((section) => (
            <FooterSection
              key={section.name}
              name={section.name}
              links={section.links}
            />
          ))}
          <NewsLetter/>
        </div>
       <FooterDashboard/>
      </div>
    </footer>
  );
}
