import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/ui/primitives/input-otp";

interface OTPInputProps {
  value?: string;
  onChange?: (newValue: string) => void;
  OTP_LENGTH?: string | number;
  [key: string]: unknown; // Allows additional props
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value = "",
  onChange,
  OTP_LENGTH = process.env.OTP_LENGTH || "4",
  ...props
}) => {
  const otpLength = Number(OTP_LENGTH);
  const fontSize = useResponsiveFont();

  const [OTP, setOTP] = useState(() =>
    value.replace(/\D/g, "").slice(0, otpLength)
  );

  useEffect(() => {
    const sanitized = value.replace(/\D/g, "").slice(0, otpLength);
    setOTP(sanitized);
  }, [otpLength, value]);

  const formatOTP = (input: string) => {
    return input.replace(/\D/g, "").slice(0, otpLength);
  };

  const handleChange = (newValue: string) => {
    const formatted = formatOTP(newValue);
    setOTP(formatted);
    onChange?.(formatted);
  
  };

  const inputHeight = `${2.5 * fontSize}px`;
  const iconPadding = `${1 * fontSize}px`;
  const iconSize = `${fontSize}px`;

  return (
    <div
      className="m-0 p-0 w-full"
      style={{
        direction: "ltr",
        textAlign: "center",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <InputOTP
        containerClassName="w-full"
        maxLength={otpLength}
        {...props}
        value={OTP}
        onChange={handleChange}
      >
        <InputOTPGroup className="flex flex-wrap gap-2 w-full">
          {[...Array(otpLength)].map((_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className={cn(
                "border-2 flex-1 text-start transition-colors border-teal-500 focus:border-teal-500 focus:ring-teal-500 text-teal-500 dark:text-teal-500"
              )}
              style={{
                fontSize: iconSize,
                height: inputHeight,
                paddingLeft: `calc(${parseInt(iconPadding)}px * 2 + ${iconSize})`,
                paddingRight: `calc(${parseInt(iconPadding)}px * 2 + ${iconSize})`,
              }}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};
