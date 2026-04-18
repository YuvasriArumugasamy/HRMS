import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

type FormatCommand = "bold" | "italic" | "underline";
type AlignCommand = "justifyLeft" | "justifyCenter" | "justifyRight";

type TextSize = "small" | "normal" | "large" | "huge";

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

const TEXT_SIZE_MAP: Record<TextSize, string> = {
  small: "12",
  normal: "15",
  large: "18",
  huge: "24",
};

const TEXT_SIZE_LABELS: Record<TextSize, string> = {
  small: "Small",
  normal: "Normal",
  large: "Large",
  huge: "Huge",
};

function pxToSize(px: string): TextSize {
  const n = parseInt(px);
  if (n <= 12) return "small";
  if (n <= 15) return "normal";
  if (n <= 18) return "large";
  return "huge";
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Enter your message...",
  className = "",
  minHeight = "120px",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [currentFont, setCurrentFont] = useState("Plus Jakarta Sans");
  const [currentSize, setCurrentSize] = useState<TextSize>("normal");

  const pendingSizeRef = useRef<string | null>(null);
  const typingSpanRef = useRef<HTMLSpanElement | null>(null);

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  useEffect(() => {
    if (editorRef.current && value && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // Debounced onChange — prevents re-rendering parent on every keystroke
  const debouncedOnChange = useMemo(
    () => debounce((html) => { onChange?.(html as any); }, 150),
    [onChange]
  );

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      debouncedOnChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  }, [debouncedOnChange]);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    if (document.queryCommandState("justifyLeft")) formats.add("justifyLeft");
    if (document.queryCommandState("justifyCenter")) formats.add("justifyCenter");
    if (document.queryCommandState("justifyRight")) formats.add("justifyRight");
    setActiveFormats(formats);
  }, []);

  const updateSelectionStyles = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const focusNode = selection.focusNode;
    const parent =
      focusNode?.nodeType === Node.TEXT_NODE
        ? focusNode.parentElement
        : (focusNode as Element | null);
    if (!parent) return;

    const computed = window.getComputedStyle(parent as Element);

    const rawFont = computed.fontFamily.replace(/['"]/g, "").split(",")[0].trim();
    const fontMatches = ["Arial", "Georgia", "Verdana", "Courier New", "Plus Jakarta Sans"].find(
      (f) => rawFont.toLowerCase() === f.toLowerCase()
    );
    setCurrentFont(fontMatches || "Plus Jakarta Sans");

    const sizeStr = parseInt(computed.fontSize).toString();
    setCurrentSize(pxToSize(sizeStr));
  }, []);

  // Debounced selectionchange — getComputedStyle is expensive, no need to run on every keystroke
  const debouncedSelectionUpdate = useMemo(
    () => debounce(() => { updateActiveFormats(); updateSelectionStyles(); }, 80),
    [updateActiveFormats, updateSelectionStyles]
  );

  useEffect(() => {
    document.addEventListener("selectionchange", debouncedSelectionUpdate);
    return () => document.removeEventListener("selectionchange", debouncedSelectionUpdate);
  }, [debouncedSelectionUpdate]);

  const execCommand = (command: string, value: string | boolean = false) => {
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(command, false, value.toString());
    editorRef.current?.focus();
    updateActiveFormats();
    handleInput();
  };

  const toggleFormat = (format: FormatCommand) => execCommand(format);
  const setAlignment = (align: AlignCommand) => execCommand(align);

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    setCurrentFont(font);
    execCommand("fontName", font);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sizeKey = e.target.value as TextSize;
    const size = TEXT_SIZE_MAP[sizeKey];
    setCurrentSize(sizeKey);

    const editor = editorRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    const hasSelection =
      selection && !selection.isCollapsed && selection.rangeCount > 0;

    if (hasSelection) {
      const range = selection.getRangeAt(0);
      const fragment = range.cloneContents();
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(fragment);

      const allEls = tempDiv.querySelectorAll("*");
      allEls.forEach((el) => {
        (el as HTMLElement).style.fontSize = "";
        if (el.tagName === "FONT") el.removeAttribute("size");
      });

      const span = document.createElement("span");
      span.style.fontSize = `${size}px`;
      while (tempDiv.firstChild) span.appendChild(tempDiv.firstChild);

      range.deleteContents();
      range.insertNode(span);

      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(newRange);

      editor.focus();
      handleInput();
    } else {
      pendingSizeRef.current = size;
      typingSpanRef.current = null;
      editor.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    document.execCommand("styleWithCSS", false, "true");

    if (
      pendingSizeRef.current &&
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      e.preventDefault();

      const size = pendingSizeRef.current;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);

      let span = typingSpanRef.current;
      const cursorAtSpanEnd =
        span &&
        range.collapsed &&
        range.startContainer === span &&
        range.startOffset === span.childNodes.length;

      if (!span || !cursorAtSpanEnd) {
        span = document.createElement("span");
        span.style.fontSize = `${size}px`;
        range.deleteContents();
        range.insertNode(span);
        typingSpanRef.current = span;
      }

      const textNode = document.createTextNode(e.key);
      span!.appendChild(textNode);

      const newRange = document.createRange();
      newRange.setStartAfter(textNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      handleInput();
    } else if (!["Shift", "Control", "Meta", "Alt"].includes(e.key)) {
      pendingSizeRef.current = null;
      typingSpanRef.current = null;
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <div
      className={`rte-wrapper ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .rte-wrapper {
          --rte-bg: #ffffff;
          --rte-toolbar-bg: #fafafa;
          --rte-border: #e4e4e7;
          --rte-border-hover: #a1a1aa;
          --rte-radius: 14px;
          --rte-text: #18181b;
          --rte-muted: #71717a;
          --rte-accent: #2563eb;
          --rte-active-bg: #18181b;
          --rte-active-fg: #ffffff;
          --rte-hover-bg: #f4f4f5;
          --rte-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);

          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          border: 1px solid var(--rte-border);
          border-radius: var(--rte-radius);
          background: var(--rte-bg);
          box-shadow: var(--rte-shadow);
          overflow: hidden;
          transition: box-shadow 0.2s, border-color 0.2s;
        }

        .rte-wrapper:focus-within {
          border-color: var(--rte-border-hover);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.09),
                      0 0 0 3px rgba(37,99,235,0.08);
        }

        .rte-toolbar {
          background: var(--rte-toolbar-bg);
          border-bottom: 1px solid var(--rte-border);
          padding: 7px 10px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 2px;
          user-select: none;
        }

        .rte-divider {
          width: 1px;
          height: 20px;
          background: var(--rte-border);
          margin: 0 5px;
          flex-shrink: 0;
        }

        .rte-btn {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 7px;
          color: var(--rte-muted);
          transition: background 0.13s, color 0.13s, transform 0.1s;
          flex-shrink: 0;
        }
        .rte-btn:hover { background: var(--rte-hover-bg); color: var(--rte-text); }
        .rte-btn:active { transform: scale(0.9); }
        .rte-btn.active { background: var(--rte-active-bg); color: var(--rte-active-fg); }
        .rte-btn.active:hover { background: #27272a; }

        .rte-sel-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .rte-sel-wrap::after {
          content: '';
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          border-left: 3px solid transparent;
          border-right: 3px solid transparent;
          border-top: 4px solid var(--rte-muted);
        }
        .rte-select {
          appearance: none;
          background: var(--rte-bg);
          border: 1px solid var(--rte-border);
          border-radius: 7px;
          height: 32px;
          padding: 0 26px 0 10px;
          font-size: 12.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 500;
          color: var(--rte-text);
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .rte-select:hover { border-color: var(--rte-border-hover); }
        .rte-select:focus {
          border-color: var(--rte-accent);
          box-shadow: 0 0 0 2px rgba(37,99,235,0.12);
        }
        .rte-font-sel { min-width: 118px; }
        .rte-size-sel { min-width: 82px; }

        .rte-editor {
          min-height: ${minHeight};
          max-height: 560px;
          overflow-y: auto;
          padding: 16px 18px;
          outline: none;
          font-size: 15px;
          line-height: 1.7;
          color: var(--rte-text);
          caret-color: var(--rte-accent);
        }
        .rte-editor:empty::before {
          content: attr(data-placeholder);
          color: #a1a1aa;
          pointer-events: none;
        }
        .rte-editor:focus { outline: none; }
        .rte-editor p { margin: 0 0 0.8em; }
        .rte-editor p:last-child { margin-bottom: 0; }
        .rte-editor::-webkit-scrollbar { width: 4px; }
        .rte-editor::-webkit-scrollbar-track { background: transparent; }
        .rte-editor::-webkit-scrollbar-thumb { background: var(--rte-border); border-radius: 99px; }
      `}</style>

      {/* Toolbar */}
      <div className="rte-toolbar" onClick={stopPropagation}>
        <button
          type="button"
          className={`rte-btn ${activeFormats.has("bold") ? "active" : ""}`}
          onClick={(e) => { stopPropagation(e); toggleFormat("bold"); }}
          title="Bold (Ctrl+B)"
        >
          <Bold size={15} />
        </button>

        <button
          type="button"
          className={`rte-btn ${activeFormats.has("italic") ? "active" : ""}`}
          onClick={(e) => { stopPropagation(e); toggleFormat("italic"); }}
          title="Italic (Ctrl+I)"
        >
          <Italic size={15} />
        </button>

        <button
          type="button"
          className={`rte-btn ${activeFormats.has("underline") ? "active" : ""}`}
          onClick={(e) => { stopPropagation(e); toggleFormat("underline"); }}
          title="Underline (Ctrl+U)"
        >
          <Underline size={15} />
        </button>

        <div className="rte-divider" />

        <button
          type="button"
          className={`rte-btn ${activeFormats.has("justifyLeft") ? "active" : ""}`}
          onClick={(e) => { stopPropagation(e); setAlignment("justifyLeft"); }}
          title="Align Left"
        >
          <AlignLeft size={15} />
        </button>

        <button
          type="button"
          className={`rte-btn ${activeFormats.has("justifyCenter") ? "active" : ""}`}
          onClick={(e) => { stopPropagation(e); setAlignment("justifyCenter"); }}
          title="Center"
        >
          <AlignCenter size={15} />
        </button>

        <button
          type="button"
          className={`rte-btn ${activeFormats.has("justifyRight") ? "active" : ""}`}
          onClick={(e) => { stopPropagation(e); setAlignment("justifyRight"); }}
          title="Align Right"
        >
          <AlignRight size={15} />
        </button>

        <div className="rte-divider" />

        <div className="rte-sel-wrap">
          <select
            className="rte-select rte-font-sel"
            value={currentFont}
            onChange={handleFontChange}
          >
            <option value="Plus Jakarta Sans">Default</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Courier New">Courier</option>
          </select>
        </div>

        <div className="rte-sel-wrap">
          <select
            className="rte-select rte-size-sel"
            value={currentSize}
            onChange={handleSizeChange}
          >
            {(Object.keys(TEXT_SIZE_LABELS) as TextSize[]).map((key) => (
              <option key={key} value={key}>
                {TEXT_SIZE_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        suppressContentEditableWarning
        onClick={() => {
          pendingSizeRef.current = null;
          typingSpanRef.current = null;
        }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        spellCheck
      />
    </div>
  );
};

export default RichTextEditor;