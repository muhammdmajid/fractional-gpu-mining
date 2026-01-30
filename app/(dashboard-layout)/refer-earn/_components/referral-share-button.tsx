/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC, useState } from "react";
import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import { Card, CardContent } from "@/ui/primitives/card";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
  TelegramShareButton,
  RedditShareButton,
  PinterestShareButton,
} from "react-share";
import {
  FaFacebook,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { Mail, Copy } from "lucide-react";
import { toast } from "sonner";

interface ReferralShareButtonProps {
  referralData?: { referralCode: string; referralLink: string } | null;
  className?: string;
}

const iconSize = 20;

type SharePlatform = {
  name: string;
  Component: FC<any>;
  Icon: FC<{ size?: number }>;
  propsKey: string;
  extraProps?: (link: string) => Record<string, unknown>;
};

const sharePlatforms: SharePlatform[] = [
  { name: "Facebook", Component: FacebookShareButton, Icon: FaFacebook, propsKey: "quote" },
  { name: "Twitter", Component: TwitterShareButton, Icon: FaTwitter, propsKey: "title" },
  { name: "WhatsApp", Component: WhatsappShareButton, Icon: FaWhatsapp, propsKey: "title" },
  { name: "LinkedIn", Component: LinkedinShareButton, Icon: FaLinkedin, propsKey: "title" },
  { name: "Telegram", Component: TelegramShareButton, Icon: FaTelegram, propsKey: "title" },
  { name: "Reddit", Component: RedditShareButton, Icon: FaReddit, propsKey: "title" },
  {
    name: "Pinterest",
    Component: PinterestShareButton,
    Icon: FaPinterest,
    propsKey: "media",
    extraProps: () => ({ media: "https://via.placeholder.com/300" }),
  },
  {
    name: "Email",
    Component: EmailShareButton,
    Icon: Mail,
    propsKey: "subject",
    extraProps: (link: string) => ({ body: link }),
  },
];

export const ReferralShareButton: FC<ReferralShareButtonProps> = ({
  referralData,
  className,
}) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = async (label: string, text: string) => {
    try {
      if (!text) throw new Error("Nothing to copy");
      if (!navigator.clipboard) throw new Error("Clipboard not supported");
      await navigator.clipboard.writeText(text);
      setCopiedItem(label);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy. Please copy manually.");
    }
  };

  const referralLink = referralData?.referralLink?.trim() ?? "";
  const referralCode = referralData?.referralCode?.trim() ?? "";

  if (!referralData || (!referralLink && !referralCode)) {
    return (
      <Card
        className={`w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden 
          bg-gradient-to-br from-[#1a1200] via-[#3b2f00] to-[#6b4f00]
          dark:from-[#fef3c7] dark:via-[#fde68a] dark:to-[#facc15]
          text-[#fffbea] dark:text-[#1c1917]
          border border-[#d4af37]/60 dark:border-[#fffaf0]
          ${className || ""}`}
      >
        <CardContent className="p-6">
          <p className="text-center text-sm opacity-80 font-medium">
            Referral information is not available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden mx-auto
        bg-gradient-to-br from-[#1a1200] via-[#3b2f00] to-[#6b4f00]
        dark:from-[#fef3c7] dark:via-[#fde68a] dark:to-[#facc15]
        text-[#fffbea] dark:text-[#1c1917]
        border border-[#d4af37]/60 dark:border-[#fffaf0]
        hover:shadow-[0_0_20px_rgba(250,200,60,0.4)]
        transition-all duration-500
        ${className || ""}`}
    >
      <CardContent className="space-y-6 p-6 sm:p-8">
        {/* Referral Link */}
        {referralLink && (
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-center">
            <Input
              value={referralLink}
              readOnly
              className="w-full text-sm rounded-lg border-2 border-[#d4af37]/70
                bg-gradient-to-r from-[#3b2f00] to-[#6b4f00]
                dark:from-[#fde68a] dark:to-[#facc15]
                text-[#fffbea] dark:text-[#1c1917]
                focus:border-[#facc15] focus:ring-2 focus:ring-[#d4af37]/70
                transition-all duration-300"
            />
            <Button
              size="sm"
              onClick={() => handleCopy("Link", referralLink)}
              className="w-full sm:w-auto h-full rounded-lg px-4 py-2 font-medium 
                bg-gradient-to-r from-[#d4af37] to-[#b8860b]
                hover:from-[#e6c200] hover:to-[#a87900]
                dark:from-[#fbbf24] dark:to-[#f59e0b]
                dark:hover:from-[#f59e0b] dark:hover:to-[#d97706]
                border-2 border-[#fffaf0] text-white shadow-md 
                transition-all duration-300"
            >
              <Copy className="w-4 h-4 mr-1" />
              {copiedItem === "Link" ? "Copied" : "Copy"}
            </Button>
          </div>
        )}

        {/* Referral Code */}
        {referralCode && (
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-center">
            <Input
              value={referralCode}
              readOnly
              className="w-full text-sm rounded-lg border-2 border-[#d4af37]/70
                bg-gradient-to-r from-[#3b2f00] to-[#6b4f00]
                dark:from-[#fde68a] dark:to-[#facc15]
                text-[#fffbea] dark:text-[#1c1917]
                focus:border-[#facc15] focus:ring-2 focus:ring-[#d4af37]/70
                transition-all duration-300"
            />
            <Button
              size="sm"
              onClick={() => handleCopy("Code", referralCode)}
              className="w-full sm:w-auto h-full rounded-lg px-4 py-2 font-medium 
                bg-gradient-to-r from-[#d4af37] to-[#b8860b]
                hover:from-[#e6c200] hover:to-[#a87900]
                dark:from-[#fbbf24] dark:to-[#f59e0b]
                dark:hover:from-[#f59e0b] dark:hover:to-[#d97706]
                border-2 border-[#fffaf0] text-white shadow-md 
                transition-all duration-300"
            >
              <Copy className="w-4 h-4 mr-1" />
              {copiedItem === "Code" ? "Copied" : "Copy Code"}
            </Button>
          </div>
        )}

        {/* Social Share Buttons */}
        {referralLink ? (
          <div className="flex flex-wrap gap-3 justify-start">
            {sharePlatforms.map(({ name, Component, Icon, propsKey, extraProps }) => (
              <Component
                key={name}
                url={referralLink}
                {...{ [propsKey]: "Join this platform and earn rewards!" }}
                {...(extraProps ? extraProps(referralLink) : {})}
              >
                <div
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
                    bg-gradient-to-r from-[#d4af37] to-[#b8860b]
                    hover:from-[#e6c200] hover:to-[#a87900]
                    dark:from-[#fbbf24] dark:to-[#f59e0b]
                    dark:hover:from-[#f59e0b] dark:hover:to-[#d97706]
                    text-white shadow-md border-2 border-[#fffaf0]
                    transition-all duration-300"
                >
                  <Icon size={iconSize} /> {name}
                </div>
              </Component>
            ))}
          </div>
        ) : (
          <p className="text-sm opacity-80 font-medium">
            No link available for sharing.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
