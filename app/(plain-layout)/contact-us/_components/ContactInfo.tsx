import { SEO_CONFIG } from "@/config";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const contactDetails = [
  {
    icon: MapPin,
    label: "Office Address",
    value: SEO_CONFIG.siteInfo.address,
  },
  { icon: Phone, label: "Phone", value: SEO_CONFIG.siteInfo.phone },
  { icon: Mail, label: "Email", value: SEO_CONFIG.siteInfo.email },
];

const ContactInfo = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const customFontSize = useResponsiveFont();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full space-y-8 transition-all duration-300">
      {/* Header */}
      <header className="space-y-3 text-center md:text-left">
        <h2
          className="font-extrabold text-slate-900 dark:text-slate-100 tracking-tight"
          style={{
            fontSize: `${2 * customFontSize}px`,
            fontFamily: "'Poppins', 'Inter', sans-serif",
          }}
        >
          Contact Information
        </h2>
        <p
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0"
          style={{
            fontSize: `${customFontSize}px`,
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif",
            lineHeight: 1.7,
          }}
        >
          Get in touch with us using the details below. We’re here to support
          you every step of the way.
        </p>
      </header>

      {/* Google Map */}
      <section>
        <iframe
          title={SEO_CONFIG.name}
          className="h-[23000px] sm:h-[320px] md:h-[360px] w-full rounded-xl border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-slate-800"
          src={SEO_CONFIG.siteInfo.location}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      {/* Contact Details */}
      <section className="space-y-6">
        {contactDetails.map(({ icon: Icon, label, value }, index) => (
          <div
            key={index}
            className="flex items-start gap-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-xl shadow-sm dark:shadow-slate-900 hover:shadow-md dark:hover:shadow-lg transition-all duration-300"
          >
            <div className="flex-shrink-0">
              <Icon
                className="h-7 w-7 text-indigo-600 dark:text-indigo-400"
                style={{ fontSize: `${customFontSize}px` }}
              />
            </div>
            <div>
              <p
                className="font-semibold text-gray-900 dark:text-gray-100"
                style={{
                  fontSize: `${1.1 * customFontSize}px`,
                  fontFamily: "'Poppins', 'Inter', sans-serif",
                }}
              >
                {label}
              </p>
              <p
                className="text-gray-600 dark:text-gray-400"
                style={{ fontSize: `${customFontSize}px` }}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ContactInfo;
