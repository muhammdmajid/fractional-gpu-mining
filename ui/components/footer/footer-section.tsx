import Link from "next/link";
import { type FooterSection } from "@/types";

export default function FooterSection({ name, links }: FooterSection) {
  // Handle missing or empty links gracefully
  if (!links || links.length === 0) {
    return (
      <div className="text-center sm:text-left">
        <h3 className="mb-3 text-base font-semibold text-foreground">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground">No links available</p>
      </div>
    );
  }

  return (
    <div className="text-center sm:text-left">
      <h3 className="mb-3 text-base font-semibold text-foreground">
        {name}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => {
          if (!link.url || !link.label) return null; // Skip invalid links
          return (
            <li key={link.url}>
              <Link
                href={link.url}
                className="text-sm text-muted-foreground hover:text-foreground focus:text-foreground transition-colors duration-200 ease-in-out"
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
