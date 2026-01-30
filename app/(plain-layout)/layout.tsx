import "@/css/globals.css";
import type { Metadata } from "next";
import { SEO_CONFIG } from "@/config/index";
import { Header } from "@/ui/components/header/header";
import { Toaster } from "@/ui/primitives/sonner";
import Footer from "@/ui/components/footer";
import { AuthStepProvider } from "@/providers/auth-steps-provider";

// ================================
// 🌟 SEO Metadata
// ================================
export const metadata: Metadata = {
  title: {
    default: SEO_CONFIG.name,
    template: `%s | ${SEO_CONFIG.name}`,
  },
  description: SEO_CONFIG.description,

  openGraph: {
    title: SEO_CONFIG.name,
    description: SEO_CONFIG.description,
    url: SEO_CONFIG.seo.baseUrl,
    siteName: SEO_CONFIG.name,

    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.name,
    description: SEO_CONFIG.description,
    images: [SEO_CONFIG.seo.ogImage],
  },
  metadataBase: new URL(SEO_CONFIG.seo.baseUrl),
};

// ================================
// 🌟 Plain Layout Component
// ================================
export default async function PlainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <AuthStepProvider>
        <div className="min-h-screen flex flex-col items-start justify-center text-center text-foreground bg-background w-full">

          {/* Header */}

          <Header showAuth={true} />

          {/* Main Content */}
          <div className="flex min-h-screen flex-col p-0 m-0 w-full">
            {children}
          </div>

          {/* Footer */}
          <Footer />

          {/* Toast Notifications */}
          <Toaster />
        </div>
      </AuthStepProvider>
  
  );
}
