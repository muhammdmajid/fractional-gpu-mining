import { SEO_CONFIG } from "@/config/index";
import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

type SocialLinksProps = {
  urls?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
    linkedin?: string;
  };
};

export default function SocialLinks({ urls=SEO_CONFIG.siteInfo.socialMediaLinks }: SocialLinksProps) {
  // Map URLs to icon components
  const socialLinks = [
    { href: urls.facebook, label: "Facebook", icon: FaFacebook },
    { href: urls.twitter, label: "Twitter", icon: FaTwitter },
    { href: urls.instagram, label: "Instagram", icon: FaInstagram },
    { href: urls.github, label: "GitHub", icon: FaGithub },
    { href: urls.linkedin, label: "LinkedIn", icon: FaLinkedin },
  ];

  // Filter out undefined or empty URLs
  const validLinks = socialLinks.filter((social) => social.href && social.label);

  // Optional: warn in development if any URL is missing
  if (process.env.NODE_ENV === "development") {
    socialLinks.forEach((social) => {
      if (!social.href) {
        console.warn(`Social link for ${social.label} is missing!`);
      }
    });
  }

  // Handle empty links gracefully
  if (validLinks.length === 0) {
    return (
      <p className="text-gray-400 dark:text-gray-500 text-sm">
        No social links available.
      </p>
    );
  }

  return (
    <div className="flex space-x-4">
      {validLinks.map((social) => {
        const Icon = social.icon;
        return (
          <Link
            key={social.label}
            href={social.href!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="
              h-8 w-8 rounded-full flex items-center justify-center
              text-gray-700 dark:text-gray-300
              bg-transparent
              border border-transparent
              hover:border-gray-400 dark:hover:border-gray-500
              hover:shadow-md dark:hover:shadow-lg
              active:scale-90
              transition-all duration-150
            "
          >
            <Icon className="h-4 w-4" />
          </Link>
        );
      })}
    </div>
  );
}
