import { SEO_CONFIG } from "@/config/index";
import { Section, Link, Img, Heading, Text } from "@react-email/components";

export interface HeaderProps {
  url?: string;
}

export function Header({ url }: HeaderProps) {
  const logoUrl = SEO_CONFIG.logoSrc;
  const brandName = SEO_CONFIG.name;
  const brandDescription = SEO_CONFIG.description;
  const effectiveBaseUrl = url || SEO_CONFIG.seo.baseUrl;

  return (
    <Section
      style={{
        backgroundColor: "#1e293b", // slate-800
        padding: "32px 40px",
        textAlign: "center",
      }}
    >
      <Link
        href={effectiveBaseUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Go to ${brandName} homepage`}
        style={{ display: "inline-block", textDecoration: "none" }}
      >
        <Img
          src={logoUrl}
          alt={`${brandName} Logo`}
          width="200"
          style={{ margin: "0 auto", display: "block" }}
        />
      </Link>
      <Heading
        as="h1"
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#ffffff",
          marginTop: "16px",
          marginBottom: "8px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {brandName}
      </Heading>
      <Text
        style={{
          fontSize: "16px",
          lineHeight: "24px",
          color: "#cbd5e1", // slate-300
          margin: "0",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {brandDescription}
      </Text>
    </Section>
  );
}
