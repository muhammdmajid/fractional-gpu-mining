"use client";

import { Button } from "@/ui/primitives/button";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa";

interface SocialLoginButtonsProps {
  loading?: boolean;
  onGitHubLogin: () => void;
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
}

/**
 * Renders social login buttons for GitHub, Google, and Facebook.
 * Accepts click handlers for each provider and a loading state to disable buttons.
 */
export default function SocialLoginButtons({
  loading = false,
  onGitHubLogin,
  onGoogleLogin,
  onFacebookLogin,
}: SocialLoginButtonsProps) {
  // Define the providers with labels, icons, and click handlers
  const providers = [

    {
      label: "Google",
      icon: <FaGoogle className="h-5 w-5" />,
      onClick: onGoogleLogin,
    },    {
      label: "GitHub",
      icon: <FaGithub className="h-5 w-5" />,
      onClick: onGitHubLogin,
    },
    // {
    //   label: "Facebook",
    //   icon: <FaFacebook className="h-5 w-5 text-blue-600" />,
    //   onClick: onFacebookLogin,
    // },
  ];

  return (
    // Responsive wrapper to handle layout on different screen sizes
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {providers.map((provider) => (
        <Button
          key={provider.label}
          className="flex items-center justify-center gap-2 w-full"
          disabled={loading}
          onClick={provider.onClick}
          variant="outline"
        >
          {provider.icon}
          {provider.label}
        </Button>
      ))}
    </div>
  );
}
