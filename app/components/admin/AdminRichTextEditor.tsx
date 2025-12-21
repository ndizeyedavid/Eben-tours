"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useMemo } from "react";

export type TipTapDoc = Record<string, any>;

function ToolbarButton({
  active,
  label,
  onClick,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-lg bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white"
          : "rounded-lg border border-emerald-900/10 bg-white px-3 py-2 text-xs font-extrabold text-[var(--color-secondary)] hover:bg-emerald-50"
      }
    >
      {label}
    </button>
  );
}

export default function AdminRichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: TipTapDoc | null;
  onChange: (doc: TipTapDoc) => void;
  placeholder?: string;
}) {
  const extensions = useMemo(
    () => [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Image,
      Placeholder.configure({
        placeholder: placeholder ?? "Write your post...",
      }),
    ],
    [placeholder]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value ?? undefined,
    editorProps: {
      attributes: {
        class:
          "min-h-[260px] rounded-2xl border border-emerald-900/10 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-secondary)] outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as TipTapDoc);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getJSON();
    const currentStr = JSON.stringify(current);
    const nextStr = JSON.stringify(value ?? null);
    if (currentStr !== nextStr && value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-900/10 bg-[#f6f8f7] p-2">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />
        <ToolbarButton
          label="Bullet"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Number"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={() => {
            const prev = editor.getAttributes("link").href as
              | string
              | undefined;
            const url = window.prompt("Enter URL", prev ?? "https://");
            if (url === null) return;
            if (!url) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
        />
        <ToolbarButton
          label="Image"
          onClick={() => {
            const url = window.prompt("Image URL", "https://");
            if (!url) return;
            editor.chain().focus().setImage({ src: url }).run();
          }}
        />
        <ToolbarButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>

      <EditorContent editor={editor} />

      <div className="text-xs font-semibold text-[var(--muted)]">
        Stored as TipTap JSON (DB-friendly).
      </div>
    </div>
  );
}
