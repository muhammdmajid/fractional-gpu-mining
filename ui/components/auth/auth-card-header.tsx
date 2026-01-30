import { CardHeader, CardTitle, CardDescription } from "@/ui/primitives/card";
import Image from "next/image";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { SEO_CONFIG } from "@/config/index";

interface AuthCardHeaderProps {
  title?: string;
  description?: string;
  subText?: string;
}

export default function AuthCardHeader({
  title = "Sign In",
  description = SEO_CONFIG.name,
  subText = "Welcome back! Please sign in to continue",
}: AuthCardHeaderProps) {
  const fontSize = useResponsiveFont();

  return (
    <CardHeader>
      <div className="flex justify-center items-center">
        <Image
          src={SEO_CONFIG.logoSrc}
          alt={
            SEO_CONFIG.logoSrc
              ? `${SEO_CONFIG.name}'s site logo image`
              : "Default Site Logo image"
          }
          width={7 * fontSize}
          height={7 * fontSize}
        />
      </div>
      <CardTitle
        className="font-extrabold text-gray-900 dark:text-gray-100 leading-tight text-center mb-2"
        style={{ fontSize: `${2 * fontSize}px` }}
      >
        {title}
      </CardTitle>
      <CardDescription
        className="font-medium text-gray-800 dark:text-gray-200 tracking-wide text-center"
        style={{ fontSize: `${1 * fontSize}px` }}
      >
        {description}
      </CardDescription>
      <p
        className="text-gray-700 dark:text-gray-300 text-center"
        style={{ fontSize: `${0.8 * fontSize}px` }}
      >
        {subText}
      </p>
    </CardHeader>
  );
}
