/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "react-hook-form";
import useResponsiveFont from "@/lib/hooks/use-responsive-font";
import { Textarea } from "@/ui/primitives/textarea";
import { Input } from "@/ui/primitives/input";
import { Button } from "@/ui/primitives/button";


type BaseProps<T> = {
  errors?: FieldError;
  RightIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  LeftIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onRightIconClick?: () => void;
  as?: "input" | "textarea";
} & React.RefAttributes<T>;

type InputProps = BaseProps<HTMLInputElement> &
  React.InputHTMLAttributes<HTMLInputElement> & {
    as?: "input";
  };

type TextareaProps = BaseProps<HTMLTextAreaElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };

type IconInputProps = InputProps | TextareaProps;

const IconInput = React.forwardRef<HTMLElement, IconInputProps>(
  (
    {
      className,
      disabled = false,
      errors,
      RightIcon,
      LeftIcon,
      onRightIconClick,
      as = "input",
      ...restProps
    },
    ref
  ) => {
   const fontSize = useResponsiveFont();
    const inputHeight =
      typeof (restProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)?.rows === "number"
        ? `${(restProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>).rows! * 2.5 * fontSize}px`
        : `${2.5 * fontSize}px`;
    const iconPadding = `${1 * fontSize}px`;
    const hasError = Boolean(errors);

    const colorClass = hasError
      ? "text-red-500 dark:text-red-500"
      : "text-teal-500 dark:text-teal-500";

    const iconClassName = cn("dark:text-white text-gray-900", colorClass);
    const iconSize = `${fontSize}px`;

    const commonIconProps = {
      style: { width: iconSize, height: iconSize },
      className: iconClassName,
    };

    const sharedProps = {
      disabled,
      className: cn(
        "border-2 w-full text-start font-normal transition-colors",
        hasError
          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
          : "border-teal-500 focus:border-teal-500 focus:ring-teal-500",
        colorClass
      ),
      style: {
        fontSize: iconSize,
        height: inputHeight,
        paddingLeft: LeftIcon ? `calc(${parseInt(iconPadding)}px * 2 + ${iconSize})` : iconPadding,
        paddingRight: RightIcon ? `calc(${parseInt(iconPadding)}px * 2 + ${iconSize})` : iconPadding,
      },
      "aria-invalid": hasError,
      ...(restProps as any),
      ref,
    };

    return (
      <div className={cn("relative flex items-center rounded-md", className)}>


        {as === "textarea" ? (
          <Textarea {...(sharedProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
        ) : (
          <Input
            {...(sharedProps as React.InputHTMLAttributes<HTMLInputElement>)}
            type={(restProps as React.InputHTMLAttributes<HTMLInputElement>).type || "text"}
          />
        )}


        {/* Left Icon */}
        {LeftIcon ? <span
          className="absolute inset-y-0 start-0 flex items-center pointer-events-none"
          style={{
            paddingLeft: iconPadding,
            paddingRight: iconPadding,
            height: inputHeight,
          }}
        >
          <LeftIcon {...commonIconProps} />
        </span> : null}

        {/* Right Icon */}
        {RightIcon ? <span
          className="absolute inset-y-0 end-0 flex items-center pe-4"
          style={{
            paddingLeft: iconPadding,
            paddingRight: iconPadding,
            height: inputHeight,
          }}
        >
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={disabled}
            onClick={onRightIconClick}
            className="p-0 m-0 rounded-md bg-transparent dark:bg-transparent"
            style={{ width: iconSize, height: iconSize }}
          >
            <RightIcon {...commonIconProps} />
          </Button>
        </span> : null}
      </div>
    );
  }
);

IconInput.displayName = "IconInput";
export default IconInput;
