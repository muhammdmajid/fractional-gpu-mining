/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/ui/primitives/card';
import { Button } from '@/ui/primitives/button';
import useResponsiveFont from '@/lib/hooks/use-responsive-font';
import { SEO_CONFIG } from '@/config';

interface ContactUsSectionProps {}

const ContactUsSection: FC<ContactUsSectionProps> = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const custom_font_size = useResponsiveFont();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { fontSizePx, headingFontSize, subHeadingFontSize } = useMemo(() => {
    const fontSizePx = `${custom_font_size * 1.05}px`; // base text slightly larger
    const headingFontSize = `${1.8 * custom_font_size}px`; // bigger small heading
    const subHeadingFontSize = `${1.4 * custom_font_size}px`; // stylish h2 size
    return { fontSizePx, headingFontSize, subHeadingFontSize };
  }, [custom_font_size]);

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full"
    >
      <Card className="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 hover:shadow-2xl">
        <CardContent className="p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Small Heading */}
          <p
            className="text-slate-900 dark:text-slate-100 font-bold tracking-wide uppercase text-center"
            style={{
              fontSize: headingFontSize,
              fontFamily: "'Poppins', 'Segoe UI', sans-serif",
              letterSpacing: '0.05em',
            }}
          >
            Have More Questions?
          </p>

          {/* Title */}
          <h2
            className="font-extrabold text-indigo-700 dark:text-indigo-400 mt-3 mb-6 text-center"
            style={{
              fontSize: subHeadingFontSize,
              fontFamily: "'Inter', 'Roboto Slab', serif",
              lineHeight: 1.3,
            }}
          >
            Get in Touch with Us
          </h2>

          {/* Description */}
 <p
  className="text-slate-700 dark:text-slate-300 mb-6 sm:mb-8 leading-relaxed text-left"
  style={{
    fontSize: fontSizePx,
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    lineHeight: 1.7,
  }}
>
  Our support team at{" "}
  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
    {SEO_CONFIG.name}
  </span>{" "}
  is here to assist you with{" "}
  <span className="font-medium italic">
    account setup, mining plans, withdrawals,
  </span>{" "}
  and technical issues. Whether you&apos;re a beginner or an experienced
  investor, we’ll guide you every step of the way. Reach out via email,
  live chat, or WhatsApp — we’re available{" "}
  <span className="font-bold text-green-600 dark:text-green-400">
    24/7
  </span>
  .
</p>


          {/* CTA Button */}
          <div className="flex justify-center">
            <Button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition duration-300 ease-in-out hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500"
              style={{
                fontSize: `${custom_font_size * 1.1}px`,
                fontFamily: "'Poppins', sans-serif",
              }}
              asChild
            >
              <a href="/contact-us" title="Contact Us">
                Contact Us
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactUsSection;
