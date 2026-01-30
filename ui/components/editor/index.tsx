"use client";

import { useDirection } from "@radix-ui/react-direction";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BubbleMenu } from "@tiptap/react/menus";
import type { UseEditorOptions } from "@tiptap/react";

import { cn } from "@/lib/utils";

import { Card } from "@/ui/primitives/card";
import { ScrollArea } from "@/ui/primitives/scroll-area";
import { EditorMenuBar } from "./editor-menu-bar";
import { useIsRtl } from "@/lib/hooks/use-is-rtl";
import { useEffect } from "react";

interface EditorProps extends UseEditorOptions {
  value?: string;
  onValueChange?: (value: string) => void;
  bubbleMenu?: boolean;
  placeholder?: string;
  className?: string;
}

export function Editor({
  value,
  onValueChange,
  bubbleMenu = false,
  placeholder,
  className,
  ...props
}: EditorProps) {
  const direction = useDirection();
  const isRtl = useIsRtl();

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          // ✅ Responsive padding & font sizes
          "px-2 py-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 " +
          "break-words text-sm sm:text-base md:text-lg " +
          "[&_p]:m-0 [&_.is-editor-empty]:before:absolute [&_.is-editor-empty]:before:top-2 " +
          "[&_.is-editor-empty]:before:cursor-text [&_.is-editor-empty]:before:text-muted-foreground " +
          "[&_.is-editor-empty]:before:content-[attr(data-placeholder)] prose prose-headings:font-normal " +
          "prose-headings:text-foreground prose-h1:text-xl sm:prose-h1:text-2xl md:prose-h1:text-3xl " +
          "prose-h2:text-lg sm:prose-h2:text-xl md:prose-h2:text-2xl prose-h3:text-base sm:prose-h3:text-lg " +
          "dark:prose-invert focus:outline-hidden",
          className
        ),
      },
    },
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: isRtl ? "right" : "left",
      }),
      Color,
      TextStyle,
      Image,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder:placeholder??"",
        showOnlyCurrent: true,
        emptyEditorClass:
          "text-current dark:text-current opacity-50 pointer-events-none", // same font & color as editor
        emptyNodeClass:
          "before:content-[attr(data-placeholder)] before:text-current before:opacity-50 before:pointer-events-none",
      })
      ,
      Typography,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onValueChange?.(editor.getHTML());
    },
    ...props,
  });

  // inside your Editor component, after editor is initialized
useEffect(() => {
  if (editor && value !== undefined && value !== editor.getHTML()) {
    editor.commands.setContent(value);
  }
}, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <Card className="w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
      {bubbleMenu ? (
        <BubbleMenu
          editor={editor}
          className="z-50 h-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-hidden"
          options={{
            placement: "top",
            strategy: "fixed",
            offset: 4,
          }}
        >
          <EditorMenuBar editor={editor} />
        </BubbleMenu>
      ) : (
        <EditorMenuBar editor={editor} />
      )}

      <ScrollArea
        className={cn(
          "flex flex-col min-h-[8rem] sm:min-h-[10rem] md:min-h-[12rem] lg:min-h-[14rem] xl:min-h-[16rem] " +
          "rounded-md cursor-text " +
          "max-h-[20rem] sm:max-h-[25rem] md:max-h-[30rem] lg:max-h-[35rem] xl:max-h-[40rem] " +
          "overflow-y-auto " +
          "m-1 sm:m-1 md:m-2 lg:m-3 xl:m-4", // ✅ smaller margin
          !bubbleMenu && "border-t border-border",
          editor.isFocused && "outline-hidden ring-1 ring-ring"
        )}
      >
        <EditorContent
          editor={editor}
          dir={direction}
          className={cn(
            editor.isActive({ textAlign: "left" }) &&
            "[&_.is-editor-empty]:before:left-3",
            editor.isActive({ textAlign: "right" }) &&
            "[&_.is-editor-empty]:before:right-3",
            editor.isActive({ textAlign: "center" }) &&
            "[&_.is-editor-empty]:before:left-1/2 [&_.is-editor-empty]:before:absolute [&_.is-editor-empty]:before:-translate-x-1/2",
            editor.isActive({ textAlign: "justify" }) &&
            "[&_.is-editor-empty]:before:left-3"
          )}
          onClick={() => editor.commands.focus()}
        />
      </ScrollArea>
    </Card>
  );
}
