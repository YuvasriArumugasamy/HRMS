import type { ReactNode } from "react";
import { useEffect } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  headerClassName?: string;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  headerClassName,
  className,
}: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-full m-4",
  };

  return (
    <div className={clsx("fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", className)}>
      <div
        className={clsx(
          "bg-white rounded-xl shadow-xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200",
          sizeClasses[size],
        )}
      >
        {/* Header */}
        <div
          className={clsx(
            "flex items-center justify-between px-6 py-4 border-b border-gray-100 rounded-t-xl",
            headerClassName || "bg-secondary-light",
          )}
        >
          <h2 className="text-lg font-bold text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-800 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}
