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

// Importe os ícones de alguma biblioteca, como react-icons
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

// Componente da barra de ferramentas
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-300">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${
          editor.isActive("bold") ? "bg-gray-200" : ""
        }`}
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${
          editor.isActive("italic") ? "bg-gray-200" : ""
        }`}
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded ${
          editor.isActive("strike") ? "bg-gray-200" : ""
        }`}
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded ${
          editor.isActive("code") ? "bg-gray-200" : ""
        }`}
      >
        <FaCode />
      </button>
      <button
        onClick={() => {
          const url = window.prompt("URL");
          if (url) {
            editor.chain().focus().toggleLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded ${
          editor.isActive("link") ? "bg-gray-200" : ""
        }`}
      >
        <FaLink />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded ${
          editor.isActive("underline") ? "bg-gray-200" : ""
        }`}
      >
        <FaUnderline />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-2 rounded ${
          editor.isActive("highlight") ? "bg-gray-200" : ""
        }`}
      >
        <FaHighlighter />
      </button>
      <button
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
        className={`p-2 rounded ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
        }`}
      >
        <FaHeading /> H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${
          editor.isActive("bulletList") ? "bg-gray-200" : ""
        }`}
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${
          editor.isActive("orderedList") ? "bg-gray-200" : ""
        }`}
      >
        <FaListOl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`p-2 rounded ${
          editor.isActive("taskList") ? "bg-gray-200" : ""
        }`}
      >
        <FaCheck />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded ${
          editor.isActive("blockquote") ? "bg-gray-200" : ""
        }`}
      >
        <FaQuoteLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
        }`}
      >
        <FaAlignLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
        }`}
      >
        <FaAlignCenter />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
        }`}
      >
        <FaAlignRight />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
        }`}
      >
        <FaAlignJustify />
      </button>
      <button
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

// Componente principal do Tiptap
const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Adicionando funcionalidades que já estão no StarterKit, mas com configurações
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
    content: "<p>Hello World! 🌎️</p>",
    immediatelyRender: false,
  });

  return (
    <div className="border border-gray-300 rounded-md shadow-sm w-full max-w-3xl mx-auto bg-gray-50 text-[var(--secondary)]">
      <MenuBar editor={editor} />
      <div className="p-4 prose max-w-none bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;
