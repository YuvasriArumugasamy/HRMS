import { useState } from "react";
import clsx from "clsx";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  rightElement?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function FormSection({
  title,
  children,
  defaultOpen = true,
  rightElement,
  className,
  contentClassName,
}: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200",
        className,
      )}
    >
      <div
        className={clsx(
          "bg-[#003B5C] px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer select-none",
          isOpen ? "rounded-t-xl rounded-b-none" : "rounded-xl",
        )}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest(".section-action")) return;
          setIsOpen(true);
        }}
      >
        <div className="w-8" />
        <h2 className="text-white text-center font-semibold flex items-center gap-2 flex-1 justify-center">
          {title}
        </h2>
        <div className="w-auto min-w-8 flex justify-end section-action">
          {rightElement}
        </div>
      </div>
      {isOpen && (
        <div className={clsx("p-6 animate-fadeIn", contentClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}