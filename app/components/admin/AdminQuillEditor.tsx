"use client";

import { useEffect, useMemo, useRef } from "react";

export type QuillDelta = { ops: any[] };

export default function AdminQuillEditor({
  value,
  onChange,
}: {
  value: QuillDelta;
  onChange: (delta: QuillDelta) => void;
}) {
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<any>(null);
  const lastValueRef = useRef<string>(JSON.stringify(value));

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ font: [] }, { size: [] }],
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = useMemo(
    () => [
      "font",
      "size",
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "script",
      "list",
      "indent",
      "align",
      "blockquote",
      "code-block",
      "link",
      "image",
    ],
    []
  );

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!toolbarRef.current || !editorRef.current) return;
      if (quillRef.current) return;

      const QuillImport = (await import("quill")).default;
      if (!mounted) return;

      const quill = new QuillImport(editorRef.current, {
        theme: "snow",
        modules: {
          ...modules,
          toolbar: toolbarRef.current,
        },
        formats,
      });

      quillRef.current = quill;

      try {
        quill.setContents(value as any);
        lastValueRef.current = JSON.stringify(value);
      } catch {
        // ignore invalid content
      }

      quill.on("text-change", () => {
        const next = quill.getContents() as unknown as QuillDelta;
        const nextStr = JSON.stringify(next);
        lastValueRef.current = nextStr;
        onChange(next);
      });
    };

    init();

    return () => {
      mounted = false;
    };
  }, [formats, modules, onChange, value]);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    const nextStr = JSON.stringify(value);
    if (nextStr === lastValueRef.current) return;

    try {
      const selection = quill.getSelection();
      quill.setContents(value as any);
      if (selection) quill.setSelection(selection);
      lastValueRef.current = nextStr;
    } catch {
      // ignore invalid content
    }
  }, [value]);

  return (
    <div className="rounded-2xl h-full overflow-hidden border border-emerald-900/10 bg-white">
      <div className="rounded-t-2xl border-b border-emerald-900/10 bg-white">
        <div
          ref={toolbarRef}
          className="ql-toolbar ql-snow rounded-t-2xl border-0"
        >
          <span className="ql-formats">
            <select className="ql-font" />
            <select className="ql-size" />
          </span>
          <span className="ql-formats">
            <select className="ql-header">
              <option value="1" />
              <option value="2" />
              <option value="3" />
              <option />
            </select>
          </span>
          <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
          </span>
          <span className="ql-formats">
            <select className="ql-color" />
            <select className="ql-background" />
          </span>
          <span className="ql-formats">
            <button className="ql-script" value="sub" />
            <button className="ql-script" value="super" />
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
          </span>
          <span className="ql-formats">
            <select className="ql-align" />
          </span>
          <span className="ql-formats">
            <button className="ql-blockquote" />
            <button className="ql-code-block" />
          </span>
          <span className="ql-formats">
            <button className="ql-link" />
            <button className="ql-image" />
          </span>
          <span className="ql-formats">
            <button className="ql-clean" />
          </span>
        </div>
      </div>

      <div className="ql-container ql-snow rounded-b-2xl border-0!">
        <div
          ref={editorRef}
          className="ql-editor min-h-[210px] text-sm font-semibold text-[var(--color-secondary)]"
        />
      </div>
    </div>
  );
}
