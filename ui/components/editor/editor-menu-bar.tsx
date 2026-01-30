"use client";

import { useRef } from "react";
import { Check, LinkIcon, Palette, Type, Unlink } from "lucide-react";

import type { DynamicIconNameType } from "@/types";
import type { ChainedCommands, Editor } from "@tiptap/react";

import { cn } from "@/lib/utils";

import { Button } from "@/ui/primitives/button";
import { Input } from "@/ui/primitives/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/primitives/popover";
import { Separator } from "@/ui/primitives/separator";
import { Toggle } from "@/ui/primitives/toggle";
import { DynamicIcon } from "../dynamic-icon";

interface SizeType {
  label: string;
  level: 1 | 2 | 3;
  textSize: `text-${string}`;
}

const sizes: SizeType[] = [
  { label: "Normal", level: 3, textSize: "text-xs" },
  { label: "Large", level: 2, textSize: "text-sm" },
  { label: "Extra Large", level: 1, textSize: "text-base" },
];

function SizeHandler({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 sm:h-7 sm:w-7"
          aria-label="Select text style"
        >
          <Type className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="min-w-[6rem] sm:min-w-[7rem] p-1 text-xs"
      >
        <div className="flex flex-col">
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={cn(
              "justify-start px-2 py-1 text-left text-xs",
              editor.isActive("paragraph") && "bg-muted"
            )}
          >
            Small
          </Button>
          {sizes.map((size: SizeType) => (
            <Button
              key={size.level}
              variant="ghost"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: size.level })
                  .run()
              }
              className={cn(
                "justify-start px-2 py-1 text-left",
                size.textSize,
                editor.isActive("heading", { level: size.level }) && "bg-muted"
              )}
            >
              {size.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface FormatType {
  format: string;
  iconName: DynamicIconNameType;
}

const formats: FormatType[] = [
  { format: "bold", iconName: "Bold" },
  { format: "italic", iconName: "Italic" },
  { format: "underline", iconName: "Underline" },
  { format: "strike", iconName: "Strikethrough" },
];

function FormatHandler({
  editor,
  format,
  iconName,
}: {
  editor: Editor;
  format: string;
  iconName: DynamicIconNameType;
}) {
  const toggleCommands: Record<string, () => ChainedCommands> = {
    bold: () => editor.chain().focus().toggleBold(),
    italic: () => editor.chain().focus().toggleItalic(),
    underline: () => editor.chain().focus().toggleUnderline(),
    strike: () => editor.chain().focus().toggleStrike(),
  };

  function handlePressChange() {
    const command = toggleCommands[format];
    if (command) command().run();
  }

  return (
    <Toggle
      size="sm"
      pressed={editor.isActive(format)}
      onPressedChange={handlePressChange}
      aria-label={`Toggle ${format} format`}
      className="h-6 w-6 sm:h-7 sm:w-7"
    >
      <DynamicIcon name={iconName} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
    </Toggle>
  );
}

interface AlignmentType {
  alignment: "left" | "center" | "right" | "justify";
  iconName: DynamicIconNameType;
}

const alignments: AlignmentType[] = [
  { alignment: "left", iconName: "TextAlignStart" },
  { alignment: "center", iconName: "TextAlignCenter" },
  { alignment: "right", iconName: "TextAlignEnd" },
  { alignment: "justify", iconName: "TextAlignJustify" },
] as const;

interface AlignmentHandlerProps {
  editor: Editor;
  alignment: "left" | "center" | "right" | "justify";
  iconName: DynamicIconNameType;
}

function AlignmentHandler({
  editor,
  alignment,
  iconName,
}: AlignmentHandlerProps) {
  const isActive = editor.isActive({ textAlign: alignment });

  const handleToggle = () => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  return (
    <Toggle
      size="sm"
      pressed={isActive}
      onPressedChange={handleToggle}
      aria-label={`Switch ${alignment} alignment`}
      className="h-6 w-6 sm:h-7 sm:w-7"
    >
      <DynamicIcon name={iconName} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
    </Toggle>
  );
}

function LinkHandler({ editor }: { editor: Editor }) {
  const isLinkActive = editor.isActive("link");

  return isLinkActive ? (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-6 w-6 sm:h-7 sm:w-7"
      onClick={() => editor.chain().focus().unsetLink().run()}
      aria-label="Remove link"
    >
      <Unlink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
    </Button>
  ) : (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 sm:h-7 sm:w-7"
          aria-label="Insert link"
        >
          <LinkIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex items-center gap-2 p-2 text-xs">
        <p className="shrink-0">Insert link</p>
        <Input
          autoFocus
          type="text"
          placeholder="https://example.com"
          className="h-6 px-2 text-xs sm:h-7"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editor
                .chain()
                .focus()
                .setLink({
                  href: (e.target as HTMLInputElement).value,
                })
                .run();
            }
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 sm:h-7 sm:w-7"
          onClick={(e) => {
            editor
              .chain()
              .focus()
              .setLink({
                href: (e.target as HTMLInputElement).value,
              })
              .run();
          }}
          aria-label="Submit"
        >
          <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function ColorHandler({ editor }: { editor: Editor }) {
  const selectedColor = editor.getAttributes("textStyle").color;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-6 w-6 sm:h-7 sm:w-7 relative overflow-hidden"
      onClick={() => inputRef.current?.click()}
      aria-label="Select text color"
    >
      <Palette
        style={{ color: selectedColor }}
        className="h-3 w-3 sm:h-3.5 sm:w-3.5"
      />
      <Input
        ref={inputRef}
        type="color"
        value={selectedColor}
        onChange={(e) =>
          editor
            .chain()
            .focus()
            .setColor(e.target.value as string)
            .run()
        }
        className="sr-only"
        tabIndex={-1}
      />
    </Button>
  );
}

export function EditorMenuBar({ editor }: { editor: Editor }) {
  return (
    <div
      className="
        flex flex-wrap items-center
        gap-1 sm:gap-1.5
        p-1 sm:p-1.5
        text-xs
      "
      aria-label="Editor Menu Bar"
    >
      <SizeHandler editor={editor} />
      <ColorHandler editor={editor} />

      <Separator orientation="vertical" className="h-3 sm:h-4" />

      {formats.map(({ format, iconName }) => (
        <FormatHandler
          key={format}
          editor={editor}
          format={format}
          iconName={iconName}
        />
      ))}

      <Separator orientation="vertical" className="h-3 sm:h-4" />

      <div className="flex gap-1">
        {alignments.map(({ alignment, iconName }) => (
          <AlignmentHandler
            key={alignment}
            editor={editor}
            alignment={alignment}
            iconName={iconName}
          />
        ))}
      </div>
    </div>
  );
}
