"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";

import { useEffect, useState } from "react";
interface TiptapProps {
  value?: string;
  onChange?: (content: string) => void;
}
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaLink,
  FaQuoteLeft,
  FaListUl,
  FaListOl,
  FaCheck,
  FaTable,
  FaHeading,
  FaImage,
  FaUnderline,
  FaHighlighter,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from "react-icons/fa";

const MenuBar = ({ editor }: { editor: any }) => {
  const [_, setUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const updateHandler = () => setUpdate((u) => u + 1);

    editor.on("update", updateHandler);
    editor.on("selectionUpdate", updateHandler);

    return () => {
      editor.off("update", updateHandler);
      editor.off("selectionUpdate", updateHandler);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 bg-[var(--primary)]/90 text-[var(--extra)] p-2 border-b border-gray-300">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        type="button"
        className={`p-2 rounded ${
          editor.isActive("bold") ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${
          editor.isActive("italic") ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaItalic />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded ${
          editor.isActive("strike") ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaStrikethrough />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded ${
          editor.isActive("code") ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaCode />
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("URL");
          if (url) {
            editor.chain().focus().toggleLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded ${
          editor.isActive("link") ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaLink />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded ${
          editor.isActive("underline") ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaUnderline />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-2 rounded ${
          editor.isActive("highlight") ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaHighlighter />
      </button>
      <button
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
        className={`p-2 rounded ${
          editor.isActive("heading", { level: 1 })
            ? "bg-[var(--secondary)]"
            : ""
        }`}
      >
        <FaHeading /> H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${
          editor.isActive("bulletList") ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaListUl />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${
          editor.isActive("orderedList") ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaListOl />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`p-2 rounded ${
          editor.isActive("taskList") ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaCheck />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded ${
          editor.isActive("blockquote") ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaQuoteLeft />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "left" }) ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaAlignLeft />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "center" })
            ? "bg-[var(--secondary)]"
            : ""
        }`}
      >
        <FaAlignCenter />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "right" }) ? "bg-[var(--secondary)]" : ""
        }`}
      >
        <FaAlignRight />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "justify" })
            ? "bg-[var(--secondary)]"
            : ""
        }`}
      >
        <FaAlignJustify />
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("URL da imagem");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="p-2 rounded"
      >
        <FaImage />
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
        className="p-2 rounded"
      >
        <FaTable />
      </button>
    </div>
  );
};

const Tiptap: React.FC<TiptapProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Comece a escrever aqui...",
      }),
    ],
    content: "<p>Escreva aqui...</p>",
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    const handler = () => {
      onChange?.(editor.getHTML());
    };

    editor.on("update", handler);

    return () => {
      editor.off("update", handler);
    };
  }, [editor, onChange]);

  return (
    <div className="border  border-gray-300 rounded-md shadow-sm w-full  mx-auto bg-gray-50 text-[var(--secondary)]">
      <MenuBar editor={editor} />
      <div className="p-4 prose max-w-none bg-[var(--extra)] text-[var(--primary)] min-h-[200px]  ">
        <div className="remove-tailwind">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
