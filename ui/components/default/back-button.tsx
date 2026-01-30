import React from "react";
import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface BackButtonProps {
  href: string;
  text: string;
  Icon?: LucideIcon;
}

const BackButton: React.FC<BackButtonProps> = ({ href, text, Icon=ArrowLeft }) => {
  return (
    <div className="flex justify-start p-4 ">
      <Link
        href={href}
        className="
          flex items-center justify-center gap-2
          px-4 py-2
          bg-blue-600 text-white font-semibold
          rounded-lg
          shadow-md
          hover:bg-blue-700 hover:shadow-lg
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-blue-300
          text-sm
          dark:bg-gray-800
          dark:text-white
          dark:hover:bg-gray-700
          dark:focus:ring-gray-600
        "
      >
        <Icon className="w-5 h-5" />
        {text}
      </Link>
    </div>
  );
};

export default BackButton;
